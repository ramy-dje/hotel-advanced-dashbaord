import { z } from "zod";
// update food ingredient zod validation schema

export const UpdateFoodIngredientValidationSchema = z
  .object({
    name: z.string().min(1, "The ingredient name is reburied"),
  })
  .strict();

export type UpdateFoodIngredientValidationSchemaType = z.infer<
  typeof UpdateFoodIngredientValidationSchema
>;
