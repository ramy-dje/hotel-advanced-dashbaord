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
import { useFormContext, useWatch } from "react-hook-form";
import { UpdateCRMCompanyValidationSchemaType } from "./update-company-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { HiLink } from "react-icons/hi";
import { TbWorldWww } from "react-icons/tb";
import { RiInstagramFill } from "react-icons/ri";
import FormMultiItemsList from "@/components/form-multi-items-list";

// Update crm company social media info section

interface Props {
  id?: string;
}

const UpdateCRMCompany_SocialMediaInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<UpdateCRMCompanyValidationSchemaType>();

  // old social media data watcher
  const old_social_media_data = useWatch({
    control,
    name: "old_social_media_accounts",
  });

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
            defaultValues={old_social_media_data.website}
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
            defaultValues={old_social_media_data.linkedin}
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
            defaultValues={old_social_media_data.facebook}
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
            defaultValues={old_social_media_data.instagram}
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
            defaultValues={old_social_media_data.youtube}
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
            defaultValues={old_social_media_data.other}
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

export default UpdateCRMCompany_SocialMediaInformation_Section;
