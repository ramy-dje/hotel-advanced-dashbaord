import { z } from "zod";
// update blog category zod validation schema

export const UpdateServiceCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type UpdateServiceCategoryValidationSchemaType = z.infer<
  typeof UpdateServiceCategoryValidationSchema
>;
