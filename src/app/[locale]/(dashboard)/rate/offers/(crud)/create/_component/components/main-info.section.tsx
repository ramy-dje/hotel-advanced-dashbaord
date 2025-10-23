"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateOffersValidationSchemaType } from "../createOffersValidation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Textarea } from "@/components/ui/textarea";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { useSearchParams } from "next/navigation";

// Create offer Main Info Section

const maxFileSize = 1024 * 1024 * 4; // 4MB

const CreateOffer_MainInformation_Section = () => {
  const {
    formState: { errors, disabled, isSubmitSuccessful },
    register,
    control,
    setValue,
  } = useFormContext<CreateOffersValidationSchemaType>();
  // image controller
  const image_url_controller = useController({
    control,
    name: "image_url",
  });
  const image_controller = useController({
    control,
    name: "image",
  });
  const offerType = useSearchParams().get(
    "offerType",
  ) as CreateOffersValidationSchemaType["type"];
  // Set isActive to true by default
  useEffect(() => {
    setValue("isActive", true);
    setValue("type", offerType);
    setValue("method", "auto");
  }, [offerType]);
  // logic
  function typeConverter(offerType: string) {
    if (offerType == "amountOfProducts") {
      return "Amount off products";
    } else if (offerType == "buyXGetY") {
      return "Buy X Get Y";
    } else if (offerType == "package") {
      return "Package";
    } else if (offerType == "amountOfOrder") {
      return "Total Order Amount";
    }
  }
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">{typeConverter(offerType)}</h1>
        <br />

        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label htmlFor="name">Offer name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Set the offer name"
            {...register("name", {
              required: "Name is required",
            })}
          />
          <p className="text-xs text-gray-500">
            Customers will see this in their cart and at checkout.
          </p>
          {errors?.name ? (
            <InlineAlert type="error">{errors.name.message}</InlineAlert>
          ) : null}
        </div>
        <div className="col-span-2">
          <Label>Featuring Image (optional)</Label>
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
                  name: image_controller.field.value?.name || "",
                  size: image_controller.field.value?.size || "",
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

        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Set the offer description"
            rows={8}
            {...register("description")}
          />
          {errors?.description ? (
            <InlineAlert type="error">{errors.description.message}</InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateOffer_MainInformation_Section;
