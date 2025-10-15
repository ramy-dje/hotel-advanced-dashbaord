"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import InlineAlert from "@/components/ui/inline-alert";
import { CreateCRMCompanyValidationSchemaType } from "./create-company-validation.schema";
import { useFormContext } from "react-hook-form";

// Create crm company identifications info section

interface Props {
  id?: string;
}

const CreateCRMCompany_IdentificationsInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
  } = useFormContext<CreateCRMCompanyValidationSchemaType>();

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Identifications Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The company's identifications information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* TIN */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="tin">TIN (Tax Identification Number)</Label>
          <Input
            id="tin"
            type="text"
            disabled={disabled}
            placeholder="Company TIN"
            {...register("identification_TIN", { required: true })}
          />
          {errors?.identification_TIN ? (
            <InlineAlert type="error">
              {errors.identification_TIN.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* CRN */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="crn">CRN (Company Registration Number)</Label>
          <Input
            id="crn"
            type="text"
            disabled={disabled}
            placeholder="Company CRN"
            {...register("identification_CRN", { required: true })}
          />
          {errors?.identification_CRN ? (
            <InlineAlert type="error">
              {errors.identification_CRN.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* TAX Code */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="tax_code">TAX Code (Tax Article)</Label>
          <Input
            id="tax_code"
            type="text"
            disabled={disabled}
            placeholder="Company TAX Code"
            {...register("identification_TAX_Code", { required: true })}
          />
          {errors?.identification_TAX_Code ? (
            <InlineAlert type="error">
              {errors.identification_TAX_Code.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Statistical Code */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="statistical_code">
            Statistical Code (Statistical Identification Number)
          </Label>
          <Input
            id="statistical_code"
            type="text"
            disabled={disabled}
            placeholder="Company statistical code"
            {...register("identification_Statistical_Code", { required: true })}
          />
          {errors?.identification_Statistical_Code ? (
            <InlineAlert type="error">
              {errors.identification_Statistical_Code.message}
            </InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreateCRMCompany_IdentificationsInformation_Section;
