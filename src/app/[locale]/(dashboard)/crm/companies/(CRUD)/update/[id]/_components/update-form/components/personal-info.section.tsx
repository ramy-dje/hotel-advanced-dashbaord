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
import InlineAlert from "@/components/ui/inline-alert";
import { UpdateCRMCompanyValidationSchemaType } from "./update-company-validation.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";

// prepare data
const linked_in_company_sizes = [
  "1",
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10,000",
  "10,001",
];

// Update crm company profile info section

const maxFileSize = 1024 * 1024 * 2; // 2MB

interface Props {
  id?: string;
}

const UpdateCRMCompany_ProfileInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    control,
  } = useFormContext<UpdateCRMCompanyValidationSchemaType>();

  // size controller
  const sizeController = useController({
    control,
    name: "size",
    defaultValue: "1-10",
  });

  // image controller
  const image_controller = useController({
    control,
    defaultValue: null,
    name: "picture_file",
  });

  // old image url
  const old_image_url_controller = useController({
    control,
    name: "picture_old_url",
  });

  // image url controller
  const image_url_controller = useController({
    control,
    name: "picture_url",
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
          Profile Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The company's profile,name,size,location information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* first name */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            disabled={disabled}
            placeholder="Company Name"
            {...register("name", { required: true })}
          />
          {errors?.name ? (
            <InlineAlert type="error">{errors.name.message}</InlineAlert>
          ) : null}
        </div>
        {/* size */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="size">Size</Label>
          <Select
            onValueChange={(e) => e && sizeController.field.onChange(e)}
            value={sizeController.field.value}
          >
            <SelectTrigger disabled={disabled} id="size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {linked_in_company_sizes.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.size ? (
            <InlineAlert type="error">{errors.size.message}</InlineAlert>
          ) : null}
        </div>
        {/* location info */}
        {/* region */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="region">Region (Optional)</Label>
          <Input
            id="region"
            type="text"
            disabled={disabled}
            placeholder="Region (Africa)"
            {...register("location_region", { required: true })}
          />
          {errors?.location_region ? (
            <InlineAlert type="error">
              {errors.location_region.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* country */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="country">Country (Optional)</Label>
          <Input
            id="country"
            type="text"
            disabled={disabled}
            placeholder="Example (Algeria)"
            {...register("location_country", { required: true })}
          />
          {errors?.location_country ? (
            <InlineAlert type="error">
              {errors.location_country.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* state */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="state">State (Optional)</Label>
          <Input
            id="state"
            type="text"
            disabled={disabled}
            placeholder="Example (Djelfa)"
            {...register("location_state", { required: true })}
          />
          {errors?.location_state ? (
            <InlineAlert type="error">
              {errors.location_state.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* city */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="city">City (Optional)</Label>
          <Input
            id="city"
            type="text"
            disabled={disabled}
            placeholder="Example (New Djelfa)"
            {...register("location_city", { required: true })}
          />
          {errors?.location_city ? (
            <InlineAlert type="error">
              {errors.location_city.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* zipcode */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="zipcode">Zipcode (Optional)</Label>
          <Input
            id="zipcode"
            type="text"
            disabled={disabled}
            placeholder="Example (17000)"
            {...register("location_zipcode", { required: true })}
          />
          {errors?.location_zipcode ? (
            <InlineAlert type="error">
              {errors.location_zipcode.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* address */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="address">Address (Optional)</Label>
          <Input
            id="address"
            type="text"
            disabled={disabled}
            placeholder="Example (New Djelfa)"
            {...register("location_address", { required: true })}
          />
          {errors?.location_address ? (
            <InlineAlert type="error">
              {errors.location_address.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* description */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="w-full h-[6em] resize-none"
            disabled={disabled}
            placeholder="Description about the company"
            {...register("description", {
              required: true,
            })}
          />
          {errors?.description ? (
            <InlineAlert type="error">{errors.description.message}</InlineAlert>
          ) : null}
        </div>
        {/* logo */}
        <div className="col-span-2">
          <Label className="block mb-2">Company Logo (Optional)</Label>
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
                  image_controller.field.value !== null &&
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
            {typeof image_controller.field.value !== "string" &&
            image_controller.field.value !== null ? (
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
              Max Image Size 2MB
            </span>
          </div>
          <div className="w-full mb-2">
            {image_controller.field.value ? (
              <UploadedImageItem
                key={"img"}
                alt={"user picture"}
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
          {errors?.picture_file ? (
            <InlineAlert type="error">
              {errors.picture_file.message as string}
            </InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default UpdateCRMCompany_ProfileInformation_Section;
