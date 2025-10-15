"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import React, { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { CreateCRMCompanyValidationSchemaType } from "./create-company-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { HiLink } from "react-icons/hi";
import { TbWorldWww } from "react-icons/tb";
import { RiInstagramFill } from "react-icons/ri";
import FormMultiItemsList from "@/components/form-multi-items-list";

// Create crm company social media info section

interface Props {
  id?: string;
}

const CreateCRMCompany_SocialMediaInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<CreateCRMCompanyValidationSchemaType>();

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Social Media Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The company social media & accounts & websites links section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* website */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <TbWorldWww className="text-cyan-500 size-3.5" /> Website Links
          </Label>
          <FormMultiItemsList
            id="website"
            defaultValuesMount
            placeholder="websites links"
            control_name="media_website_account"
            control={control}
            name="Website"
            icon={<TbWorldWww className="text-cyan-500 size-4" />}
          />
          {/* error */}
          {errors?.media_website_account ? (
            <InlineAlert type="error">
              {errors.media_website_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* linkedin accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <FaLinkedin className="text-sky-600 size-3.5" /> Linkedin accounts
          </Label>
          <FormMultiItemsList
            id="linkedin"
            defaultValuesMount
            placeholder="Linkedin account or url"
            control_name="media_linkedin_account"
            control={control}
            name="Account"
            icon={<FaLinkedin className="text-sky-600 size-4" />}
          />
          {/* error */}
          {errors?.media_linkedin_account ? (
            <InlineAlert type="error">
              {errors.media_linkedin_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* facebook accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <FaFacebook className="text-blue-500 size-3.5" /> Facebook accounts
          </Label>
          <FormMultiItemsList
            id="facebook"
            defaultValuesMount
            placeholder="Facebook account or url"
            control_name="media_facebook_account"
            control={control}
            name="Account"
            icon={<FaFacebook className="text-blue-500 size-4" />}
          />
          {/* error */}
          {errors?.media_facebook_account ? (
            <InlineAlert type="error">
              {errors.media_facebook_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* instagram accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <RiInstagramFill className="text-pink-500 size-3.5" /> Instagram
            accounts
          </Label>
          <FormMultiItemsList
            id="instagram"
            defaultValuesMount
            placeholder="Instagram account or url"
            control_name="media_instagram_account"
            control={control}
            name="Account"
            icon={<RiInstagramFill className="text-pink-500 size-4" />}
          />
          {/* error */}
          {errors?.media_instagram_account ? (
            <InlineAlert type="error">
              {errors.media_instagram_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* youtube accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="youtube" className="flex items-center gap-2">
            <FaYoutube className="text-red-500 size-3.5" /> Youtube accounts
          </Label>
          <FormMultiItemsList
            id="youtube"
            defaultValuesMount
            placeholder="Youtube account or url"
            control_name="media_youtube_account"
            control={control}
            name="Account"
            icon={<FaYoutube className="text-red-500 size-4" />}
          />
          {/* error */}
          {errors?.media_youtube_account ? (
            <InlineAlert type="error">
              {errors.media_youtube_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* other accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="other" className="flex items-center gap-2">
            <HiLink className="text-primary size-3.5" /> Other accounts
          </Label>
          <FormMultiItemsList
            id="other"
            defaultValuesMount
            placeholder="Other account or url"
            control_name="media_other_account"
            control={control}
            name="Account"
            icon={<HiLink className="text-primary size-4" />}
          />
          {/* error */}
          {errors?.media_other_account ? (
            <InlineAlert type="error">
              {errors.media_other_account.message}
            </InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreateCRMCompany_SocialMediaInformation_Section;
