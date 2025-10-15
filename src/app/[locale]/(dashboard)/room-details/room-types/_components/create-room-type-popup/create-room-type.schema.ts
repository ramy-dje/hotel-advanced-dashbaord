import { z } from "zod";
// Create room type zod validation schema

export const CreateRoomTypeValidationSchema = z
  .object({
    name: z.string().min(1, "The type name is required"),
  })
  .strict();

export type CreateRoomTypeValidationSchemaType = z.infer<
  typeof CreateRoomTypeValidationSchema
>;
