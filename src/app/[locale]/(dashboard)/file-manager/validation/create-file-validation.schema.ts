import { z } from "zod";

// Create File zod validation schema

export const CreateFileValidationSchema = z
  .object({
    // files
    files: z
      .array(z.any())
      .min(1, "At least upload one file")
      .max(10, "You can upload up to 10 files")
      .refine((files: File[]) => {
        const isValid = files.every((file) => {
          if (!(file instanceof File)) {
            return false;
          }
          return true;
        });
        return isValid;
      }, "The image is required"),
    // url (to delete it after setting by the createObjectURL)
    files_url: z.array(z.string()).optional(),
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

export type CreateFileValidationSchemaType = z.infer<
  typeof CreateFileValidationSchema
>;
