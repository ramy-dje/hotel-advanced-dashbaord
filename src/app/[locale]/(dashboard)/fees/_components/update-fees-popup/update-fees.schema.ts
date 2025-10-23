import { z } from "zod";
// update tax zod validation schema

export const UpdateFeesValidationSchema = z
  .object({
    name: z.string().min(1, "The tax name is required"),
    type: z.enum(["percentage", "fixed"]),
    amount: z.number().min(1, "The tax amount is required"),
    })
  .strict();

export type UpdateFeesValidationSchemaType = z.infer<
  typeof UpdateFeesValidationSchema
>;
