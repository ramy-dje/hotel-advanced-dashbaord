import { z } from "zod";

// Enums

export const OfferTypeEnum = z.enum([
  "amountOfProducts",
  "package",
  "amountOfOrder",
  "buyXGetY",
]);
export const OfferMethodEnum = z.enum(["code", "auto"]);
export const RequirementsTypeEnum = z.enum([
  "purchase_amount",
  "quantity_amount",
  "no_requirements",
]);
// Schema
export const UpdateOffersValidationSchema = z
  .object({
    type: z.string().min(1, { message: "Offer type is required" }),
    name: z.string().min(1, { message: "Offer name is required" }),
    // image
    image: z.any().optional(),
    // image
    image_url: z.string().optional(),
    method: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    isRefundable: z.boolean().optional(),

    // BXGY
    bxgy: z
      .object({
        type: z.any().optional(),
        buyItems: z
          .array(
            z.object({
              itemType: z.string().optional(),
              quantity: z.number().optional(),
              selectedItems: z
                .array(z.object({ itemId: z.string() }))
                .optional(),
            }),
          )
          .optional(),
        getItems: z
          .array(
            z.object({
              itemType: z.string().optional(),
              quantity: z.number().optional(),
              selectedItems: z
                .array(z.object({ itemId: z.string() }))
                .optional(),
            }),
          )
          .optional(),
        discountType: z.any().optional(),
        discountValue: z.number().optional(),
        hasMaxUsage: z.boolean().optional(),
        maxUsage: z.number().optional(),
      })
      .optional(),

    // Discount
    discount: z
      .object({
        amount: z.number().optional(),
        type: z.string().optional(),
        hasMaxUsage: z.boolean().optional(),
        maxUsage: z.number().optional(),
        eligibleRooms: z
          .array(
            z.object({
              roomId: z.string(),
              roomRateId: z.string(),
            }),
          )
          .optional(),
        isOnePerUser: z.boolean().optional().default(false),
      })
      .optional(),

    // Package
    package: z
      .object({
        items: z
          .array(
            z.object({
              type: z.string().optional(),
              quantity: z.number().optional(),
              selectedItems: z
                .array(z.object({ itemId: z.string() }))
                .optional(),
            }),
          )
          .optional(),
        costType: z.string().optional(),
        costValue: z.number().optional(),
        costPer: z.string().optional(),
        taxIncluded: z.boolean().optional().default(false),
        taxSelected: z.string().optional(),
      })
      .optional(),

    // Time Validity
    timeValidity: z
      .object({
        startDate: z.string(),
        startTime: z.string().optional(),
        hasEndDate: z.boolean().optional().default(false),
        endDate: z.string().optional(),
        endTime: z.string().optional(),
      })
      .optional(),

    // Requirements
    requirements: z
      .object({
        type: z.string(),
        minTotalSpend: z.number().optional(),
        minPurchaseAmount: z.number().optional(),
      })
      .optional(),

    // Eligibility
    eligibility: z
      .object({
        type: z.any().optional(),
        segments: z.any().optional(),
        clients: z.any().optional(),
      })
      .optional(),

    // Policies & Benefits
    combinations: z.array(z.string()).optional(),
    policies: z
      .array(
        z
          .object({
            title: z.string(),
            items: z.array(
              z.object({
                icon: z.string(),
                text: z.string(),
              }),
            ),
          })
          .optional(),
      )
      .optional(),
    benefits: z.array(z.string()).optional(),

    // Status
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "buyXGetY") {
      if (!data.bxgy?.discountType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount type is required",
          path: ["bxgy", "discountType"],
        });
      }
      if (!data.bxgy?.type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Customer buy type is required",
          path: ["bxgy", "type"],
        });
      }
    }
    if (data.type === "amountOfProducts" || data.type === "amountOfOrder") {
      if (!data.discount?.amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount amount is required",
          path: ["discount", "amount"],
        });
      }
      if (!data.discount?.type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount type is required",
          path: ["discount", "type"],
        });
      }
    }
    if (data.type === "package") {
      if (!data.package?.costPer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Package cost per is required",
          path: ["package", "costPer"],
        });
      }
      if (!data.package?.costType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Package cost type is required",
          path: ["package", "costType"],
        });
      }
      if (!data.package?.costValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Package cost value is required",
          path: ["package", "costValue"],
        });
      }
    }
  });
export type UpdateOffersValidationSchemaType = z.infer<
  typeof UpdateOffersValidationSchema
>;
