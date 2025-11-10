import { z } from "zod";
// Create blog category zod validation schema

export const CreateServiceCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type CreateServiceCategoryValidationSchemaType = z.infer<
  typeof CreateServiceCategoryValidationSchema
>;
