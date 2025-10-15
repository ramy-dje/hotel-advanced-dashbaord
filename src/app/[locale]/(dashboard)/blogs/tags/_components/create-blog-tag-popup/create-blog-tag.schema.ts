import { z } from "zod";
// Create blog tag zod validation schema

export const CreateBlogTagValidationSchema = z
  .object({
    name: z.string().min(1, "The tag name is required"),
  })
  .strict();

export type CreateBlogTagValidationSchemaType = z.infer<
  typeof CreateBlogTagValidationSchema
>;
