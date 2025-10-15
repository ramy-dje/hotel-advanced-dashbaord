import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import {
  CreateCRMContactValidationSchema,
  CreateCRMContactValidationSchemaType,
} from "./components/create-contact-validation.schema";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import CRMContactOccupationInterface from "@/interfaces/crm-occupation.interface";
import CreateCRMContact_PersonalInformation_Section from "./components/personal-info.section";
import CreateCRMContact_ContactInformation_Section from "./components/contact-info.section";
import CreateCRMContact_WorkInformation_Section from "./components/work-info.section";
import CreateCRMContact_SocialMediaInformation_Section from "./components/social-media-info.section";
import CreateCRMContact_AccessInformation_Section from "./components/access-info.section";
import RoleInterface from "@/interfaces/role.interface";
import useAccess from "@/hooks/use-access";
import { UploadFile } from "@/lib/storage";
import { crud_create_user } from "@/lib/curd/user";
import { toast } from "react-hot-toast";
import { crud_create_crm_contact } from "@/lib/curd/crm-contact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  formData: {
    industries: CRMIndustryInterface[];
    occupations: CRMContactOccupationInterface[];
    roles: RoleInterface[];
  };
}

export default function CreateCRMContactFrom({ formData }: Props) {
  // access
  const { has } = useAccess();
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateCRMContactValidationSchemaType>({
    resolver: zodResolver(CreateCRMContactValidationSchema),
    defaultValues: {
      access: false,
      resource: "",
      emails: [],
      accessInfo: {
        email: "",
        password: "",
        role: "",
        username: "",
      },
      media_facebook_account: [],
      media_instagram_account: [],
      media_telegram_account: [],
      media_youtube_account: [],
      media_linkedin_account: [],
      media_twitter_account: [],
      media_tiktok_account: [],
      media_pinterest_account: [],
      media_snapchat_account: [],
      media_reddit_account: [],
      media_twitch_account: [],
      media_other_account: [],
      phone_number_mobile: [],
      phone_number_fax: [],
      phone_number_viber: [],
      phone_number_whatsapp: [],
      work_company: "",
      work_industry: "",
      work_occupation: "",
    },
  });
  // router
  const router = useRouter();

  // tabs state
  const [tab, setTab] = useState<
    "personal-info" | "contact-info" | "access-info" | string
  >("personal-info");

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("firstName");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    // methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = useCallback(async () => {
    // triggering the validation for each section

    // Check the groups (tabs fields) that has minimal fields

    // check second group
    const result_second_group = await methods.trigger([
      "emails",
      "phone_number_fax",
      "phone_number_mobile",
      "phone_number_viber",
      "phone_number_whatsapp",
    ]);

    // if the second group has issues
    if (!result_second_group) {
      setTab("contact-info");
      return;
    }

    // check the third
    const result_third_group = await methods.trigger([
      "access",
      "accessInfo",
      "accessInfo.email",
      "accessInfo.password",
      "accessInfo.role",
      "accessInfo.username",
    ]);

    // if the second group has issues
    if (!result_third_group) {
      setTab("access-info");
      return;
    }

    // check the all groups
    const result = await methods.trigger();

    // return if the validation didn't pass
    if (!result) {
      setTab("personal-info");
      return;
    }

    const data: CreateCRMContactValidationSchemaType = methods.getValues();

    // creation logic
    setIsLoading(true);

    try {
      // upload the image
      const public_url = data.picture_file
        ? await UploadFile(data.picture_file, "contact-profile")
        : "";

      // create a user account if the access is 'true'

      const user_id = !data.access
        ? null
        : await (async () => {
          // if data doesn't exist
          if (
            !data.accessInfo.email ||
            !data.accessInfo.username ||
            !data.accessInfo.password ||
            !data.accessInfo.role
          )
            return null;
          // create the user
          const new_user = await crud_create_user({
            email: data.accessInfo.email,
            fullName: `${data.firstName} ${data.lastName}`,
            username: data.accessInfo.username,
            gender: data.gender,
            location: {
              city: data.location_city,
              country: data.location_country,
              state: data.location_state,
              zipcode: data.location_zipcode,
            },
            password: data.accessInfo.password,
            pic: public_url,
            role: data.accessInfo.role,
            phoneNumbers: [...data.phone_number_mobile],
          });
          // returning the id
          return new_user.id;
        })();

      // creating the contact
      const contact_res = await crud_create_crm_contact({
        personalInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          location: {
            address: data.location_address,
            city: data.location_city,
            country: data.location_country,
            state: data.location_state,
            zipcode: data.location_zipcode,
          },
          pic: public_url,
        },
        emails: data.emails,
        bio: data.bio,
        work: {
          company: data.work_company || "",
          industry: data.work_industry || "",
          occupation: data.work_occupation || "",
        },
        phoneNumbers: {
          fax: data.phone_number_fax,
          mobile: data.phone_number_mobile,
          viber: data.phone_number_viber,
          whatsapp: data.phone_number_whatsapp,
        },
        socialMedia: {
          facebook: data.media_facebook_account,
          instagram: data.media_instagram_account,
          linkedin: data.media_linkedin_account,
          other: data.media_other_account,
          pinterest: data.media_pinterest_account,
          reddit: data.media_reddit_account,
          snapchat: data.media_snapchat_account,
          telegram: data.media_telegram_account,
          tiktok: data.media_tiktok_account,
          twitch: data.media_twitch_account,
          twitter: data.media_twitter_account,
          youtube: data.media_youtube_account,
        },
        resource: data.resource,
        access: user_id,
      });

      // clearing the image object URL
      if (data.picture_url) {
        URL.revokeObjectURL(data.picture_url);
      }
      // to the users page
      router.push("/crm/contacts");
      // tost
      toast.success("Contact Was Created Successfully");
    } catch (err) {
      setIsLoading(false);
      if (err == 409) {
        // this email is used
        methods.setError(
          "accessInfo.email",
          {
            message: "Email Is Used Before",
          },
          {
            shouldFocus: true, // to focus on the email input
          }
        );
        // set the tab to the account section
        setTab("access-info");
      } else {
        toast.error("Something went wrong");
      }
      return;
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full flex flex-col gap-2">
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="personal-info"
        className="w-full">
        <TabsList>
          {/* tabs of sections */}
          <TabsTrigger disabled={isLoading} value="personal-info">
            Profile Details
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="contact-info">
            Contact Details
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="files-info">
            Files
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="billing-info">
            Billings and Orders
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="notifications-info">
            Notifications
          </TabsTrigger>

          {/* this tab require a 'user:create' permission */}
          {has(["user:create"]) ? (
            <TabsTrigger disabled={isLoading} value="access-info">
              Account Settings
            </TabsTrigger>
          ) : null}
        </TabsList>

        <FormProvider {...methods}>
          {/* personal & profile info (group 1) */}
          <TabsContent value="personal-info" className="w-full h-auto mt-0">
            <CreationFormContent className="w-full min-h-screen">
              {/* personal  info section */}
              <CreateCRMContact_PersonalInformation_Section />
              {/* work info */}
              <CreateCRMContact_WorkInformation_Section
                industries={formData.industries}
                occupations={formData.occupations}
              />
            </CreationFormContent>
          </TabsContent>

          {/* contact (group 2)  */}
          <TabsContent value="contact-info" className="w-full h-auto mt-0">
            <CreationFormContent className="w-full min-h-screen">
              {/* contact info */}
              <CreateCRMContact_ContactInformation_Section />
              {/* social media info */}
              <CreateCRMContact_SocialMediaInformation_Section />
            </CreationFormContent>
          </TabsContent>

          {/* account & access (group 3) (Rendered With Permissions)  */}
          {/* this section require a 'user:create' permission */}
          {has(["user:create"]) ? (
            <TabsContent
              value="access-info"
              className="w-full min-h-screen h-auto mt-0"
            >
              <CreationFormContent className="max-h-max">
                {/* account & access */}
                <CreateCRMContact_AccessInformation_Section
                  roles={formData.roles}
                />
              </CreationFormContent>
            </TabsContent>
          ) : null}
        </FormProvider>
      </Tabs>

      <CreationFormFooterActions>
        <Button
          onClick={() => router.push("/crm/contacts")}
          disabled={isLoading}
          type="button"
          variant="outline"
        >
          {/* cancel */}
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
        >
          Create Contact
        </Button>
      </CreationFormFooterActions>
    </div>
  );
}
