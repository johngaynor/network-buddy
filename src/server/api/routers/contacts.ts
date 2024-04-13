// import { z } from "zod";

import { create } from "domain";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const contactsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    // console.log("ctx", ctx); // there is a ctx.input property
    return ctx.db.contact.findMany({
      // where: {
      //   userId: '32352342'
      // },
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
  privateTest: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
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
