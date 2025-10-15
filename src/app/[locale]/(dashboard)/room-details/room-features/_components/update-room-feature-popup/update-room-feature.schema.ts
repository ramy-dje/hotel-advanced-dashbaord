import { z } from "zod";
// Create room feature zod validation schema

export const UpdateRoomFeatureValidationSchema = z
  .object({
    name: z.string().min(1, "The feature name is required"),
    icon: z.string().min(1, "Select an icon for the feature"),
  })
  .required();

export type UpdateRoomFeatureValidationSchemaType = z.infer<
  typeof UpdateRoomFeatureValidationSchema
>;
