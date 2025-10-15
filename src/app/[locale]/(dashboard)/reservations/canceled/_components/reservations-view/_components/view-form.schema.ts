import { z } from "zod";
// View reservation zod validation schema

export const ViewReservationValidationSchema = z
  .object({
    // person data
    person_fullName: z.string(),
    person_phoneNumber: z.string(),
    person_phoneNumber2: z.string(),
    person_email: z.string(),
    person_country: z.string(),
    person_state: z.string(),
    person_city: z.string(),
    person_gender: z.string(),
    person_note: z.string(),
    person_zipcode: z.string(),
    // capacity
    capacity_adults: z.number(),
    capacity_children: z.number(),
    // reserve
    // room
    room_id: z.string(),
    rooms_number: z.number(),
    check_in: z.date().or(z.any()),
    check_out: z.date().or(z.any()),
    start_hour: z.string(),
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

export type ViewReservationValidationSchemaType = z.infer<
  typeof ViewReservationValidationSchema
>;
