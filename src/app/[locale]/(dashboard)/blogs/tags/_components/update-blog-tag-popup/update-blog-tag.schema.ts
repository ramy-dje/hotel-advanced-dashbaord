import { z } from "zod";
// update blog tag zod validation schema

export const UpdateBlogTagValidationSchema = z
  .object({
    name: z.string().min(1, "The tag name is required"),
  })
  .strict();

export type UpdateBlogTagValidationSchemaType = z.infer<
  typeof UpdateBlogTagValidationSchema
>;
