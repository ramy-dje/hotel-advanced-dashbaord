import { z } from "zod";
// Create blog category zod validation schema

export const CreateBlogCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type CreateBlogCategoryValidationSchemaType = z.infer<
  typeof CreateBlogCategoryValidationSchema
>;
