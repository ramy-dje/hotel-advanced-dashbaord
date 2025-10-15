import { z } from "zod";
// Create destination zod validation schema

export const CreateDestinationValidationSchema = z
  .object({
    // header info
    header_title: z
      .string()
      .min(1, "The destination caption title is required"),
    header_sub_title: z.string(),
    header_description: z.string(),
    // main info section
    title: z.string().min(1, "The destination title is required"),
    sub_title: z.string(),
    distance: z
      .number()
      .min(0.1, "The destination distance should at least 0.1Km"),
    // features
    features: z.array(z.string()),
    content: z.string(),

    // Images Sections
    main_image: z
      .any()
      .refine((arg: File) => {
        if (!(arg instanceof File) && arg !== null) return false;
        return true;
      }, "The main destination image is required")
      .or(z.null()),

    gallery_images: z
      .array(
        z.any().refine((arg: File) => {
          if (!(arg instanceof File)) return false;
          return true;
        }, "Image is required")
      )
      .optional(),

    // SEO section
    seo_title: z.string().min(1, "The SEO title is required"),
    seo_slug: z.string().min(1, "The SEO slug is required"),
    seo_description: z.string(),
    seo_keywords: z.array(
      z.string().min(1, "The SEO keyword should at least 1 characters")
    ),
  })
  .required();

export type CreateDestinationValidationSchemaType = z.infer<
  typeof CreateDestinationValidationSchema
>;
