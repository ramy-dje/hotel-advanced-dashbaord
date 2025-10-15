import { z } from "zod";
// update food type zod validation schema

export const UpdateFoodTypeValidationSchema = z
  .object({
    name: z.string().min(1, "The type name is required"),
  })
  .strict();

export type UpdateFoodTypeValidationSchemaType = z.infer<
  typeof UpdateFoodTypeValidationSchema
>;
