import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
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
        Highlights: z.array(z.any()),
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

      return interaction;
    }),
  // updateAffiliation: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.contact.update({
  //     where: {
  //       userId: 'hello',
  //     },
  //     data: {
  //       Affiliation: {
  //         create: {
  //           data: {},
  //         },
  //       },
  //     },
  //   });
  // }),
});

// if there are no results, it will return an empty array
