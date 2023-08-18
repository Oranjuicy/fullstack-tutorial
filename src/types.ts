import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "./server/api/root";
import { Router } from "next/router";

type RouterOuputs = inferRouterOutputs<AppRouter>;
type allTodosOutput = RouterOuputs["todo"]["all"]

export type Todo = allTodosOutput[number]

export const todoInput  = z.string({
    required_error: "Add you todo item",
})
.min(1)
.max(50);