import { z } from "zod";
// Update job zod validation schema

export const UpdateJobValidationSchema = z
  .object({
    // main info section
    department: z.string().or(z.null()),
    title: z.string().min(1, "The position title is required"),
    type: z.string(),
    number_of_positions: z
      .number()
      .min(1, "the position should be at least 1 position"),
    description: z.string(),
    responsibilities_text: z.string(),
    desired_profile_text: z.string(),
    skills_text: z.string(),
    level: z.string(),
    location_state: z.string(),
    location_city: z.string(),
    location_address: z.string(),
    expire: z.date({
      message: "The expiration date is required",
    }),
  })
  .required();

export type UpdateJobValidationSchemaType = z.infer<
  typeof UpdateJobValidationSchema
>;
