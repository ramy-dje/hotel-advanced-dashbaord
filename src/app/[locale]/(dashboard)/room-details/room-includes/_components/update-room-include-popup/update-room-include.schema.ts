import { z } from "zod";
// update room include zod validation schema

export const UpdateRoomIncludeValidationSchema = z
  .object({
    name: z.string().min(1, "The include name is required"),
  })
  .strict();

export type UpdateRoomIncludeValidationSchemaType = z.infer<
  typeof UpdateRoomIncludeValidationSchema
>;
