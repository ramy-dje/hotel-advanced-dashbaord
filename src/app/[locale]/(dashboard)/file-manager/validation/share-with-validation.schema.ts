// Create share folder zod validation schema

import { z } from "zod";

export const ShareWithValidationSchema = z
  .object({
    sharedWith: z
      .array(
        z.object({
          id: z.string(),
          profileInfo: z.object({
            pic: z.string(),
            username: z.string(),
            email: z.string(),
            fullName: z.string(),
          }),
        })
      )
      .optional(),
    permission: z.enum(["admin", "read", "write"]).optional(),
  })
  .strict();

export type ShareWithValidationSchemaType = z.infer<
  typeof ShareWithValidationSchema
>;
export const ShareWithRolesValidationSchema = z
  .object({
    sharedWithRoles: z
      .array(
        z.object({
          id: z.string(),
        })
      )
      .optional(),
    permission: z.enum(["admin", "read", "write"]).optional(),
  })
  .strict();

export type ShareWithRolesValidationSchemaType = z.infer<
  typeof ShareWithRolesValidationSchema
>;
