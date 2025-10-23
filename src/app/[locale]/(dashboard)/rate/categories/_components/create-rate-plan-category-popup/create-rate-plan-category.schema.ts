import { z } from "zod";
// Create rate category zod validation schema

export const CreateRatePlanCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type CreateRatePlanCategoryValidationSchemaType = z.infer<
  typeof CreateRatePlanCategoryValidationSchema
>;
