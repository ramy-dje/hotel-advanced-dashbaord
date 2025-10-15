import { FileSchema } from "@/components/select-images-dialog/helper";
import { z } from "zod";
// Create room  zod validation schema

export const CreateBedValidationSchema = z
  .object({
    // main info section
    category: z.string({ message: "Room category is required" }),
    name: z.string().min(1, "The room name is required"),
    code: z.string().min(1, "The room code is required"),
    description: z.string().or(z.literal("")),
    // Capacity section
    capacity_adults: z.number().min(1, "Adults should be at least 1 person"),
    capacity_children: z.number().min(0, "Add valid person number"),
    // size
    size: z.number().min(0, "Size should be at least 0 square meter"),
    // features section
    features: z.array(z.string()).optional(),
    beds: z.array(z.string()).optional(),
    types: z.array(z.string()),
    includes: z.array(z.string()),
    extra_services: z.array(z.string()),
    // default price
    default_price: z.number().min(1, "Default Price is required"),
    // pricing section
    price: z
      .array(
        z.object({
          id: z.string(),
          from: z.date().optional(),
          to: z.date().optional(),
          price: z.number(),
        })
      )
      .refine((args) => args.length !== 0, "At least add one price")
      .refine((args) => {
        const isValidDates = args.every((p) => p.from && p.to);
        if (!isValidDates) return false;
        return true;
      }, "Dates should be valid")
      .refine((args) => {
        const isValidPrices = args.every((p) => p.price >= 0);
        if (!isValidPrices) return false;
        return true;
      }, "Price should be valid")
      .refine((args) => {
        if (args.length == 1) return true;
        // Sort the dates to make comparison easier
        const sortedArgs = [...args].sort(
          (a, b) =>
            new Date(a.from as Date).getTime() -
            new Date(b.from as Date).getTime()
        );

        // Check for overlaps
        for (let i = 0; i < sortedArgs.length - 1; i++) {
          const currentPrice = sortedArgs[i];
          const nextPrice = sortedArgs[i + 1];

          if (
            new Date(nextPrice.from as Date) <=
            new Date(currentPrice.to as Date)
          ) {
            return false; // Conflict found
          }
        }

        return true;
      }, "There's a conflict between two prices"),
    // floors
    floors: z
      .array(
        z.object({
          id: z.string(),
          floor_free_space: z.number(),
          floor_range: z.object({
            end: z.number(),
            start: z.number(),
          }),
          name: z.string(),
          range_start: z
            .number()
            .min(1, "Floor start range should be more then 1"),
          range_end: z.number().min(1, "Floor end range should be more then 1"),
        })
      )
      .refine((args) => {
        const isValidFloor = args.every(
          (f) => f.range_end >= f.range_start && f.id && f.name
        );
        if (!isValidFloor) return false;
        return true;
      }, "Add valid floor and ranges")
      .superRefine((args, ctx) => {
        args.forEach((arg) => {
          if (
            !(arg.floor_range.end >= arg.range_end) ||
            !(arg.floor_range.start <= arg.range_start)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Out of ${arg.name} floor range`,
            });
          } else if (arg.range_end - arg.range_start > arg.floor_free_space) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${arg.name} floor hasn't enough space for this room`,
            });
          }
        });
      }),
    // Images Sections
    main_image: z.string().min(1, "The main room image is required"),
    gallery_images: z
      .array(FileSchema)
      .min(1, "You must select at least one image"),

    // SEO section
    seo_title: z.string().min(1, "The SEO title is required"),
    seo_slug: z.string().min(1, "The SEO slug is required"),
    seo_description: z.string(),
    seo_keywords: z.array(
      z.string().min(1, "The SEO keyword should at least 1 characters")
    ),
  })
  .required();

export type CreateRoomValidationSchemaType = z.infer<
  typeof CreateBedValidationSchema
>;
