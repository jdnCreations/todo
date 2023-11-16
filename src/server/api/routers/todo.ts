import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.todo.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          active: input.active,
        },
      });
    }),
});
