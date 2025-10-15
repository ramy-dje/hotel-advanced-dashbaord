import { z } from "zod";
// Create food ingredient zod validation schema

export const CreateFoodIngredientValidationSchema = z
  .object({
    name: z.string().min(1, "The ingredient name is reburied"),
  })
  .strict();

export type CreateFoodIngredientValidationSchemaType = z.infer<
  typeof CreateFoodIngredientValidationSchema
>;
