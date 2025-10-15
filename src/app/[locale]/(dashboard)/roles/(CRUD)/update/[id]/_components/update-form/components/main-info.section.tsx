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
import { UpdateRoleValidationSchemaType } from "../update-role-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";

// Update Role Main Info Section

interface Props {
  id: string;
}

const UpdateRole_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
    } = useFormContext<UpdateRoleValidationSchemaType>();

    // logic
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The role name and color
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* role name */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              disabled={disabled}
              placeholder="Role Name"
              {...register("name", { required: true })}
            />
            {errors?.name ? (
              <InlineAlert type="error">{errors.name.message}</InlineAlert>
            ) : null}
          </div>
          {/* role color */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              disabled={disabled}
              placeholder="Writer"
              {...register("color", { required: true })}
            />
            {errors?.color ? (
              <InlineAlert type="error">{errors.color.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateRole_MainInformation_Section;
