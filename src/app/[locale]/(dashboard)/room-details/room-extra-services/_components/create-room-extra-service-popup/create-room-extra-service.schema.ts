import { z } from "zod";
// Create room extra service zod validation schema

export const CreateRoomExtraServiceValidationSchema = z
  .object({
    /* Basic Informations */
    icon: z.string().min(1, "Select an icon for the service"),
    name: z.string().min(1, "The service name is required"),
    description: z.string().optional(),
    image: z.any().optional(),
    image_url: z.string().optional().default(""),
    category: z.string().min(1, "The service category is required"),
    property_code: z.string().optional(),
    usageAllowedAreas: z.array(z.string()).optional(),
    costFactor: z.string().optional().default(""),
    /*pricing */
    service_availability: z.string().min(1, "The service availability is required"),
    min_lead_time: z.number().optional().default(0),
    max_lead_time: z.number().optional().default(0),
    lead_time_unit: z.string().optional().default(""),
    priceType: z.string().min(1, "The service price type is required"),
    price: z.number().min(0, "The service price should be valid"),
    priceTimeUnit: z.string().optional().default(""),
    additionalFees: z.array(z.object({ name: z.string(), price: z.number() })).optional().default([]),
    taxIncluded: z.boolean().default(false),
    taxSelected: z.string().optional().default(""),
    /*service provider */
    service_providers: z.array(z.string()).optional().default([]),
    /* display settings */
   service_status: z.boolean().default(false),
   featured_service: z.boolean().default(false),
   sales_channels: z.array(z.string()).optional().default([]),
  })
  .required();

export type CreateRoomExtraServiceValidationSchemaType = z.infer<
  typeof CreateRoomExtraServiceValidationSchema
>;
