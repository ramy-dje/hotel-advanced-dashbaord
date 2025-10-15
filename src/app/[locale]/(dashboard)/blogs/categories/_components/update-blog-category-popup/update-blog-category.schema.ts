import { z } from "zod";
// update blog category zod validation schema

export const UpdateBlogCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type UpdateBlogCategoryValidationSchemaType = z.infer<
  typeof UpdateBlogCategoryValidationSchema
>;
