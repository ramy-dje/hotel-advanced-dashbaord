import { z } from "zod";
// Create rate season zod validation schema

export const CreateRateSeasonValidationSchema = z
  .object({
    name: z.string().min(1, "The category is required"),
    code: z.string().min(1, "The code is required"),
    periods: z.array(
      z.object({
        beginSellDate: z.coerce.date(),
        endSellDate: z.coerce.date(),
        weekdays: z.array(
          z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
        ),
      }),
    ),
    propertyId: z.string().optional(),
    repeatType: z.string().min(1, "The repeat type is required"),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.periods.length === 0) {
      ctx.addIssue({
        path: ["periods"],
        code: z.ZodIssueCode.custom,
        message: "At least one period is required",
      });
      return;
    }

    // Check for overlapping (interpolation) between periods
    for (let i = 0; i < data.periods.length; i++) {
      const current = data.periods[i];
      const currentStart = new Date(current.beginSellDate).getTime();
      const currentEnd = new Date(current.endSellDate).getTime();
      // 🔥 Move it here — always check!
      if (current.weekdays.length === 0) {
        ctx.addIssue({
          path: ["periods", i, "weekdays"],
          code: z.ZodIssueCode.custom,
          message: "Weekdays must not be empty",
        });
      }

      if (currentEnd < currentStart) {
        ctx.addIssue({
          path: ["periods", i, "endSellDate"],
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
        });
      }

      for (let j = i + 1; j < data.periods.length; j++) {
        const compare = data.periods[j];
        const compareStart = new Date(compare.beginSellDate).getTime();
        const compareEnd = new Date(compare.endSellDate).getTime();

        // Check if the periods overlap
        const isOverlapping =
          currentStart <= compareEnd && compareStart <= currentEnd;

        // Check if weekdays is empty
        if (current.weekdays.length === 0) {
          ctx.addIssue({
            path: ["periods", i, "weekdays"],
            code: z.ZodIssueCode.custom,
            message: "Weekdays must not be empty",
          });
        }

        if (isOverlapping) {
          ctx.addIssue({
            path: ["periods", i],
            code: z.ZodIssueCode.custom,
            message: `Period ${i + 1} overlaps with period ${j + 1}`,
          });
          ctx.addIssue({
            path: ["periods", j],
            code: z.ZodIssueCode.custom,
            message: `Period ${j + 1} overlaps with period ${i + 1}`,
          });
        }
      }
    }
  });

export type CreateRateSeasonValidationSchemaType = z.infer<
  typeof CreateRateSeasonValidationSchema
>;
