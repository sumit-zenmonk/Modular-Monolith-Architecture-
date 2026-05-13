import { z } from "zod"

export const PostSchema = z.object({
    title: z.string().min(2, "Title is too small").max(255,"Title is too large"),
    content: z.string().min(5, "Content is too small").max(500,"Title is too large"),
})

export type PostSchemaFormType = z.infer<typeof PostSchema>