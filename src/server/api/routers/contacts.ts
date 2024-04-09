// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contactsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.contact.findMany({
      // where: {
      //   userId: '32352342'
      // },
      include: {
        Interactions: {
          select: {
            title: true,
            location: true,
            date: true,
            Highlights: {
              select: {
                id: true,
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
