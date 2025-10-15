import { z } from "zod";
// Create food type zod validation schema

export const CreateFoodTypeValidationSchema = z
  .object({
    name: z.string().min(1, "The type name is required"),
  })
  .strict();

export type CreateFoodTypeValidationSchemaType = z.infer<
  typeof CreateFoodTypeValidationSchema
>;
