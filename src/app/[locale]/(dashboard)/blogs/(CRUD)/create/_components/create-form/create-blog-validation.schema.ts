import { z } from "zod";
// Create blog zod validation schema

export const CreateBlogValidationSchema = z
  .object({
    // main info section
    title: z.string().min(1, "The title is required"),
    author: z.string(),
    read_time: z
      .number()
      .min(1, "The blog read time should be at least 1 minute"),
    content: z.string(),

    // image
    image: z.any().refine((arg: File) => {
      if (!(arg instanceof File)) return false;
      return true;
    }, "The image is required"),

    // image
    image_url: z.string().optional(),

    // categories
    categories: z.array(z.string()),
    // tags
    tags: z.array(z.string()),

    // SEO section
    seo_title: z.string().min(1, "The SEO title is required"),
    seo_slug: z.string().min(1, "The SEO slug is required"),
    seo_description: z.string(),
    seo_keywords: z.array(
      z.string().min(1, "The SEO keyword should at least 1 characters")
    ),
  })
  .required();

export type CreateBlogValidationSchemaType = z.infer<
  typeof CreateBlogValidationSchema
>;
