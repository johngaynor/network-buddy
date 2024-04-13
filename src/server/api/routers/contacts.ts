// import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const contactsRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const userId = ctx.userId;
    return ctx.db.contact.findMany({
      where: {
        userId: userId,
      },
      select: {
        name: true,
        affiliation: true,
        notes: true,
        position: true,
        company: true,
        Interactions: {
          select: {
            title: true,
            location: true,
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
  }),
  // newContact: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.contact.create({
  //     data: {
  //       userId: "...",
  //       name: "TEST CREATE",
  //     },
  //   });
  // }),
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
