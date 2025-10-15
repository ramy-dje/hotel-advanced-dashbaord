import { z } from "zod";

// Update user zod validation schema

// phone number regex
const MobileRegex = new RegExp(/^(?:\+?(?:[0-9] ?){6,14}[0-9]|[\d]{5,15})$/);

// zod email validator
const EmailValidator = z.string().email();

export const UpdateCRMContactValidationSchema = z
  .object({
    // Profile info
    firstName: z.string().min(2, "First name should at least 2 letters"),
    lastName: z.string().min(2, "Last name should at least 2 letters"),
    gender: z.enum(["male", "female"]),
    // location
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
    }, "The contact picture is not valid image"), // optional

    // url (to delete it after setting by the createObjectURL)
    picture_url: z.string().optional(),

    // bio/description/note about this contact
    bio: z.string(),
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
    // work info
    work_company: z.string(),
    work_occupation: z.string(),
    work_industry: z.string(),

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
      emails: z.array(z.string()),
    }),

    // resource
    resource: z.string(),

    // social media
    media_facebook_account: z.array(z.string()),
    media_instagram_account: z.array(z.string()),
    media_telegram_account: z.array(z.string()),
    media_youtube_account: z.array(z.string()),
    media_linkedin_account: z.array(z.string()),
    media_twitter_account: z.array(z.string()),
    media_tiktok_account: z.array(z.string()),
    media_pinterest_account: z.array(z.string()),
    media_snapchat_account: z.array(z.string()),
    media_reddit_account: z.array(z.string()),
    media_twitch_account: z.array(z.string()),
    media_other_account: z.array(z.string()),

    // old social_media accounts
    old_social_media_accounts: z.object({
      facebook: z.array(z.string()),
      instagram: z.array(z.string()),
      telegram: z.array(z.string()),
      youtube: z.array(z.string()),
      linkedin: z.array(z.string()),
      twitter: z.array(z.string()),
      tiktok: z.array(z.string()),
      pinterest: z.array(z.string()),
      snapchat: z.array(z.string()),
      reddit: z.array(z.string()),
      twitch: z.array(z.string()),
      other: z.array(z.string()),
    }),

    // access (if this contact has access (user account))
    access: z.boolean(),
    // access (if this contact has access (user account))
    old_access: z.boolean(),
    // access info
    accessInfo: z.object({
      username: z.string().optional(),
      role: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
    }),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.access === true && data.old_access === false) {
      // Validate username
      if (!data.accessInfo.username || data.accessInfo.username.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username should be at least 2 letters",
          path: ["accessInfo", "username"],
        });
      }

      // Validate role
      if (!data.accessInfo.role || data.accessInfo.role.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Role is required",
          path: ["accessInfo", "role"],
        });
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.accessInfo.email || !emailRegex.test(data.accessInfo.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email isn't valid",
          path: ["accessInfo", "email"],
        });
      }

      // Validate password
      if (!data.accessInfo.password || data.accessInfo.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be more than 8 characters",
          path: ["accessInfo", "password"],
        });
      }
    }
  });

export type UpdateCRMContactValidationSchemaType = z.infer<
  typeof UpdateCRMContactValidationSchema
>;
