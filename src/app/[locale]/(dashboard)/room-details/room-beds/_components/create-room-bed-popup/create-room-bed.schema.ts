import { z } from "zod";
// Create room bed zod validation schema

export const CreateRoomBedValidationSchema = z
  .object({
    name: z.string().min(1, "The bed name is required"),
    width: z.number().min(0, "The width should be valid"),
    height: z.number().min(0, "The height should be valid"),
    unite: z.enum(["cm", "inch"], {
      message: "The bed size unite is required",
    }),
    icon: z.string().min(1, "Select an icon for the bed"),
  })
  .required();

export type CreateRoomBedValidationSchemaType = z.infer<
  typeof CreateRoomBedValidationSchema
>;
