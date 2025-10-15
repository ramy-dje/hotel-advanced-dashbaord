import { z } from "zod";
// Update floor zod validation schema

export const UpdateFloorValidationSchema = z
  .object({
    name: z.string().min(1, "The floor name is required"),
    level: z
      .number({ message: "The floor level is required" })
      .min(0, "Please add a valid level number"),
    range_start: z.number().min(0, "Please add a valid start range number"),
    range_end: z.number().min(0, "Please add a valid end range number"),
  })
  .strict();

export type UpdateFloorValidationSchemaType = z.infer<
  typeof UpdateFloorValidationSchema
>;
