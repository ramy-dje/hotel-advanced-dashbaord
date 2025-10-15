import { z } from "zod";

// Create role zod validation schema

export const CreateRoleValidationSchema = z
  .object({
    name: z.string().min(1, "The role name is required"),
    permissions: z.array(z.string()),
    color: z.string(),
  })
  .strict();

export type CreateRoleValidationSchemaType = z.infer<
  typeof CreateRoleValidationSchema
>;
