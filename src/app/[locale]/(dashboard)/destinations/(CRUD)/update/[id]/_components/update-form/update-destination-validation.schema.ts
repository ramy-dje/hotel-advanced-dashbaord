import { z } from "zod";
// Update destination zod validation schema

export const UpdateDestinationValidationSchema = z
  .object({
    // header info
    header_title: z
      .string()
      .min(1, "The destination caption caption title is required"),
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
    // old features
    old_features: z.array(z.string()),
    content: z.string(),

    // Images Sections
    main_image_url: z.string().optional(),
    gallery_images_url: z.array(z.string()),
    main_image: z.any().refine((arg: File | string | null) => {
      if (arg instanceof File || arg == null || typeof arg == "string")
        return true;
      else return false;
    }, "The main room image is required"),

    gallery_images: z
      .array(
        z.any().refine((arg: File) => {
          if (arg instanceof File || typeof arg == "string") return true;
          else return false;
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
    seo_old_keywords: z.array(z.string()).optional(),
  })
  .required();

export type UpdateDestinationValidationSchemaType = z.infer<
  typeof UpdateDestinationValidationSchema
>;
