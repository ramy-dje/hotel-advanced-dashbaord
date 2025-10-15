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
import { UpdateJobValidationSchemaType } from "../update-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import TextEditor from "@/components/text-editor";

// Update Job Main Info Section

interface Props {
  id: string;
}

const UpdateJob_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      register,
    } = useFormContext<UpdateJobValidationSchemaType>();
    // logic

    // descriptions controller
    const description_controller = useController({
      control,
      defaultValue: "",
      name: "description",
    });

    // responsibilities controller
    const responsibilities_controller = useController({
      control,
      defaultValue: "",
      name: "responsibilities_text",
    });

    // // desired profile controller
    const desired_profile_controller = useController({
      control,
      defaultValue: "",
      name: "desired_profile_text",
    });

    // // skills controller
    const skills_controller = useController({
      control,
      name: "skills_text",
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The position title, description and location
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* job title */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="title">title</Label>
            <Input
              id="title"
              type="text"
              disabled={disabled}
              placeholder="Title"
              {...register("title", { required: true })}
            />
            {errors?.title ? (
              <InlineAlert type="error">{errors.title.message}</InlineAlert>
            ) : null}
          </div>
          {/* job state */}
          <div className="flex flex-col col-span-2 md:col-span-1 w-full gap-2">
            <Label htmlFor="state">State Location</Label>
            <Input
              id="state"
              type="text"
              disabled={disabled}
              placeholder="State"
              {...register("location_state", { required: true })}
            />
            {errors?.location_state ? (
              <InlineAlert type="error">
                {errors.location_state.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job city */}
          <div className="flex flex-col col-span-2 md:col-span-1 w-full gap-2">
            <Label htmlFor="city">City Location</Label>
            <Input
              id="city"
              type="text"
              disabled={disabled}
              placeholder="City"
              {...register("location_city", { required: true })}
            />
            {errors?.location_city ? (
              <InlineAlert type="error">
                {errors.location_city.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job address */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="city">Address Location</Label>
            <Input
              id="address"
              type="text"
              disabled={disabled}
              placeholder="Address"
              {...register("location_address", { required: true })}
            />
            {errors?.location_address ? (
              <InlineAlert type="error">
                {errors.location_address.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job description */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextEditor
              content={description_controller.field.value}
              setContent={(n) => {
                description_controller.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Description Of The Position"
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job responsibilities */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <TextEditor
              content={responsibilities_controller.field.value}
              setContent={(n) => {
                responsibilities_controller.field.onChange(n);
              }}
              key="responsibilities"
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Responsibilities"
            />
            {errors?.responsibilities_text ? (
              <InlineAlert type="error">
                {errors.responsibilities_text.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job desired profile */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="desired-profile">Desired Profile</Label>
            <TextEditor
              content={desired_profile_controller.field.value}
              setContent={(n) => {
                desired_profile_controller.field.onChange(n);
              }}
              key="desired"
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Desired Profile"
            />
            {errors?.desired_profile_text ? (
              <InlineAlert type="error">
                {errors.desired_profile_text.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job skills */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="skills">Skills</Label>
            <TextEditor
              content={skills_controller.field.value}
              setContent={(n) => {
                skills_controller.field.onChange(n);
              }}
              key="skills"
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Skills"
            />
            {errors?.skills_text ? (
              <InlineAlert type="error">
                {errors.skills_text.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateJob_MainInformation_Section;
