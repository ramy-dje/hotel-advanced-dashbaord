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
import { UpdateCRMContactValidationSchemaType } from "./update-contact-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { HiLink } from "react-icons/hi";
import { RiInstagramFill } from "react-icons/ri";
import FormMultiItemsList from "@/components/form-multi-items-list";

// Update crm contact social media info section

interface Props {
  id?: string;
}

const UpdateCRMContact_SocialMediaInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<UpdateCRMContactValidationSchemaType>();

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
          The contact social media accounts section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
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
            defaultValues={old_social_media_data.instagram}
            defaultValuesMount
            id="instagram"
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
        {/* telegram accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="telegram" className="flex items-center gap-2">
            <FaTelegram className="text-sky-500 size-3.5" /> Telegram accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.telegram}
            defaultValuesMount
            id="telegram"
            placeholder="Telegram account or url"
            control_name="media_telegram_account"
            control={control}
            name="Account"
            icon={<FaTelegram className="text-sky-500 size-4" />}
          />
          {/* error */}
          {errors?.media_telegram_account ? (
            <InlineAlert type="error">
              {errors.media_telegram_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* youtube accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="youtube" className="flex items-center gap-2">
            <FaYoutube className="text-red-500 size-3.5" /> Youtube accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.youtube}
            defaultValuesMount
            id="youtube"
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
        {/* linkedin accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <FaLinkedin className="text-sky-600 size-3.5" /> Linkedin accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.linkedin}
            defaultValuesMount
            id="linkedin"
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
        {/* twitter accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <FaTwitter className="text-blue-500 size-3.5" /> Twitter(X) accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.twitter}
            defaultValuesMount
            id="twitter"
            placeholder="Twitter(X) account or url"
            control_name="media_twitter_account"
            control={control}
            name="Account"
            icon={<FaTwitter className="text-blue-500 size-4" />}
          />
          {/* error */}
          {errors?.media_twitter_account ? (
            <InlineAlert type="error">
              {errors.media_twitter_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* tiktok accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="tiktok" className="flex items-center gap-2">
            <FaTiktok className="text-purple-900 size-3.5" /> Tiktok accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.tiktok}
            defaultValuesMount
            id="tiktok"
            placeholder="Tiktok account or url"
            control_name="media_tiktok_account"
            control={control}
            name="Account"
            icon={<FaTiktok className="text-purple-900 size-4" />}
          />
          {/* error */}
          {errors?.media_tiktok_account ? (
            <InlineAlert type="error">
              {errors.media_tiktok_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* pinterest accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="pinterest" className="flex items-center gap-2">
            <FaPinterest className="text-red-700 size-3.5" /> Pinterest accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.pinterest}
            defaultValuesMount
            id="pinterest"
            placeholder="Pinterest account or url"
            control_name="media_pinterest_account"
            control={control}
            name="Account"
            icon={<FaPinterest className="text-red-700 size-4" />}
          />
          {/* error */}
          {errors?.media_pinterest_account ? (
            <InlineAlert type="error">
              {errors.media_pinterest_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* snapchat accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="snapchat" className="flex items-center gap-2">
            <FaSnapchat className="text-yellow-600 size-3.5" /> Snapchat
            accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.snapchat}
            defaultValuesMount
            id="snapchat"
            placeholder="Snapchat account or url"
            control_name="media_snapchat_account"
            control={control}
            name="Account"
            icon={<FaSnapchat className="text-yellow-600 size-4" />}
          />
          {/* error */}
          {errors?.media_snapchat_account ? (
            <InlineAlert type="error">
              {errors.media_snapchat_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* reddit accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="reddit" className="flex items-center gap-2">
            <FaReddit className="text-orange-500 size-3.5" /> Reddit accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.reddit}
            defaultValuesMount
            id="reddit"
            placeholder="Reddit account or url"
            control_name="media_reddit_account"
            control={control}
            name="Account"
            icon={<FaReddit className="text-orange-500 size-4" />}
          />
          {/* error */}
          {errors?.media_reddit_account ? (
            <InlineAlert type="error">
              {errors.media_reddit_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* twitch accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="twitch" className="flex items-center gap-2">
            <FaTwitch className="text-purple-500 size-3.5" /> Twitch accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.twitch}
            defaultValuesMount
            id="twitch"
            placeholder="Twitch account or url"
            control_name="media_twitch_account"
            control={control}
            name="Account"
            icon={<FaTwitch className="text-purple-500 size-4" />}
          />
          {/* error */}
          {errors?.media_twitch_account ? (
            <InlineAlert type="error">
              {errors.media_twitch_account.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* other accounts */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="other" className="flex items-center gap-2">
            <HiLink className="text-primary size-3.5" /> Other accounts
          </Label>
          <FormMultiItemsList
            defaultValues={old_social_media_data.other}
            defaultValuesMount
            id="other"
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

export default UpdateCRMContact_SocialMediaInformation_Section;
