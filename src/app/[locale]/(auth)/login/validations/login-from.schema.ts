import { z } from "zod";

// The login from zod validation schema

export const LoginFromValidationSchema = z
  .object({
    email: z.string().email("Email is not valid"),
    password: z.string().min(6, "Password should be more then 5 characters"),
  })
  .required();

export type LoginFromValidationSchemaType = z.infer<
  typeof LoginFromValidationSchema
>;
