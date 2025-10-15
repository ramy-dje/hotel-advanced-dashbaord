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
import { useController, useFormContext } from "react-hook-form";
import { UpdateUserValidationSchemaType } from "./update-user-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update user personal info section

interface Props {
  id: string;
}

const UpdateUser_PersonalInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    control,
  } = useFormContext<UpdateUserValidationSchemaType>();

  // gender controller
  const genderController = useController({
    control,
    name: "gender",
    defaultValue: "male",
  });

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Personal Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The user's personal information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* fullname */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            type="text"
            disabled={disabled}
            placeholder="Full name"
            {...register("fullname", { required: true })}
          />
          {errors?.fullname ? (
            <InlineAlert type="error">{errors.fullname.message}</InlineAlert>
          ) : null}
        </div>
        {/* gender */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(e) => e && genderController.field.onChange(e)}
            value={genderController.field.value}
          >
            <SelectTrigger disabled={disabled} id="gender" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors?.gender ? (
            <InlineAlert type="error">{errors.gender.message}</InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default UpdateUser_PersonalInformation_Section;
