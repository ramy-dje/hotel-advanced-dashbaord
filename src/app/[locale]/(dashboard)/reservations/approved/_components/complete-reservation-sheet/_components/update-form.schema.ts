import { z } from "zod";
// complete approved reservation zod validation schema

export const CompleteApprovedReservationValidationSchema = z
  .object({
    // person data
    person_fullName: z
      .string()
      .min(2, "Full name should be at least 2 characters"),
    person_phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .regex(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/, "Phone number is not valid")
      .min(6, "Phone number should be 6 numbers"),
    person_phoneNumber2: z
      .string()
      .regex(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/, "Phone number is not valid")
      .min(6, "Phone number should be 6 numbers")
      .or(z.literal("")),
    person_email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email is not valid"),
    // gender
    gender: z.enum(["male", "female"]),
    // location
    state: z
      .string()
      .min(2, "State should be at least 2 characters")
      .optional()
      .or(z.literal("")),
    city: z
      .string()
      .min(2, "City should be at least 2 characters")
      .optional()
      .or(z.literal("")),
    zipcode: z
      .string()
      .regex(/^[0-9]*$/, "Zip code is not valid")
      .min(2, "Zip code should be at least 2 numbers")
      .optional()
      .or(z.literal("")),
    country: z
      .string()
      .min(2, "Country should be at least 2 characters")
      .optional()
      .or(z.literal("")),
    // note
    note: z.string().optional().or(z.literal("")),
    // start hour
    start_hour: z.string(),
    // capacity
    capacity_adults: z
      .number({ required_error: "Adults is required" })
      .min(1, "Adults should be at least 1 person")
      .optional()
      .or(z.literal(1)),
    capacity_children: z.number().min(0).optional().or(z.literal(0)),
    // reserve
    // room
    room_id: z
      .string({
        required_error: "Room is required",
      })
      .min(3, "Room is required"),
    rooms_number: z
      .number({
        message: "Minimal rooms number is 1",
      })
      .min(1, "Rooms number should be at least 1 room"),
    // old check_in and check_out
    old_check: z
      .object({
        in: z.date(),
        out: z.date(),
      })
      .optional()
      .or(z.any()),
    // check in & check out
    check_in: z.date({
      message: "Check in date is required",
    }),
    check_out: z.date({
      message: "Check out date is required",
    }),
    // extra services
    extra_services: z
      .array(
        z.object({
          id: z.string(),
          price: z.number(),
          name: z.string(),
          guests: z.number(),
        })
      )
      .optional(),
    // checked rooms
    checked_rooms: z.array(
      z.object({
        floor: z.string(),
        room_number: z.number(),
        name: z.string(),
      })
    ),
  })
  .required();

export type CompleteApprovedReservationValidationSchemaType = z.infer<
  typeof CompleteApprovedReservationValidationSchema
>;
