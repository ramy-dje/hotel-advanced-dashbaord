"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { UpdateRoomExtraServiceValidationSchemaType } from "../update-room-extra-service.schema";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppIconSelect from "@/components/app-icon-select";
import { AppIconComponent } from "@/components/app-icon/icons";
import { HiPlusCircle } from "react-icons/hi";
import { useController } from "react-hook-form";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import UploadedImageItem from "@/components/uploaded-image";
import DropZone from "@/components/upload-files/drop-zone";
import { Checkbox } from "@/components/ui/checkbox";
import useRoomExtraServicesStore from "../../../store";

const maxFileSize = 4 * 1024 * 1024;
function BasicInformations() {
  const {
    formState: { errors, disabled },
    setValue,
    register,
    watch,
    control,
  } = useFormContext<UpdateRoomExtraServiceValidationSchemaType>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { field: IconField } = useController({
    control,
    name: "icon",
    defaultValue: "",
  });
  const image_url_controller = useController({
    control,
    name: "image_url",
  });
  const image_controller = useController({
    control,
    name: "image",
  });
  const {existingCategories} = useRoomExtraServicesStore();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
        {/* Icon */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="icon">Icon</Label>
          <AppIconSelect onClick={(n) => IconField.onChange(n)}>
            <Button
              size="icon"
              variant="outline"
              className="size-10"
            >
              {IconField.value ? (
                <AppIconComponent
                  name={IconField.value}
                  className="size-6 text-primary fill-primary"
                />
              ) : (
                <HiPlusCircle className="size-4 text-accent-foreground/80" />
              )}
            </Button>
          </AppIconSelect>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Service Name</Label>
          <Input
            disabled={isLoading}
            id="name"
            placeholder="Name"
            {...register("name", { required: true })}
          />
          {errors?.name && (
            <InlineAlert type="error">{errors.name.message}</InlineAlert>
          )}
        </div>
      </div>
      {/*featuring image */}
      <div className="col-span-2">
        <Label>Featuring Image</Label>
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
            className="border-0 w-full z-10"
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
              url={image_url_controller.field.value || ""}
              onRemove={() => {
                // clear the object url
                URL.revokeObjectURL(image_url_controller.field.value || "");
                // clear the file
                image_controller.field.onChange(undefined);
              }}
              meta={{
                name: image_controller.field.value?.name,
                size: image_controller.field.value?.size,
              }}
            />
          ) : null}
        </div>
        {errors?.image ? (
          <InlineAlert type="error">
            {errors.image.message as string}
          </InlineAlert>
        ) : null}
      </div>
      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          disabled={isLoading}
          id="description"
          placeholder="Description"
          {...register("description")}
        />
        {errors?.description && (
          <InlineAlert type="error">{errors.description.message}</InlineAlert>
        )}
      </div>
      {/* service category */}
      <div className="">
        <Label>Service Category</Label>
        <Select value={watch("category")} onValueChange={(value) => setValue("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select service category" />
          </SelectTrigger>
          <SelectContent>
            {existingCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.category && (
          <InlineAlert type="error">{errors.category.message}</InlineAlert>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="property_code">Property code</Label>
        <Input
          disabled={isLoading}
          id="property_code"
          placeholder="Property code"
          {...register("property_code")}
        />
        {errors?.property_code && (
          <InlineAlert type="error">{errors.property_code.message}</InlineAlert>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Usage Allowed Areas</Label>
        <div className="flex flex-col gap-1 text-sm">
          {["room", "facility", "property"].map((area) => (
            <label
              key={area}
              className="flex items-center gap-2"
            >
              <Checkbox
                value={area}
                checked={(watch("usageAllowedAreas") || []).includes(area)}
                onCheckedChange={(checked) => {
                  const current = watch("usageAllowedAreas") || [];
                  const updated = checked
                    ? Array.from(new Set([...current, area]))
                    : current.filter((val) => val !== area);
                  setValue("usageAllowedAreas", updated);
                }}
              />
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </label>
          ))}

          {/* Cost Factor Selector shown only when 'room' is selected */}
          {(watch("usageAllowedAreas") || []).includes("room") && (
            <div className="my-2 flex flex-col gap-2">
              <Label>Cost Factor</Label>
              <Select value={watch("costFactor")} onValueChange={(value) => setValue("costFactor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select factor rate calculator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PER_GUEST_PER_DAY">
                    Per guest per night
                  </SelectItem>
                  <SelectItem value="PER_ACC_PER_DAY">
                    Per accommodation per night
                  </SelectItem>
                  <SelectItem value="PER_ACC">Per accommodation</SelectItem>
                </SelectContent>
              </Select>
              {errors?.costFactor && (
                <InlineAlert type="error">
                  {errors.costFactor.message}
                </InlineAlert>
              )}
            </div>
          )}
        </div>

        {/* Error for usageAllowedAreas */}
        {errors?.usageAllowedAreas && (
          <InlineAlert type="error">
            {errors.usageAllowedAreas.message}
          </InlineAlert>
        )}
      </div>
    </>
  );
}

export default BasicInformations;
