import { z } from "zod";

export const todoInput  = z.string({
    required_error: "Add you todo item",
})
.min(1)
.max(50);