import { z } from "zod";
// Create rate zod validation schema
export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}
export const CreateRateValidationSchema = z
  .object({
    rateName: z.string().min(1, "Rate name is required"),
    rateCode: z.string().min(1, "Rate code is required"),
    rateType: z.string().min(1, "Rate type is required"),
    rateCategory: z.string().min(1, "Rate category is required"),
    assignedTo: z.any().optional(),
    description: z.string().optional(),
    predefinedSeason: z.string().optional(),
    mealPlan: z.array(z.string()).min(1, "Meal plan is required"),
    mealPlanCode: z.string().optional(),
    isActive: z.boolean().optional(),
    minStay: z.number().min(1, "Minimum stay is required"),
    maxStay: z.number().optional().default(0),
    minAdvancedBooking: z.string(),
    maxAdvancedBooking: z.string().optional(),
    ageRestriction: z.string(),
    selectedTax: z.string(),
    taxIncluded: z.boolean(),
    factorRateCalculator: z.string(),
    yieldStatus: z.boolean(),
    refundBeforeArrival: z.number().optional(),
    refundType: z.string().optional(),
    partialRefundAmount: z.number().optional(),
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
    tiersTable: z.object({
      tiers: z.array(
        z.object({
          id: z.number(),
          label: z.string(),
          from: z.number(),
          to: z.number().optional().default(0),
          baseOccupants: z.object({
            adult: z.number(),
            child: z.number(),
          }),
          baseRates: z.object({
            adult: z.number(),
            child: z.number(),
          }),
        }),
      ),
      extraOccupants: z.array(z.number()),
    }),
    selectedServices: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate that maxStay is greater than minStay
    if (data.maxStay !== null && data.maxStay !== undefined && data.minStay) {
      if (data.maxStay <= data.minStay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum stay must be greater than minimum stay",
          path: ["maxStay"],
        });
      }
    }
    const range =
      data.tiersTable.tiers[data.tiersTable.tiers.length - 1].to -
      data.tiersTable.tiers[0].from;
    if (range < data.minStay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "The range of the tiers must be greater than or equal to the minimum stay",
        path: ["tiersTable"],
      });
    }
    // Only compare if both dates are present and valid
    if (data.minAdvancedBooking && data.maxAdvancedBooking) {
      const minDate = new Date(data.minAdvancedBooking);
      const maxDate = new Date(data.maxAdvancedBooking);

      if (!isValidDate(minDate) || !isValidDate(maxDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date format for advanced booking",
          path: ["minAdvancedBooking"],
        });
      } else if (minDate > maxDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Minimum advanced booking must be less than or equal to maximum advanced booking",
          path: ["minAdvancedBooking"],
        });
      }
    }
    if(data.tiersTable.tiers.length == 0){
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one tier is required",
        path: ["tiersTable"],
      });
    }else{
      if(data.tiersTable.tiers.find((e)=>e.baseRates.adult == 0 )){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "base rate for adult is required",
          path: ["tiersTable"],
        });
      }
      if(data.tiersTable.tiers.find((e)=>e.baseOccupants.adult == 0 )){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "base occupants for adult is required",
          path: ["tiersTable"],
        });
      }
      if(data.ageRestriction == "adults_children" && data.tiersTable.tiers.find((e)=>e.baseRates.child == 0 )){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "base rate for child is required",
          path: ["tiersTable"],
        });
      }
      if(data.ageRestriction == "adults_children" && data.tiersTable.tiers.find((e)=>e.baseOccupants.child == 0 )){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "base occupants for child is required",
          path: ["tiersTable"],
        });
      }
    }



  });

export type CreateRateValidationSchemaType = z.infer<
  typeof CreateRateValidationSchema
>;
