import { z } from "zod";
// Create room category zod validation schema

export const CreateRoomCategoryValidationSchema = z
  .object({
    name: z.string().min(1, "The category name is required"),
  })
  .strict();

export type CreateRoomCategoryValidationSchemaType = z.infer<
  typeof CreateRoomCategoryValidationSchema
>;
