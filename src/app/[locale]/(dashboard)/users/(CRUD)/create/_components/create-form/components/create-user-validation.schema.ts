import { z } from "zod";

// Create user zod validation schema

export const CreateUserValidationSchema = z
  .object({
    // account info
    username: z.string().min(2, "Username should at least 2 letters"),
    role: z
      .string({
        message: "Role is required",
      })
      .min(1, "Role is required"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email is not valid"),
    password: z.string().min(8, "Password must be more then 8 characters"),

    // personal info
    fullname: z.string().min(2, "Fullname should at least 2 letters"),
    gender: z.enum(["male", "female"]),

    // image
    picture_file: z.any().refine((arg: File) => {
      if (!(arg instanceof File) && arg !== null) return false;
      return true;
    }, "The user picture is not valid image"), // optional

    // url (to delete it after setting by the createObjectURL)
    picture_url: z.string().optional(),

    // phone numbers and location

    phoneNumber: z
      .string()
      .regex(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/, "Phone number is not valid")
      .min(6, "Phone number should be 6 numbers"),
    phoneNumber2: z
      .string()
      .regex(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/, "Phone number is not valid")
      .min(6, "Phone number should be 6 numbers")
      .or(z.literal("")),
    // location
    location_country: z.string().optional().or(z.literal("")),
    location_state: z.string().optional().or(z.literal("")),
    location_city: z.string().optional().or(z.literal("")),
    location_zipcode: z
      .string()
      .regex(/^[0-9]*$/, "Zip code is not valid")
      .min(2, "Zip code should be at least 2 numbers")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export type CreateUserValidationSchemaType = z.infer<
  typeof CreateUserValidationSchema
>;
