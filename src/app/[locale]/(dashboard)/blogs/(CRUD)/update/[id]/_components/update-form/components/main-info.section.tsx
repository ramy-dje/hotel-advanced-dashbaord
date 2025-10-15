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
import { UpdateBlogValidationSchemaType } from "../update-blog-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";
import { cn } from "@/lib/utils";

const maxFileSize = 1024 * 1024 * 4; // 4MB

// Update Blog Main Info Section

interface Props {
  id: string;
}

const UpdateBlog_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
      control,
    } = useFormContext<UpdateBlogValidationSchemaType>();

    // image controller
    const image_controller = useController({
      control,
      name: "image",
    });

    // old image url
    const old_image_url_controller = useController({
      control,
      name: "image_old_url",
    });

    // image url controller
    const image_url_controller = useController({
      control,
      name: "image_url",
    });

    // reset old image
    const resetOldImage = () => {
      // clear the object url
      if (image_url_controller.field.value) {
        URL.revokeObjectURL(image_url_controller.field.value);
      }
      // set the old
      image_controller.field.onChange(old_image_url_controller.field.value);
    };

    // logic
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The post title, writer and image
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* blog title */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="title">Title</Label>
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
          {/* blog author */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="author">Writer</Label>
            <Input
              id="author"
              type="text"
              disabled={disabled}
              placeholder="Writer"
              {...register("author", { required: true })}
            />
            {errors?.author ? (
              <InlineAlert type="error">{errors.author.message}</InlineAlert>
            ) : null}
          </div>
          {/* blog image */}
          <div className="col-span-2">
            <div className="relative flex items-center justify-center w-full border-border border rounded-md">
              <DropZone
                disabled={disabled}
                placeholder="Drop or select image"
                setFiles={(f) => {
                  // clear the old object url if existed
                  if (image_url_controller.field.value) {
                    URL.revokeObjectURL(image_url_controller.field.value);
                  }
                  // set the url
                  const url = URL.createObjectURL(f[0]);
                  image_url_controller.field.onChange(url);
                  // set the file
                  image_controller.field.onChange(f[0]);
                }}
                className={cn(
                  "border-0 w-full z-10",
                  typeof image_controller.field.value !== "string" &&
                    "w-1/2 justify-start"
                )}
                maxSize={maxFileSize}
                maxFiles={1}
                multiple={false}
                accept={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "image/webp": [],
                }}
              />
              {typeof image_controller.field.value !== "string" ? (
                <div className="px-6 flex items-center gap-3">
                  <Button
                    onClick={resetOldImage}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="gap-1"
                  >
                    <HiOutlineTrash className="size-4" />
                    Clear & reset image
                  </Button>
                </div>
              ) : null}
              <span className="absolute z-[9] select-none bottom-1 right-2 text-xs text-accent-foreground">
                Max Image Size 4MB
              </span>
            </div>
            <div className="w-full mb-2">
              {image_controller.field.value ? (
                <UploadedImageItem
                  key={"img"}
                  alt={"main image"}
                  className="mt-3"
                  url={
                    typeof image_controller.field.value == "string"
                      ? image_controller.field.value
                      : (image_url_controller.field.value as string)
                  }
                  onRemove={() => {
                    if (typeof image_controller.field.value !== "string") {
                      // clear the object url
                      URL.revokeObjectURL(
                        image_url_controller.field.value as string
                      );
                    }
                    // clear the file
                    image_controller.field.onChange(undefined);
                  }}
                  meta={
                    typeof image_controller.field.value !== "string"
                      ? {
                          name: image_controller.field.value.name,
                          size: image_controller.field.value.size,
                        }
                      : undefined
                  }
                />
              ) : null}
            </div>
            {errors?.image ? (
              <InlineAlert type="error">
                {errors.image.message as string}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateBlog_MainInformation_Section;
