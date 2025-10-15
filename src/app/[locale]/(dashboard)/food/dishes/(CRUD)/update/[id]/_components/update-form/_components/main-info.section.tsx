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
import { UpdateFoodDishValidationSchemaType } from "./update-dish-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";

const maxFileSize = 1024 * 1024 * 4; // 4MB

// Update Dish Main Info Section

interface Props {
  id: string;
}

const UpdateDish_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
      control,
    } = useFormContext<UpdateFoodDishValidationSchemaType>();

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
            The dish image, title, price and description
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* dish name */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
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
          {/* dish price */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              min={0}
              defaultValue={0}
              type="number"
              disabled={disabled}
              placeholder="Price"
              {...register("price", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors?.price ? (
              <InlineAlert type="error">{errors.price.message}</InlineAlert>
            ) : null}
          </div>
          {/* description */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="w-full h-[6em] resize-none"
              disabled={disabled}
              placeholder="Description"
              {...register("description", {
                required: true,
              })}
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* dish image */}
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

export default UpdateDish_MainInformation_Section;
