import { z } from "zod";

// Create a function that generates the validation schema based on the mode
export const getFolderValidationSchema = (mode: "create" | "update") => {
  const baseSchema = z
    .object({
      name: z.string().min(1, "Folder name is required"),
      note: z.string().optional(),
      accessibility: z.enum(["public", "protected"], {
        required_error: "You need to select an accessibility type.",
      }),
      accessPassword: z.string().optional(),
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

  if (mode === "create") {
    return baseSchema.refine(
      (data) => {
        // For create mode: If accessibility is "protected", password must be provided and at least 8 characters
        if (data.accessibility === "protected") {
          return data.accessPassword && data.accessPassword.length >= 8;
        }
        return true;
      },
      {
        message:
          "Password is required and must contain at least 8 characters when folder is protected",
        path: ["accessPassword"], // Fixed path from "password" to "accessPassword"
      }
    );
  } else {
    return baseSchema.refine(
      (data) => {
        // For update mode: If accessibility is "protected" AND accessPassword is provided, it must be at least 8 characters
        if (
          data.accessibility === "protected" &&
          data.accessPassword !== undefined &&
          data.accessPassword !== ""
        ) {
          return data.accessPassword.length >= 8;
        }
        return true;
      },
      {
        message: "Password must contain at least 8 characters when provided",
        path: ["accessPassword"],
      }
    );
  }
};

// For backward compatibility, export the create schema as the default
export const CreateFolderValidationSchema = getFolderValidationSchema("create");
export const UpdateFolderValidationSchema = getFolderValidationSchema("update");

export type CreateFolderValidationSchemaType = z.infer<
  typeof CreateFolderValidationSchema
>;
