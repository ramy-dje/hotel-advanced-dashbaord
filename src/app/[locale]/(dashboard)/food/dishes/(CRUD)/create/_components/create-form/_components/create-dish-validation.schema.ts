import { z } from "zod";
// Create food dish zod validation schema

export const CreateFoodDishValidationSchema = z
  .object({
    // main info section
    name: z.string().min(1, "The name is required"),
    description: z.string(),
    // price
    price: z.number().min(0, "The price should be valid"),
    // image
    image: z.any().refine((arg: File) => {
      if (!(arg instanceof File)) return false;
      return true;
    }, "The dish image is required"),
    // type
    type: z.string().optional().or(z.null()),
    // ingredients
    ingredients: z.array(z.string()),
    // image
    image_url: z.string().optional(),
  })
  .required();

export type CreateFoodDishValidationSchemaType = z.infer<
  typeof CreateFoodDishValidationSchema
>;
