// src/schemas/create-property-directory.schema.ts
import { z } from "zod";

export const CreatePropertyDirectoryValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Directory name is required")
    .trim(),
  type: z.enum(["top-level", "subdirectory"]),
  parent_id: z.string().optional(),
});

export type CreatePropertyDirectoryValidationSchemaType = z.infer<
  typeof CreatePropertyDirectoryValidationSchema
>;
