import { z } from "zod";
// Create tax zod validation schema

export const CreateFeesValidationSchema = z
  .object({
    name: z.string().min(1, "The tax name is required"),
    type: z.enum(["percentage", "fixed"]),
    amount: z.number().min(1, "The tax amount is required"),
    })
  .strict();

export type CreateFeesValidationSchemaType = z.infer<
  typeof CreateFeesValidationSchema
>;
