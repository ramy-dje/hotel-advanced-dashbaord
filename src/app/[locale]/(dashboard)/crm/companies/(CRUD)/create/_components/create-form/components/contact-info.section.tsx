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
import { HiAtSymbol, HiOutlineDeviceMobile } from "react-icons/hi";
import InlineAlert from "@/components/ui/inline-alert";
import { FaFax, FaWhatsapp, FaViber, FaMobileRetro } from "react-icons/fa6";
import FormMultiItemsList from "@/components/form-multi-items-list";
import { Textarea } from "@/components/ui/textarea";

// Create crm company info section

interface Props {
  id?: string;
}

const CreateCRMCompany_ContactInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    control,
    register,
  } = useFormContext<CreateCRMCompanyValidationSchemaType>();

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Contact Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The company contact info emails ,phone numbers section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* source of this company  */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="source">Source</Label>
          <Textarea
            id="source"
            className="w-full h-[6em] resize-none"
            disabled={disabled}
            placeholder="Source of this company"
            {...register("resource", {
              required: true,
            })}
          />
          {errors?.resource ? (
            <InlineAlert type="error">{errors.resource.message}</InlineAlert>
          ) : null}
        </div>
        {/* Emails */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <HiAtSymbol className="text-primary size-3.5" /> Emails
          </Label>
          <FormMultiItemsList
            id="email"
            defaultValuesMount
            placeholder="Email"
            control_name="emails"
            control={control}
            name="Email"
            icon={<HiAtSymbol className="text-primary size-4" />}
          />
          {/* error */}
          {errors?.emails ? (
            <InlineAlert type="error">{errors.emails.message}</InlineAlert>
          ) : null}
        </div>
        {/* Phone Numbers */}
        {/* Mobile number  */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="mobile" className="flex items-center gap-2">
            <HiOutlineDeviceMobile className="text-primary size-3.5" /> Mobile
            Numbers
          </Label>
          <FormMultiItemsList
            id="mobile"
            placeholder="Mobile number"
            defaultValuesMount
            control_name="phone_number_mobile"
            control={control}
            name="Number"
            icon={<HiOutlineDeviceMobile className="text-primary size-4" />}
          />
          {/* error */}
          {errors?.phone_number_mobile ? (
            <InlineAlert type="error">
              {errors.phone_number_mobile.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Fax number  */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="fax" className="flex items-center gap-2">
            <FaFax className="text-primary size-3.5" /> Fax Numbers
          </Label>
          <FormMultiItemsList
            id="fax"
            placeholder="Fax number"
            defaultValuesMount
            control_name="phone_number_fax"
            control={control}
            name="Number"
            icon={<FaFax className="text-primary size-4" />}
          />
          {/* error */}
          {errors?.phone_number_fax ? (
            <InlineAlert type="error">
              {errors.phone_number_fax.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Direct line number  */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="direct-line" className="flex items-center gap-2">
            <FaMobileRetro className="text-primary size-3.5" /> Direct Line
            Numbers
          </Label>
          <FormMultiItemsList
            id="direct-line"
            placeholder="Direct line number"
            defaultValuesMount
            control_name="phone_number_direct_line"
            control={control}
            name="Number"
            icon={<FaMobileRetro className="text-primary size-4" />}
          />
          {/* error */}
          {errors?.phone_number_direct_line ? (
            <InlineAlert type="error">
              {errors.phone_number_direct_line.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Whatsapp number  */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="whatsapp" className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500 size-3.5" /> Whatsapp Numbers
          </Label>
          <FormMultiItemsList
            id="whatsapp"
            defaultValuesMount
            placeholder="Whatsapp number"
            control_name="phone_number_whatsapp"
            control={control}
            name="Number"
            icon={<FaWhatsapp className="text-green-500 size-4" />}
          />
          {/* error */}
          {errors?.phone_number_whatsapp ? (
            <InlineAlert type="error">
              {errors.phone_number_whatsapp.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Viber number  */}
        <div className="flex flex-col col-span-full w-full gap-2">
          <Label htmlFor="whatsapp" className="flex items-center gap-2">
            <FaViber className="text-blue-500 size-3.5" /> Viber Numbers
          </Label>
          <FormMultiItemsList
            id="viber"
            placeholder="Viber number"
            defaultValuesMount
            control_name="phone_number_viber"
            control={control}
            name="Number"
            icon={<FaViber className="text-blue-500 size-4" />}
          />
          {/* error */}
          {errors?.phone_number_viber ? (
            <InlineAlert type="error">
              {errors.phone_number_viber.message}
            </InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreateCRMCompany_ContactInformation_Section;
