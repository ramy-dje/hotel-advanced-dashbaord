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
import { CreateDestinationValidationSchemaType } from "../create-destination-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Textarea } from "@/components/ui/textarea";

// Create Destination header Info Section

interface Props {
  id: string;
}

const CreateDestination_HeaderInfo_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
    } = useFormContext<CreateDestinationValidationSchemaType>();

    // logic
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Caption Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The destination caption ,title ,subtitle and description
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* destination header title */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="header-title">Caption Title</Label>
            <Input
              id="header-title"
              type="text"
              disabled={disabled}
              placeholder="Title"
              {...register("header_title", { required: true })}
            />
            {errors?.header_title ? (
              <InlineAlert type="error">
                {errors.header_title.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* destination header subTitle */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="header-subtitle">Caption Subtitle</Label>
            <Input
              id="header-subtitle"
              type="text"
              disabled={disabled}
              placeholder="Subtitle"
              {...register("header_sub_title", { required: true })}
            />
            {errors?.header_sub_title ? (
              <InlineAlert type="error">
                {errors.header_sub_title.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* destination header description */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="header-description">Caption Description</Label>
            <Textarea
              id="header-description"
              disabled={disabled}
              className="w-full h-[6em] resize-none"
              placeholder="Description"
              {...register("header_description", { required: true })}
            />
            {errors?.header_description ? (
              <InlineAlert type="error">
                {errors.header_description.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateDestination_HeaderInfo_Section;
