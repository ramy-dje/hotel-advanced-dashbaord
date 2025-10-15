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
import { useFormContext } from "react-hook-form";
import { UpdateCRMContactValidationSchemaType } from "./update-contact-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import CRMContactOccupationInterface from "@/interfaces/crm-occupation.interface";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import FormQuickComboboxComponent from "@/components/from-combobox";

// Update crm contact work info section

interface Props {
  id?: string;
  occupations: CRMContactOccupationInterface[];
  industries: CRMIndustryInterface[];
}

const UpdateCRMContact_WorkInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id, industries, occupations }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    control,
  } = useFormContext<UpdateCRMContactValidationSchemaType>();

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Occupation & Work Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The contacts's occupation,industry and company information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* occupation */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="occupation">Occupation (Optional)</Label>
          <FormQuickComboboxComponent
            name="occupation"
            id="occupation"
            placeholder="Occupation Title"
            control_name="work_occupation"
            list={occupations.map((e) => ({
              label: e.name,
              value: e.name,
            }))}
            control={control}
          />
          {errors?.work_occupation ? (
            <InlineAlert type="error">
              {errors.work_occupation.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* industry */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="industry">Industry (Optional)</Label>
          <FormQuickComboboxComponent
            name="industry"
            id="industry"
            placeholder="Industry Title"
            control_name="work_industry"
            list={industries.map((e) => ({
              label: e.name,
              value: e.name,
            }))}
            control={control}
          />
          {errors?.work_industry ? (
            <InlineAlert type="error">
              {errors.work_industry.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* Company */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            type="text"
            disabled={disabled}
            placeholder="Example (Ouedkniss)"
            {...register("work_company", { required: true })}
          />
          {errors?.work_company ? (
            <InlineAlert type="error">
              {errors.work_company.message}
            </InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default UpdateCRMContact_WorkInformation_Section;
