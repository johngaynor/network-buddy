import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
});

export const interactionsRouter = createTRPCRouter({
  getByContact: privateProcedure
    .input(
      z.object({
        contactId: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!input.contactId) return;
      return ctx.db.interactions.findMany({
        where: {
          contactId: input.contactId,
        },
        select: {
          id: true,
          title: true,
          location: true,
          date: true,
          Highlights: {
            select: {
              highlight: true,
              id: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  new: privateProcedure
    .input(
      z.object({
        contactId: z.number(),
        title: z.string().min(1),
        location: z.string().min(1),
        date: z.date(),
        Highlights: z.array(z.object({ highlight: z.string() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const { contactId, title, location, date, Highlights } = input;
      const filteredHighlights = Highlights.filter((h) => h.highlight !== "");

      const interaction = await ctx.db.interactions.create({
        data: {
          contactId,
          title,
          location,
          date,
          Highlights: {
            create: filteredHighlights,
          },
        },
      });

      const updateContact = await ctx.db.contact.update({
        where: { id: contactId },
        data: { lastUpdated: new Date() },
      });

      return interaction;
    }),
  edit: privateProcedure
    .input(
      z.object({
        contactId: z.number(),
        interactionId: z.number(),
        title: z.string().min(1),
        location: z.string().min(1),
        date: z.date(),
        Highlights: z.array(
          z.object({
            highlight: z.string(),
            id: z.number().optional(),
            isDeleted: z.boolean().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const { contactId, interactionId, title, location, date, Highlights } =
        input;

      const deletePromises = Highlights.filter(
        (h) => h.id && (h.highlight === "" || h.isDeleted),
      ).map(
        async (h) => await ctx.db.highlights.delete({ where: { id: h.id } }),
      );

      const updatePromises = Highlights.filter(
        (h) => h.highlight !== "" && h.id && !h.isDeleted,
      ).map(
        async (h) =>
          await ctx.db.highlights.update({
            where: { id: h.id },
            data: { highlight: h.highlight },
          }),
      );

      const createPromises = Highlights.filter(
        (h) => !h.id && h.highlight !== "",
      ).map(
        async (h) =>
          await ctx.db.highlights.create({
            data: {
              interactionId,
              highlight: h.highlight,
            },
          }),
      );

      await Promise.all([
        ...deletePromises,
        ...updatePromises,
        ...createPromises,
      ]);

      const interaction = await ctx.db.interactions.update({
        where: { id: interactionId },
        data: {
          title,
          location,
          date,
        },
      });

      const updateContact = await ctx.db.contact.update({
        where: { id: contactId },
        data: { lastUpdated: new Date() },
      });

      return interaction;
    }),
  delete: privateProcedure
    .input(
      z.object({
        contactId: z.number(),
        interactionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const { contactId, interactionId } = input;

      const highlights = await ctx.db.highlights.deleteMany({
        where: { interactionId },
      });

      const interaction = await ctx.db.interactions.delete({
        where: { id: interactionId },
      });

      const updateContact = await ctx.db.contact.update({
        where: { id: contactId },
        data: { lastUpdated: new Date() },
      });

      return interaction;
    }),
});

// if there are no results, it will return an empty array
