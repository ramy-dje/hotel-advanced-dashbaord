import { z } from "zod";
// Update food dish zod validation schema

export const UpdateFoodDishValidationSchema = z
  .object({
    // main info section
    name: z.string().min(1, "The name is required"),
    description: z.string(),
    // price
    price: z.number().min(0, "The price should be valid"),
    // image
    image: z.any().refine((arg: File | string) => {
      if (arg instanceof File || typeof arg == "string") return true;
      else return false;
    }, "The dish image is required"),
    // old image url
    image_old_url: z.string().optional(),
    // image
    image_url: z.string().or(z.undefined()).optional(),
    // type
    type: z.string().optional().or(z.null()),
    // ingredients
    ingredients: z.array(z.string()),
    // old ingredients
    old_ingredients: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
  })
  .required();

export type UpdateFoodDishValidationSchemaType = z.infer<
  typeof UpdateFoodDishValidationSchema
>;
