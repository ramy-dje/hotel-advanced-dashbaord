import { z } from "zod";
// update room category zod validation schema

export const UpdateRoomCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category name is required"),
  })
  .strict();

export type UpdateRoomCategoryValidationSchemaType = z.infer<
  typeof UpdateRoomCategoryValidationSchema
>;
