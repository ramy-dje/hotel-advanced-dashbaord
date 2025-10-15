// src/schemas/create-property-validation.schema.ts
import { z } from "zod";

// Max file size for uploads
const maxImageSize = 2 * 1024 * 1024; // 2MB

// Section and Facility schemas
const SectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  roomFrom: z.number().int().min(0, "Room start must be ≥ 0"),
  roomTo: z.number().int().min(0, "Room end must be ≥ 0"),
}).refine(
  (data) => data.roomFrom <= data.roomTo,
  { message: "Section 'roomFrom' must be ≤ 'roomTo'" }
);

const FacilitySchema = z.object({
  name: z.string(),
  sectionName: z.string(),
});

const RoomSchema = z.object({
  sectionName: z.string(),
  number: z.number()
});

const ElevatorSchema = z.object({
  name: z.string(),
  sectionName: z.string(),
});

const FloorSchema = z.object({
  name: z.string().min(1, "Floor name is required"),
  level: z.number().min(-5, "Floor level is required"),
  hasRooms: z.boolean(),
  rooms: z.array(RoomSchema).default([]),
  roomFrom: z.number().int().min(0, "Room start must be ≥ 0").optional(),
  roomTo: z.number().int().min(0, "Room end must be ≥ 0").optional(),
  energyClass: z.array(z.enum(["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"])).optional(),
  sections: z.array(SectionSchema).optional().default([]),
  hasFacilities: z.boolean(),
  facilities: z.array(FacilitySchema).optional().default([]),
  elevators: z.array(ElevatorSchema).optional().default([]),
  AdditionalFeatures: z.array(z.object({ name: z.string(), description: z.string() })).optional().default([]),
  ExtraAreas: z.array(z.object({ name: z.string(), description: z.string() })).optional().default([]),
  surfaceArea: z.number().optional(),
  surfaceUnit: z.enum(["sqm", "sqft"]).optional(),
  side: z.enum(["N", "S", "E", "W"]).optional(),
}).refine(
  (data) => !data.hasRooms || (data.roomFrom !== undefined && data.roomTo !== undefined),
  { message: "If 'hasRooms' is true, 'roomFrom' and 'roomTo' are required" }
);

export const BlockSchema = z.object({
  block_name: z.string().min(1, "Block name is required"),
  floors: z.array(FloorSchema).min(1, "At least one floor is required in a block").default([]),
  hasRooms: z.boolean().optional().default(false),
  hasFacilities: z.boolean().optional().default(false),
  description: z.string(),
});
export const DirectorySchema = z.object({
  id: z.string().min(1, "Directory id is required"),
  name: z.string().min(1, "Directory name is required"),
  type: z.enum(["top-level", "subdirectory"]),
  parent_id: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// House Rules Schema
const HouseRulesSchema = z.object({
  smokingAreas: z.string().optional(),
  petConditions: z.string().optional(),
  visitorsAllowed: z.boolean(),
  visitorHours: z.string().optional(),
  allowCancellations: z.boolean(),
  loginRequired: z.boolean(),
  extraServices: z.boolean(),
  guestResponsibilities: z.string().optional(),
  cleaningFee: z.enum(["none", "fixed", "percentage"]),
  reportDamages: z.boolean(),
  wifiGuidelines: z.string().optional(),
  applianceRules: z.string().optional(),
  sharedSpaceRules: z.string().optional(),
  climateControlRules: z.string().optional(),
  accessInstructions: z.string().optional(),
  lockingPolicy: z.enum(["required", "optional"]),
  noUnauthorizedAccess: z.boolean(),
  childFriendly: z.boolean(),
  childAgeRestrictions: z.string().optional(),
  babyEquipment: z.string().optional(),
  childproofing: z.enum(["none", "basic", "full"]),
  noParties: z.boolean(),
  smokingAllowed: z.boolean(),
  petsAllowed: z.boolean(),
  childrenAllowed: z.boolean(),
  additionalRules: z.string().optional(),
  quietHours: z.object({
    start: z.string().min(1, "Quiet hours start time is required"),
    end: z.string().min(1, "Quiet hours end time is required"),
  }),
});
const HouseSettingsSchema = z.object({
  houseSearchParams: z.object({
    daysAdvance: z.object({
      value: z.number().default(10),
      unit: z.string().default("days"),
    }),
    maxFuture: z.object({
      value: z.number().default(180),
      unit: z.string().default("days"),
    }),
    minNights: z.number().default(1),
    maxNights: z.number().default(180),
    minRooms: z.number().default(1),
    maxRooms: z.number().default(1),
    adultsFrom: z.number().default(1),
    adultsTo: z.number().default(1),
    childrenFrom: z.number().default(0),
    childrenTo: z.number().default(0),
    closingFrom: z.string().default(""),
    closingTo: z.string().default(""),
    closingReason: z.string().default(""),
    closingTypes: z.array(z.string()).default([]),
    modificationMode: z.string().default(""),
  })
})

export const CreatePropertyValidationSchema = z.object({
  // Main Details
  propertyName: z.string().min(1, "Property name is required"),
  propertyOwner: z.string().min(1, "Property owner is required"),
  rating: z.number().default(3).optional(),
  directory: DirectorySchema,
  location_country: z.string().min(1, "Country is required"),
  location_state: z.string().min(1, "State is required"),
  houseFeatures: z.array(z.object({ key: z.string(), value: z.string() })),
  views: z.array(z.string()).optional(), // Changed from houseViewList to views
  houseViewsText: z.string().optional(),
  houseViewList: z.array(z.object({ key: z.string(), value: z.string() })),
  nearbyLocations: z.array(z.object({
    label: z.string(),
    distance: z.string(),
    coordinates: z
      .object({ lat: z.number(), lng: z.number() })
      .nullable(),
  })),
  code: z.string()
    .regex(/^[A-Za-z0-9_-]+$/, "Code may only contain letters, numbers, hyphens and underscores")
    .min(1, "Property code is required"),
  bio: z.string().optional(),
  imageGallery: z.array(
    z.instanceof(File)
      .refine(file => file.size <= maxImageSize, "Each image must be ≤ 2MB")
  ).optional(),
  videoText: z.string().optional(),
  videoExternalLink: z.string().url("Must be a valid URL").optional(),
  videoFile: z.instanceof(File).optional(),
  video360: z.string().optional(),

  // Location Details
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().optional(),
  gmapAddress: z.string().optional(),

  // Setup Details
  addType: z.object({
    name: z.string(),
    id: z.string(),
  }).optional(),
  surfaceValue: z.number().optional(),
  surfaceUnit: z.string().optional(),
  carPark: z.boolean().optional(),
  energyClass: z.array(z.enum(["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"])).optional(),
  floorPlan: z.instanceof(File).optional(),

  // Blocks & Floors
  blocks: z.array(BlockSchema).min(1, "At least one block is required"),

  // House Rules
  houseRules: HouseRulesSchema,
  houseSettings: HouseSettingsSchema,
  housePolicies: z.array(z.object({ policyName: z.string(), policyDescription: z.string() })), // Add house rules here

  // --- START: Fields from Multi-step Popup (Added to Schema) ---
  propertySpecificType: z.enum(["single", "multi"], {
    errorMap: () => ({ message: "Unit type is required" }),
  }).default("single"),
  rooms: z.number().int().min(0, "Number of rooms cannot be negative").default(0),
  apartments: z.number().int().min(0, "Number of apartments cannot be negative").default(0),
  bedsCount: z.number().int().min(0, "Number of beds cannot be negative").default(0),
  bedTypes: z.array(z.string().min(1, "Bed type cannot be empty")).default([]),
  bathroomsCount: z.number().int().min(0, "Number of bathrooms cannot be negative").default(0),
  bathroomTypes: z.array(z.string().min(1, "Bathroom type cannot be empty")).default([]),
  guests: z.number().int().min(0, "Number of guests cannot be negative").default(0),
  accommodationCategories: z.array(z.object({
    id: z.string().min(1, "Category ID is required"),
    name: z.string().min(1, "Category name is required"),
    status: z.boolean(),
  })).default([]),
  facilities: z.object({
    facilitiesCount: z
      .number()
      .int()
      .min(0, "Number of facilities cannot be negative")
      .default(0),
    otherFacilities: z
      .array(z.string().min(1, "Facility name cannot be empty"))
      .default([]),
    selectedFacilities: z
      .object({
        event_meeting_spaces: z.boolean().default(false),
        lounge_restaurants: z.boolean().default(false),
        spa: z.boolean().default(false),
        pool: z.boolean().default(false),
        gym: z.boolean().default(false),
        garden: z.boolean().default(false),
      })
      .default({
        event_meeting_spaces: false,
        lounge_restaurants: false,
        spa: false,
        pool: false,
        gym: false,
        garden: false,
      }),

    additionalInfo: z.object({
      parkingSpaces: z.number().int('Must be an integer').min(0, 'Cannot be negative'),
      extraAreasCount: z.number().int('Must be an integer').min(0, 'Cannot be negative'),
      extraAreaNames: z.array(z.string().min(1, 'Name cannot be empty')),
    }).optional(),

    roomTypes: z.array(z.object({
      id: z.string().optional(),
      typeName: z.string().optional(),
      status: z.string().optional().default("class1"),
    })),

  }),
  roomTypes: z.array(z.object({
    id: z.string().min(1, "Room type ID is required"),
    typeName: z.string().min(1, "Room type name is required"),
    status: z.enum(["class1", "class2", "class3"]).default("class1"),
  })).default([]),
 roomRatings: z.record(z.string(), z.number()).default({}),
  propertyRating: z.number().min(0, "Rating must be between 0 and 5").max(5, "Rating must be between 0 and 5").default(0),
  additionalInfo: z.object({
    parkingSpaces: z.number().int().min(0, "Number of parking spaces cannot be negative").default(0),
    extraAreasCount: z.number().int().min(0, "Number of extra areas cannot be negative").default(0),
    extraAreaNames: z.array(z.string().min(1, "Extra area name cannot be empty")).default([]),
  })

  // --- END: Fields from Multi-step Popup ---
});

export type CreatePropertyValidationSchemaType = z.infer<
  typeof CreatePropertyValidationSchema
>;


// // src/schemas/create-property-validation.schema.ts
// import { z } from "zod";

// // Max file size for uploads
// const maxImageSize = 2 * 1024 * 1024; // 2MB

// // Section and Facility schemas
// const SectionSchema = z.object({
//   name: z.string().min(1, "Section name is required"),
//   roomFrom: z.number().int().min(0, "Room start must be ≥ 0"),
//   roomTo: z.number().int().min(0, "Room end must be ≥ 0"),
// }).refine(
//   (data) => data.roomFrom <= data.roomTo,
//   { message: "Section 'roomFrom' must be ≤ 'roomTo'" }
// );

// const FacilitySchema = z.object({
//   name: z.string(),
//   sectionName: z.string(),
// });

// const RoomSchema = z.object({
//   sectionName: z.string(),
//   number: z.number()
// });

// const ElevatorSchema = z.object({
//   name: z.string(),
//   sectionName: z.string(),
// });

// const FloorSchema = z.object({
//   name: z.string().min(1, "Floor name is required"),
//   level: z.number().min(-5, "Floor level is required"),
//   hasRooms: z.boolean(),
//   rooms: z.array(RoomSchema).default([]),
//   roomFrom: z.number().int().min(0, "Room start must be ≥ 0").optional(),
//   roomTo: z.number().int().min(0, "Room end must be ≥ 0").optional(),
//   energyClass: z.array(z.enum(["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"])).optional(),
//   sections: z.array(SectionSchema).optional().default([]),
//   hasFacilities: z.boolean(),
//   facilities: z.array(FacilitySchema).optional().default([]),
//   elevators: z.array(ElevatorSchema).optional().default([]),
//   AdditionalFeatures: z.array(z.object({ name: z.string(), description: z.string() })).optional().default([]),
//   ExtraAreas: z.array(z.object({ name: z.string(), description: z.string() })).optional().default([]),
//   surfaceArea: z.number().optional(),
//   surfaceUnit: z.enum(["sqm", "sqft"]).optional(),
//   side: z.enum(["N", "S", "E", "W"]).optional(),
// }).refine(
//   (data) => !data.hasRooms || (data.roomFrom !== undefined && data.roomTo !== undefined),
//   { message: "If 'hasRooms' is true, 'roomFrom' and 'roomTo' are required" }
// );

// export const BlockSchema = z.object({
//   block_name: z.string().min(1, "Block name is required"),
//   floors: z.array(FloorSchema).min(1, "At least one floor is required in a block").default([]),
//   hasRooms: z.boolean().optional().default(false),
//   hasFacilities: z.boolean().optional().default(false),
//   description: z.string(),
// });
// export const DirectorySchema = z.object({
//   id: z.string().min(1, "Directory id is required"),
//   name: z.string().min(1, "Directory name is required"),
//   type: z.enum(["top-level", "subdirectory"]),
//   parent_id: z.string().optional(),
//   createdAt: z.string(),
//   updatedAt: z.string(),
// });

// // House Rules Schema
// const HouseRulesSchema = z.object({
//   smokingAreas: z.string().optional(),
//   petConditions: z.string().optional(),
//   visitorsAllowed: z.boolean(),
//   visitorHours: z.string().optional(),
//   allowCancellations: z.boolean(),
//   loginRequired: z.boolean(),
//   extraServices: z.boolean(),
//   guestResponsibilities: z.string().optional(),
//   cleaningFee: z.enum(["none", "fixed", "percentage"]),
//   reportDamages: z.boolean(),
//   wifiGuidelines: z.string().optional(),
//   applianceRules: z.string().optional(),
//   sharedSpaceRules: z.string().optional(),
//   climateControlRules: z.string().optional(),
//   accessInstructions: z.string().optional(),
//   lockingPolicy: z.enum(["required", "optional"]),
//   noUnauthorizedAccess: z.boolean(),
//   childFriendly: z.boolean(),
//   childAgeRestrictions: z.string().optional(),
//   babyEquipment: z.string().optional(),
//   childproofing: z.enum(["none", "basic", "full"]),
//   noParties: z.boolean(),
//   smokingAllowed: z.boolean(),
//   petsAllowed: z.boolean(),
//   childrenAllowed: z.boolean(),
//   additionalRules: z.string().optional(),
//   quietHours: z.object({
//     start: z.string().min(1, "Quiet hours start time is required"),
//     end: z.string().min(1, "Quiet hours end time is required"),
//   }),
// });
// const HouseSettingsSchema = z.object({
//   houseSearchParams: z.object({
//     daysAdvance: z.object({
//       value: z.number().default(10),
//       unit: z.string().default("days"),
//     }),
//     maxFuture: z.object({
//       value: z.number().default(180),
//       unit: z.string().default("days"),
//     }),
//     minNights: z.number().default(1),
//     maxNights: z.number().default(180),
//     minRooms: z.number().default(1),
//     maxRooms: z.number().default(1),
//     adultsFrom: z.number().default(1),
//     adultsTo: z.number().default(1),
//     childrenFrom: z.number().default(0),
//     childrenTo: z.number().default(0),
//     closingFrom: z.string().default(""),
//     closingTo: z.string().default(""),
//     closingReason: z.string().default(""),
//     closingTypes: z.array(z.string()).default([]),
//     modificationMode: z.string().default(""),
//   })
// })

// export const CreatePropertyValidationSchema = z.object({
//   // Main Details
//   propertyName: z.string().min(1, "Property name is required"),
//   propertyOwner: z.string().min(1, "Property owner is required"),
//   rating: z.number().default(3).optional(),
//   directory: DirectorySchema,
//   location_country: z.string().min(1, "Country is required"),
//   location_state: z.string().min(1, "State is required"),
//   houseFeatures: z.array(z.object({ key: z.string(), value: z.string() })),
//   houseViewsText: z.string().optional(),
//   houseViewList: z.array(z.object({ key: z.string(), value: z.string() })),
//   nearbyLocations: z.array(z.object({
//     label: z.string(),
//     distance: z.string(),
//     coordinates: z
//       .object({ lat: z.number(), lng: z.number() })
//       .nullable(),
//   })),
//   code: z.string()
//     .regex(/^[A-Za-z0-9_-]+$/, "Code may only contain letters, numbers, hyphens and underscores")
//     .min(1, "Property code is required"),
//   bio: z.string().optional(),
//   imageGallery: z.array(
//     z.instanceof(File)
//       .refine(file => file.size <= maxImageSize, "Each image must be ≤ 2MB")
//   ).optional(),
//   videoText: z.string().optional(),
//   videoExternalLink: z.string().url("Must be a valid URL").optional(),
//   videoFile: z.instanceof(File).optional(),
//   video360: z.string().optional(),

//   // Location Details
//   streetAddress: z.string().min(1, "Street address is required"),
//   city: z.string().min(1, "City is required"),
//   zipCode: z.string().optional(),
//   gmapAddress: z.string().optional(),

//   // Setup Details
//   addType: z.object({
//     name: z.string(),
//     id: z.string(),
//   }).optional(),
//   surfaceValue: z.number().optional(),
//   surfaceUnit: z.string().optional(),
//   carPark: z.boolean().optional(),
//   energyClass: z.array(z.enum(["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"])).optional(),
//   floorPlan: z.instanceof(File).optional(),

//   // Blocks & Floors
//   blocks: z.array(BlockSchema).min(1, "At least one block is required"),

//   // House Rules
//   houseRules: HouseRulesSchema,
//   houseSettings: HouseSettingsSchema,
//   housePolicies: z.array(z.object({ policyName: z.string(), policyDescription: z.string() })), // Add house rules here
// });

// export type CreatePropertyValidationSchemaType = z.infer<
//   typeof CreatePropertyValidationSchema
// >;
