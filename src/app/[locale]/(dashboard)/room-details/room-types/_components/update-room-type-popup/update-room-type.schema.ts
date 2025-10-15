import { z } from "zod";
// Create room type zod validation schema

export const UpdateRoomTYpeValidationSchema = z
  .object({
    name: z.string().min(1, "The type name is required"),
  })
  .required();

export type UpdateRoomTYpeValidationSchemaType = z.infer<
  typeof UpdateRoomTYpeValidationSchema
>;
