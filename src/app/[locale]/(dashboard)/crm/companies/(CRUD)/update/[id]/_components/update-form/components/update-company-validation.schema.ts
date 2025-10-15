import { z } from "zod";

// Update crm company zod validation schema

// phone number regex
const MobileRegex = new RegExp(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/);

// zod email validator
const EmailValidator = z.string().email();

export const UpdateCRMCompanyValidationSchema = z.object({
  // main info
  name: z.string().min(1, "Company name is required"),
  size: z.enum([
    "1",
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10,000",
    "10,001",
  ]),
  // location
  location_region: z.string().optional().or(z.literal("")),
  location_country: z.string().optional().or(z.literal("")),
  location_state: z.string().optional().or(z.literal("")),
  location_city: z.string().optional().or(z.literal("")),
  location_address: z.string().optional().or(z.literal("")),
  location_zipcode: z
    .string()
    .regex(/^[0-9]*$/, "Zip code is not valid")
    .min(2, "Zip code should be at least 2 numbers")
    .optional()
    .or(z.literal("")),

  // old picture url
  picture_old_url: z.string().optional(),

  // image
  picture_file: z.any().refine((arg: File | null | string) => {
    if (arg instanceof File || arg == null || typeof arg == "string")
      return true;
    return false;
  }, "The company logo is not valid image"), // optional

  // url (to delete it after setting by the UpdateObjectURL)
  picture_url: z.string().optional(),

  // description
  description: z.string(),

  // emails
  emails: z
    .array(z.string())
    .refine(
      (arg) =>
        arg
          .map((item) => EmailValidator.safeParse(item).success)
          .every((e) => e),
      "Email is not valid"
    ),

  // category & industry info
  industry: z.string(),
  category: z.string(),

  // phone numbers
  phone_number_mobile: z
    .array(z.string().min(6, "Mobile numbers should be 6 numbers"))
    .refine(
      (arg) => arg.map((item) => MobileRegex.test(item)).every((e) => e),
      "Mobile number is not valid"
    ),
  phone_number_fax: z
    .array(z.string().min(6, "Fax numbers should be 6 numbers"))
    .refine(
      (arg) => arg.map((item) => MobileRegex.test(item)).every((e) => e),
      "Fax number is not valid"
    ),
  phone_number_direct_line: z
    .array(z.string().min(6, "Direct line numbers should be 6 numbers"))
    .refine(
      (arg) => arg.map((item) => MobileRegex.test(item)).every((e) => e),
      "Direct line number is not valid"
    ),
  phone_number_whatsapp: z
    .array(z.string().min(6, "Whatsapp numbers should be 6 numbers"))
    .refine(
      (arg) => arg.map((item) => MobileRegex.test(item)).every((e) => e),
      "Whatsapp number is not valid"
    ),
  phone_number_viber: z
    .array(z.string().min(6, "Viber numbers should be 6 numbers"))
    .refine(
      (arg) => arg.map((item) => MobileRegex.test(item)).every((e) => e),
      "Viber number is not valid"
    ),

  // old phoneNumber&emails
  old_phones_numbers_emails: z.object({
    mobile: z.array(z.string()),
    fax: z.array(z.string()),
    whatsapp: z.array(z.string()),
    viber: z.array(z.string()),
    direct_line: z.array(z.string()),
    emails: z.array(z.string()),
  }),

  // resource
  resource: z.string(),

  // identification details
  identification_TIN: z.string(),
  identification_CRN: z.string(),
  identification_TAX_Code: z.string(),
  identification_Statistical_Code: z.string(),

  // social media
  media_website_account: z.array(z.string()),
  media_linkedin_account: z.array(z.string()),
  media_facebook_account: z.array(z.string()),
  media_instagram_account: z.array(z.string()),
  media_youtube_account: z.array(z.string()),
  media_other_account: z.array(z.string()),

  // old social media accounts & links
  old_social_media_accounts: z.object({
    website: z.array(z.string()),
    linkedin: z.array(z.string()),
    facebook: z.array(z.string()),
    instagram: z.array(z.string()),
    youtube: z.array(z.string()),
    other: z.array(z.string()),
  }),
});

export type UpdateCRMCompanyValidationSchemaType = z.infer<
  typeof UpdateCRMCompanyValidationSchema
>;
