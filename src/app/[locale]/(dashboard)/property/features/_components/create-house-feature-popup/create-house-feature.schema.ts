import { z } from "zod";

/**
 * Defines the validation schema for creating a new house accommodation feature.
 *
 * @property {string} name - The name of the feature (e.g., "Swimming Pool", "Balcony"). Must be at least 1 character long.
 * @property {string} icon - The path to the icon image representing the feature (e.g., "/icons/pool.svg"). Must be a non-empty string.
 * @property {"room" | "apartment" | "facility"} accommodationType - The type of accommodation this feature applies to.
 * Must be one of "room", "apartment", or "facility".
 */
export const CreateHouseFeatureValidationSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  icon: z.string().min(1, "Feature icon is required"),
  accommodationType: z.enum(["room", "apartment", "facility"], {
    errorMap: () => ({ message: "Please select an accommodation type" }),
  }),
});

/**
 * TypeScript type inferred from the CreateHouseFeatureValidationSchema.
 * This type defines the expected shape of data when creating a house feature.
 */
export type CreateHouseFeatureValidationSchemaType = z.infer<typeof CreateHouseFeatureValidationSchema>;
