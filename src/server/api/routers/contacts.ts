import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
});

export const contactsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const contacts = await ctx.db.contact.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        affiliation: true,
        notes: true,
        position: true,
        company: true,
        lastUpdated: true,
        Interactions: {
          take: 1,
          select: {
            title: true,
            date: true,
            Highlights: {
              select: {
                highlight: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    const filteredContacts = contacts.map((c) => {
      const { Interactions, ...rest } = c;

      const intTitle = Interactions[0]?.title ?? null;
      const intDate = Interactions[0]?.date ?? null;
      const intHighlights = Interactions[0]?.Highlights ?? [];

      const newContact = { ...rest, intTitle, intDate, intHighlights };
      return newContact;
    });
    return filteredContacts;
  }),
  new: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        affiliation: z.string().min(1),
        position: z.string().min(1),
        company: z.string().min(1),
        notes: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const contact = await ctx.db.contact.create({
        data: {
          userId,
          name: input.name,
          affiliation: input.affiliation,
          position: input.position,
          company: input.company,
          notes: input.notes,
          lastUpdated: new Date(),
        },
      });
      return contact;
    }),
  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const result = await ctx.db.contact.delete({
        where: { id: input.id },
      });

      return result;
    }),
});

// if there are no results, it will return an empty array
