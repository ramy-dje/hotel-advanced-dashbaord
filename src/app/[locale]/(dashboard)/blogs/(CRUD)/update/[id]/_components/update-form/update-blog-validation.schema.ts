import { z } from "zod";
// Update blog zod validation schema

export const UpdateBlogValidationSchema = z
  .object({
    // main info section
    title: z.string().min(1, "The title is required"),
    author: z.string(),
    read_time: z
      .number()
      .min(1, "The blog read time should be at least 1 minute"),
    content: z.string(),

    // image
    image_old_url: z.string().optional(),
    image: z.any().refine((arg: File | string) => {
      if (arg instanceof File || typeof arg == "string") return true;
      else return false;
    }, "The blog image is required"),

    // image
    image_url: z.string().or(z.undefined()).optional(),

    // categories
    categories: z.array(z.string()),
    // old categories
    old_categories: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .optional(),
    // tags
    tags: z.array(z.string()),
    // old tags
    old_tags: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
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

export type UpdateBlogValidationSchemaType = z.infer<
  typeof UpdateBlogValidationSchema
>;
