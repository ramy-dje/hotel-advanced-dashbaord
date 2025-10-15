import { z } from "zod";
// Update food menu zod validation schema

export const UpdateFoodMenuValidationSchema = z
  .object({
    // main info section
    name: z.string().min(1, "The name should is required"),
    // sections
    sections: z
      .array(
        z.object({
          title: z.string(),
          sub_title: z.string(),
          des: z.string(),
          id: z.string(),
          notes: z.array(
            z.object({
              name: z.string(),
              id: z.string(),
            })
          ),
          dishes: z.array(
            z.object({
              name: z.string(),
              id: z.string(),
            })
          ),
          featuredDish: z.string(),
        })
      )
      .refine(
        (arg) => arg.length >= 1,
        "The menu should have at least 1 section"
      ),
  })
  .required();

export type UpdateFoodMenuValidationSchemaType = z.infer<
  typeof UpdateFoodMenuValidationSchema
>;
