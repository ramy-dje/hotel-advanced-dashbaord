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
import {
  CreateBlogValidationSchema,
  CreateBlogValidationSchemaType,
} from "../create-blog-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import TextEditor from "@/components/text-editor";

// Create Blog content Section

interface Props {
  id: string;
}

const CreateBlog_Content_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      register,
    } = useFormContext<CreateBlogValidationSchemaType>();
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
            The blog read time and content
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* read time */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="time">Read Time (minutes)</Label>
            <Input
              id="time"
              min={1}
              defaultValue={1}
              type="number"
              disabled={disabled}
              placeholder="Open Positions"
              {...register("read_time", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors?.read_time ? (
              <InlineAlert type="error">{errors.read_time.message}</InlineAlert>
            ) : null}
          </div>

          {/* blog content */}
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
              placeholder="Content Of The Blog"
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

export default CreateBlog_Content_Section;
