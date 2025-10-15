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
  UpdateCRMCompanyValidationSchema,
  UpdateCRMCompanyValidationSchemaType,
} from "./components/update-company-validation.schema";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import { UploadFile } from "@/lib/storage";
import { toast } from "react-hot-toast";
import CRMCompanyCategoryInterface from "@/interfaces/crm-category.interface";
import { crud_update_crm_company } from "@/lib/curd/crm-company";
import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import UpdateCRMCompany_ProfileInformation_Section from "./components/personal-info.section";
import UpdateCRMCompany_WorkInformation_Section from "./components/work-info.section";
import UpdateCRMCompany_ContactInformation_Section from "./components/contact-info.section";
import UpdateCRMCompany_SocialMediaInformation_Section from "./components/social-media-info.section";
import UpdateCRMCompany_IdentificationsInformation_Section from "./components/identifications-info.section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  formData: {
    industries: CRMIndustryInterface[];
    categories: CRMCompanyCategoryInterface[];
  };
  old_company: CRMCompanyInterface;
}

export default function UpdateCRMCompanyFrom({ formData, old_company }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateCRMCompanyValidationSchemaType>({
    resolver: zodResolver(UpdateCRMCompanyValidationSchema),
    defaultValues: {
      media_facebook_account: [],
      media_instagram_account: [],
      media_youtube_account: [],
      media_linkedin_account: [],
      media_other_account: [],
      media_website_account: [],
      phone_number_mobile: [],
      phone_number_fax: [],
      phone_number_viber: [],
      phone_number_whatsapp: [],
      phone_number_direct_line: [],
      industry: "",
      category: "",
      resource: "",
      emails: [],
      picture_file: null,
      old_phones_numbers_emails: {
        emails: [],
        fax: [],
        mobile: [],
        viber: [],
        whatsapp: [],
        direct_line: [],
      },
      old_social_media_accounts: {
        facebook: [],
        instagram: [],
        linkedin: [],
        other: [],
        website: [],
        youtube: [],
      },
    },
  });
  // router
  const router = useRouter();

  // tabs state
  const [tab, setTab] = useState<"profile-info" | "contact-info" | string>(
    "profile-info"
  );

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("name");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    // methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // set the old company data
  useEffect(() => {
    // set the old company data to the form
    if (old_company) {
      // profile info
      methods.setValue("name", old_company.info.name);
      methods.setValue("size", old_company.info.size);
      methods.setValue("description", old_company.info.description);
      // location
      methods.setValue("location_region", old_company.info.location?.region);
      methods.setValue("location_country", old_company.info.location?.country);
      methods.setValue("location_state", old_company.info.location?.state);
      methods.setValue("location_city", old_company.info.location?.city);
      methods.setValue("location_zipcode", old_company.info.location?.zipcode);
      methods.setValue("location_address", old_company.info.location?.address);

      // picture (company logo)
      methods.setValue("picture_file", old_company.info.logo || null);
      methods.setValue("picture_old_url", old_company.info.logo || "");

      // contact
      methods.setValue("resource", old_company.resource);

      // old phones numbers & email
      methods.setValue("old_phones_numbers_emails", {
        emails: old_company.emails,
        direct_line: old_company.phoneNumbers.direct_line,
        fax: old_company.phoneNumbers.fax,
        mobile: old_company.phoneNumbers.mobile,
        viber: old_company.phoneNumbers.viber,
        whatsapp: old_company.phoneNumbers.whatsapp,
      });

      // setting phone numbers & emails
      methods.setValue("emails", old_company.emails);
      methods.setValue("phone_number_fax", old_company.phoneNumbers.fax);
      methods.setValue("phone_number_mobile", old_company.phoneNumbers.mobile);
      methods.setValue(
        "phone_number_direct_line",
        old_company.phoneNumbers.direct_line
      );
      methods.setValue("phone_number_viber", old_company.phoneNumbers.viber);
      methods.setValue(
        "phone_number_whatsapp",
        old_company.phoneNumbers.whatsapp
      );

      // industry & work
      methods.setValue("category", old_company?.category || "");
      methods.setValue("industry", old_company?.industry || "");

      // old social media accounts
      methods.setValue("old_social_media_accounts", {
        website: old_company.socialMedia.website,
        linkedin: old_company.socialMedia.linkedin,
        facebook: old_company.socialMedia.facebook,
        instagram: old_company.socialMedia.instagram,
        youtube: old_company.socialMedia.youtube,
        other: old_company.socialMedia.other,
      });

      // setting social media accounts
      [
        "website",
        "linkedin",
        "facebook",
        "instagram",
        "other",
        "youtube",
      ].forEach((item) => {
        methods.setValue(
          `media_${item}_account` as any,
          (old_company.socialMedia[item as never] as string[]) || []
        );
      });

      // identifications details
      methods.setValue(
        "identification_CRN",
        old_company.identificationDetails?.CRN
      );
      methods.setValue(
        "identification_TAX_Code",
        old_company.identificationDetails?.TAX_Code
      );
      methods.setValue(
        "identification_TIN",
        old_company.identificationDetails?.TIN
      );
      methods.setValue(
        "identification_Statistical_Code",
        old_company.identificationDetails?.Statistical_Code
      );
    }
  }, []);

  // handle Update
  const handleUpdate = useCallback(async () => {
    // if the company doesn't exist
    if (!old_company) return;

    // triggering the validation for each section

    // Check the group (tabs fields) that has minimal fields

    // check second group
    const result_second_group = await methods.trigger([
      "emails",
      "phone_number_fax",
      "phone_number_mobile",
      "phone_number_viber",
      "phone_number_direct_line",
      "phone_number_whatsapp",
    ]);

    // if the second group has issues
    if (!result_second_group) {
      setTab("contact-info");
      return;
    }

    // check the all groups
    const result = await methods.trigger();

    // return if the validation didn't pass
    if (!result) {
      setTab("profile-info");
      return;
    }

    // data
    const data: UpdateCRMCompanyValidationSchemaType = methods.getValues();

    setIsLoading(true);
    try {
      // upload the image
      let public_url = "";

      // if the image is changed
      if (
        typeof data.picture_file == "string" &&
        data.picture_file == data.picture_old_url
      ) {
        // old image
        public_url = data.picture_old_url;
      } else if (data.picture_file instanceof File) {
        // new image
        // upload the image
        public_url = await UploadFile(data.picture_file, "company-logo");
      }

      // updating the company
      const company_res = await crud_update_crm_company(old_company.id, {
        info: {
          description: data.description,
          logo: public_url,
          name: data.name,
          size: data.size,
          location: {
            region: data.location_region || "",
            address: data.location_address,
            city: data.location_city,
            country: data.location_country,
            state: data.location_state,
            zipcode: data.location_zipcode,
          },
        },
        emails: data.emails,
        category: data.category || "",
        industry: data.industry || "",
        phoneNumbers: {
          fax: data.phone_number_fax,
          direct_line: data.phone_number_direct_line,
          mobile: data.phone_number_mobile,
          viber: data.phone_number_viber,
          whatsapp: data.phone_number_whatsapp,
        },
        socialMedia: {
          facebook: data.media_facebook_account,
          instagram: data.media_instagram_account,
          linkedin: data.media_linkedin_account,
          other: data.media_other_account,
          website: data.media_website_account,
          youtube: data.media_youtube_account,
        },
        resource: data.resource,
        identificationDetails: {
          CRN: data.identification_CRN,
          Statistical_Code: data.identification_Statistical_Code,
          TAX_Code: data.identification_TAX_Code,
          TIN: data.identification_TIN,
        },
      });

      // clearing the image object URL
      if (data.picture_url) {
        URL.revokeObjectURL(data.picture_url);
      }
      // to the companies page
      router.push("/crm/companies");
      // tost
      toast.success("Company Was Updated Successfully");
    } catch (err) {
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, []);

  return (
    <div className="relative">
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="personal-info"
        className="w-full"
      >
        <TabsList>
          {/* tabs of sections */}
          <TabsTrigger disabled={isLoading} value="profile-info">
            Profile Details
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="contact-info">
            Contact Details
          </TabsTrigger>
        </TabsList>

        <FormProvider {...methods}>
          {/* profile & main info (group 1) */}
          <TabsContent value="profile-info" className="w-full h-auto mt-0">
            <CreationFormContent className="w-full min-h-screen">
              {/* profile info section */}
              <UpdateCRMCompany_ProfileInformation_Section />
              {/* work info */}
              <UpdateCRMCompany_WorkInformation_Section
                industries={formData.industries}
                categories={formData.categories}
              />
              {/* identifications info */}
              <UpdateCRMCompany_IdentificationsInformation_Section />
            </CreationFormContent>
          </TabsContent>
          {/* contact info (group 2) */}
          <TabsContent value="contact-info" className="w-full h-auto mt-0">
            <CreationFormContent className="w-full min-h-screen">
              {/* contact info */}
              <UpdateCRMCompany_ContactInformation_Section />
              {/* social media info */}
              <UpdateCRMCompany_SocialMediaInformation_Section />
            </CreationFormContent>
          </TabsContent>
        </FormProvider>
      </Tabs>

      <CreationFormFooterActions>
        <Button
          onClick={() => router.push("/crm/companies")}
          disabled={isLoading}
          type="button"
          variant="outline"
        >
          {/* cancel */}
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
        >
          Update Company
        </Button>
      </CreationFormFooterActions>
    </div>
  );
}
