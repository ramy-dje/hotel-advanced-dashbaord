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
import { useController, useFormContext } from "react-hook-form";
import { UpdateDestinationValidationSchemaType } from "../update-destination-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import TextEditor from "@/components/text-editor";

// Update Destination content Section

interface Props {
  id: string;
}

const UpdateDestination_Content_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
    } = useFormContext<UpdateDestinationValidationSchemaType>();
    // logic

    // content controller
    const content_controller = useController({
      control,
      defaultValue: "",
      name: "content",
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Content</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The destination content
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* destination content */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="content">Content</Label>
            <TextEditor
              content={content_controller.field.value}
              heading
              setContent={(n) => {
                content_controller.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[18em] mb-[3em]"
              placeholder="Content Of The Destination"
            />
            {errors?.content ? (
              <InlineAlert type="error">{errors.content.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateDestination_Content_Section;
