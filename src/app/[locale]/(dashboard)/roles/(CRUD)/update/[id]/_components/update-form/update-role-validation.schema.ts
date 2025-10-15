import { z } from "zod";

// Update role zod validation schema

export const UpdateRoleValidationSchema = z
  .object({
    name: z.string().min(1, "The role name is required"),
    permissions: z.array(z.string()),
    old_permissions: z.array(z.string()),
    color: z.string(),
  })
  .strict();

export type UpdateRoleValidationSchemaType = z.infer<
  typeof UpdateRoleValidationSchema
>;
