import { z } from "zod";

// Update File zod validation schema

export const UpdateFileValidationSchema = z
  .object({
    // originalname
    originalname: z.string().min(1, "File name is required"),
    alt: z.string().optional(),
  })
  .strict();

export type UpdateFileValidationSchemaType = z.infer<
  typeof UpdateFileValidationSchema
>;
