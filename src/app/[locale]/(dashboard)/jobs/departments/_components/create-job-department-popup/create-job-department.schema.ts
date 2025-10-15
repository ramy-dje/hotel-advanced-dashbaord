import { z } from "zod";
// Create job department zod validation schema

export const CreateJobDepartmentValidationSchema = z
  .object({
    name: z.string().min(1, "The department name is required"),
  })
  .strict();

export type CreateJobDepartmentValidationSchemaType = z.infer<
  typeof CreateJobDepartmentValidationSchema
>;
