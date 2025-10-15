// src/schemas/create-property-directory.schema.ts
import { z } from "zod";

export const CreatePropertyTypeValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Type name is required")
    .trim(),
});

export type CreatePropertyTypeValidationSchemaType = z.infer<
  typeof CreatePropertyTypeValidationSchema
>;
