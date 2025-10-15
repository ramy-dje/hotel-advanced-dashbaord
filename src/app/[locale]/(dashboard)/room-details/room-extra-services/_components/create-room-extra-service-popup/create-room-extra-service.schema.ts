import { z } from "zod";
// Create room extra service zod validation schema

export const CreateRoomExtraServiceValidationSchema = z
  .object({
    name: z.string().min(1, "The service name is required"),
    booking_name: z.string().min(1, "The service booking name is required"),
    price: z.number().min(0, "The service price should be valid"),
    icon: z.string().min(1, "Select an icon for the service"),
  })
  .required();

export type CreateRoomExtraServiceValidationSchemaType = z.infer<
  typeof CreateRoomExtraServiceValidationSchema
>;
