"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { CreateCRMCompanyValidationSchemaType } from "./create-company-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import FormQuickComboboxComponent from "@/components/from-combobox";
import CRMCompanyCategoryInterface from "@/interfaces/crm-category.interface";

// Create crm company work info section

interface Props {
  id?: string;
  categories: CRMCompanyCategoryInterface[];
  industries: CRMIndustryInterface[];
}

const CreateCRMCompany_WorkInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id, industries, categories }, ref) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<CreateCRMCompanyValidationSchemaType>();

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Industry & Work Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The company's industry and category information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* category */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="category">Category (Optional)</Label>
          <FormQuickComboboxComponent
            name="category"
            id="category"
            placeholder="Category Title"
            control_name="category"
            list={categories.map((e) => ({
              label: e.name,
              value: e.name,
            }))}
            control={control}
          />
          {errors?.category ? (
            <InlineAlert type="error">{errors.category.message}</InlineAlert>
          ) : null}
        </div>
        {/* industry */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="industry">Industry (Optional)</Label>
          <FormQuickComboboxComponent
            name="industry"
            id="industry"
            placeholder="Industry Title"
            control_name="industry"
            list={industries.map((e) => ({
              label: e.name,
              value: e.name,
            }))}
            control={control}
          />
          {errors?.industry ? (
            <InlineAlert type="error">{errors.industry.message}</InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreateCRMCompany_WorkInformation_Section;
