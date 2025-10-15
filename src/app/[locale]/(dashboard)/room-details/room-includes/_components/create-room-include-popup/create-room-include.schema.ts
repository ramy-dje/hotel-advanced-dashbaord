import { z } from "zod";
// Create room include zod validation schema

export const CreateRoomIncludeValidationSchema = z
  .object({
    name: z.string().min(1, "The include name is required"),
  })
  .strict();

export type CreateRoomIncludeValidationSchemaType = z.infer<
  typeof CreateRoomIncludeValidationSchema
>;
