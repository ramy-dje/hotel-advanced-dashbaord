import { z } from "zod";
// update rate category zod validation schema

export const UpdateRatePlanCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
  })
  .strict();

export type UpdateRatePlanCategoryValidationSchemaType = z.infer<
  typeof UpdateRatePlanCategoryValidationSchema
>;
