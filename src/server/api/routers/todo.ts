import { connect } from "http2";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { todoInput } from "~/types";

export const todoRouter = createTRPCRouter({

  all: protectedProcedure.query(async ({ctx}) => {
   
    const todos = await ctx.prisma.todo.findMany({
      where:{
        userId: ctx.session.user.id
      }
    })
   ///Needs to be chancged to return
    console.log("todos from primsa" , todos.map(({id, text, done}) => ({id, text, done})));
    
    return [{
      id: "fake",
      text: "fake text",
      done: false,
    },
    {
      id: "fake2",
      text: "fake text2",
      done: true,
    }]
  }),

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ctx, input}) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          }
        }
      })
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ctx, input}) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        }
     
    })
  }),

  toggle: protectedProcedure
  .input(z.object({
    id: z.string(),
    done: z.boolean()
  }))
  .mutation(async ({ctx, input: {id, done}}) => {
    return ctx.prisma.todo.update({
      where: {
        id
      },
      data: {
        done 
      }  
  })
})

});
