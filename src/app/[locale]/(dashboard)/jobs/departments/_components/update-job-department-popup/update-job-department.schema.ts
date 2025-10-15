import { z } from "zod";
// update job department zod validation schema

export const UpdateJobDepartmentValidationSchema = z
  .object({
    name: z.string().min(1, "The department name is required"),
  })
  .strict();

export type UpdateJobDepartmentValidationSchemaType = z.infer<
  typeof UpdateJobDepartmentValidationSchema
>;
