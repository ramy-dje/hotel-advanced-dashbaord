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
import { CreateFoodMenuValidationSchemaType } from "./create-menu-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";

// Create menu Main Info Section

interface Props {
  id: string;
}

const CreateMenu_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
    } = useFormContext<CreateFoodMenuValidationSchemaType>();

    // logic
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The menu name
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* menu name */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              disabled={disabled}
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {errors?.name ? (
              <InlineAlert type="error">{errors.name.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateMenu_MainInformation_Section;
