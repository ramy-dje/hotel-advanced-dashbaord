import { FileSchema } from "@/components/select-images-dialog/helper";
import { z } from "zod";

// Define the schema for a single room pricing entry
export const RoomPricingSchema = z.object({
  type: z.string().min(1, "Room type is required for pricing"),
  views: z.array(z.string()).optional(), // Views can be optional or required depending on your needs
  smoking: z.boolean(),
  petFriendly: z.boolean(),
  rateCode: z.string().min(1, "Rate code is required for pricing"),
});

export const CreateRoomValidationSchema = z
  .object({
    propertyCode: z.string().min(1, "Property code is required"),
    propertyName: z.string().min(1, "Property name is required"),
    accommodation: z.string().min(1, "Accommodation type is required"),
    type: z.string().min(1, "Room type is required"), // This 'type' refers to the general room type of the property, not the specific pricing variations
    roomCode: z.string().min(1, "The room code is required"),
    description: z.string().or(z.literal("")),
    size: z.object({
      value: z.number().min(0, "Size value should be at least 0"),
      unit: z.enum(['sqm', 'sqft']).default('sqm'),
    }),
    capacity: z.object({
      adults: z.number().min(1, "Adults count should be at least 1"),
      children: z.number().min(0, "Children count should be at least 0")
    }),
    bedsCount: z
      .number()
      .min(1, "You should add at least one bed")
      .max(10, "You can't add more than 10 beds"),
    bedroomsCount: z
      .number()
      .min(1, "You should add at least one bedroom")
      .max(10, "You can't add more than 10 bedrooms"),

    bedrooms: z.array(z.object({
      type: z.string().min(1, "Bedroom type is required"),
      count: z.number().min(0, "Bedroom count must be a non-negative number"),
    })).min(1, "You should add at least one bedroom configuration"),
    bathroomsCount: z.number().min(0, "Bathroom count must be a non-negative number"),
    sittingAreas: z.number().min(0, "Sitting areas count must be a non-negative number"),
    kitchens: z.number().min(0, "Kitchens count must be a non-negative number"),
    extraBeds: z.number().min(0, "Extra beds count must be a non-negative number"),
    extraBedFee: z.number().min(0, "Extra bed fee must be a non-negative number"),
    amenities: z.array(z.string()).optional(),
    additionalFeatures: z.array(z.string()).optional(),
    suitableFor: z.array(z.string()).optional(),
    accessibleRoom: z.boolean(),
    connectingRooms: z.boolean(),
    rateCode: z.string().min(1, "Rate code is required"),
    balcony: z.boolean(),
    configuration: z.string().min(1, "Configuration is required"),

    // Add the roomPricing array here
    roomPricing: z.array(RoomPricingSchema)
                 .min(1, "At least one room pricing configuration is required."),

    frequentlyBoughtTogether: z.array(z.string()).optional(),
    policies: z.object({
      smokingArea: z.boolean(),
      petsAllowed: z.boolean(),
      damageFees: z.array(z.string()).optional(),
      dipositFees: z.array(z.string()).optional(),
      minimumNightStay: z.number().min(0, "Minimum night stay must be a non-negative number"),
      includes: z.array(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      guidlines: z.array(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
      restrictions: z.array(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })).optional(),
    }),
    seo: z.object({
      description: z.string(),
      title: z.string().min(1, "The SEO title is required"),
      keywords: z.array(
        z.string().min(1, "The SEO keyword should at least 1 character")
      ),
      slug: z.string().min(1, "The SEO slug is required"),
    }),
  })
  .required();

export type CreateRoomValidationSchemaType = z.infer<
  typeof CreateRoomValidationSchema
>;


// import { FileSchema } from "@/components/select-images-dialog/helper";
// import { z } from "zod";

// export const CreateRoomValidationSchema = z
//   .object({
//     propertyCode: z.string().min(1, "Property code is required"),
//     propertyName: z.string().min(1, "Property name is required"),
//     accommodation: z.string().min(1, "Accommodation type is required"), // Added
//     type: z.string().min(1, "Room type is required"), // Added
//     roomCode: z.string().min(1, "The room code is required"), // Renamed from 'code'
//     description: z.string().or(z.literal("")),
//     size: z.object({ // Changed to an object
//       value: z.number().min(0, "Size value should be at least 0"),
//       unit: z.enum(['sqm', 'sqft']).default('sqm'),
//     }),
//     capacity: z.object({
//       adults: z.number().min(1, "Adults count should be at least 1"),
//       children: z.number().min(0, "Children count should be at least 0")
//     }),
//     bedsCount: z
//       .number()
//       .min(1, "You should add at least one bed")
//       .max(10, "You can't add more than 10 beds"),
//     bedroomsCount: z
//       .number()
//       .min(1, "You should add at least one bedroom")
//       .max(10, "You can't add more than 10 bedrooms"),

//     bedrooms: z.array(z.object({ // Added
//       type: z.string().min(1, "Bedroom type is required"),
//       count: z.number().min(0, "Bedroom count must be a non-negative number"),
//     })).min(1, "You should add at least one bedroom configuration"),
//     bathroomsCount: z.number().min(0, "Bathroom count must be a non-negative number"), // Added
//     sittingAreas: z.number().min(0, "Sitting areas count must be a non-negative number"), // Added
//     kitchens: z.number().min(0, "Kitchens count must be a non-negative number"), // Added
//     extraBeds: z.number().min(0, "Extra beds count must be a non-negative number"), // Added
//     extraBedFee: z.number().min(0, "Extra bed fee must be a non-negative number"), // Added
//     amenities: z.array(z.string()).optional(), // Added
//     additionalFeatures: z.array(z.string()).optional(), // Added
//     suitableFor: z.array(z.string()).optional(), // Added
//     accessibleRoom: z.boolean(), // Added
//     connectingRooms: z.boolean(), // Added
//     balcony: z.boolean(), // Added
//     configuration: z.string().min(1, "Configuration is required"), // Added
//     rateCode: z.string().min(1, "Rate code is required"),
//      // Added
//     frequentlyBoughtTogether: z.array(z.string()).optional(), // Added
//     policies: z.object({ // Added
//       smokingArea: z.boolean(),
//       petsAllowed: z.boolean(),
//       damageFees: z.array(z.string()).optional(),
//       dipositFees: z.array(z.string()).optional(),
//       minimumNightStay: z.number().min(0, "Minimum night stay must be a non-negative number"),
//       includes: z.array(z.object({
//         title: z.string().optional(),
//         description: z.string().optional(),
//       })).optional(),
//       guidlines: z.array(z.object({
//         title: z.string().optional(),
//         description: z.string().optional(),
//       })).optional(),
//       restrictions: z.array(z.object({
//         title: z.string().optional(),
//         description: z.string().optional(),
//       })).optional(),
//     }),
//     seo: z.object({ // Changed to an object
//       description: z.string(),
//       title: z.string().min(1, "The SEO title is required"),
//       keywords: z.array(
//         z.string().min(1, "The SEO keyword should at least 1 character")
//       ),
//       slug: z.string().min(1, "The SEO slug is required"),
//     }),
//   })
//   .required();

// export type CreateRoomValidationSchemaType = z.infer<
//   typeof CreateRoomValidationSchema
// >;