import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import {
  CreateCRMCompanyValidationSchema,
  CreateCRMCompanyValidationSchemaType,
} from "./components/create-company-validation.schema";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import { UploadFile } from "@/lib/storage";
import { toast } from "react-hot-toast";
import CRMCompanyCategoryInterface from "@/interfaces/crm-category.interface";
import CreateCRMCompany_ProfileInformation_Section from "./components/personal-info.section";
import CreateCRMCompany_WorkInformation_Section from "./components/work-info.section";
import CreateCRMCompany_ContactInformation_Section from "./components/contact-info.section";
import CreateCRMCompany_SocialMediaInformation_Section from "./components/social-media-info.section";
import CreateCRMCompany_IdentificationsInformation_Section from "./components/identifications-info.section";
import { crud_create_crm_company } from "@/lib/curd/crm-company";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  formData: {
    industries: CRMIndustryInterface[];
    categories: CRMCompanyCategoryInterface[];
  };
}

export default function CreateCRMCompanyFrom({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateCRMCompanyValidationSchemaType>({
    resolver: zodResolver(CreateCRMCompanyValidationSchema),
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

  // handle create
  const handleCreate = useCallback(async () => {
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
    const data: CreateCRMCompanyValidationSchemaType = methods.getValues();

    setIsLoading(true);
    try {
      // upload the image
      const public_url = data.picture_file
        ? await UploadFile(data.picture_file, "company-logo")
        : "";

      // creating the company
      const company_res = await crud_create_crm_company({
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
        category: data.category,
        industry: data.industry,
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
      // to the users page
      router.push("/crm/companies");
      // tost
      toast.success("Company Was Created Successfully");
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
              <CreateCRMCompany_ProfileInformation_Section />
              {/* work info */}
              <CreateCRMCompany_WorkInformation_Section
                industries={formData.industries}
                categories={formData.categories}
              />
              {/* identifications info */}
              <CreateCRMCompany_IdentificationsInformation_Section />
            </CreationFormContent>
          </TabsContent>
          {/* contact info (group 2) */}
          <TabsContent value="contact-info" className="w-full h-auto mt-0">
            <CreationFormContent className="w-full min-h-screen">
              {/* contact info */}
              <CreateCRMCompany_ContactInformation_Section />
              {/* social media info */}
              <CreateCRMCompany_SocialMediaInformation_Section />
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
          onClick={handleCreate}
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
        >
          Create Company
        </Button>
      </CreationFormFooterActions>
    </div>
  );
}
