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
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateDestinationValidationSchemaType } from "../update-destination-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { generateSimpleId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiOutlineX } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";

// Update Destination Main Info Section

interface Props {
  id: string;
}

const UpdateDestination_MainInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    control,
  } = useFormContext<UpdateDestinationValidationSchemaType>();

  const [features, setFeatures] = useState<{ id: string; name: string }[]>([]);
  const features_input_ref = useRef<HTMLInputElement>(null);

  // old features controller
  const old_features_controller = useController({
    control,
    name: "old_features",
  });

  // features controller
  const features_controller = useController({
    control,
    name: "features",
  });

  // setting the old features
  useEffect(() => {
    if (old_features_controller.field.value) {
      const old = old_features_controller.field.value.map((e) => ({
        id: generateSimpleId(),
        name: e,
      }));
      setFeatures(old);
    }
  }, [old_features_controller.field.value]);

  // setting the keywords
  useEffect(() => {
    if (features) {
      features_controller.field.onChange(features.map((e) => e.name));
    }
  }, [features]);

  // methods

  // add feature
  const handleAddFeature = useCallback(() => {
    if (
      features_input_ref.current?.value &&
      features_input_ref.current?.value.trim() &&
      features_input_ref.current?.value.trim().length >= 2
    ) {
      const tit = features_input_ref.current.value.trim();
      setFeatures((keys) => [
        ...keys,
        {
          id: generateSimpleId(),
          name: tit as string,
        },
      ]);
      features_input_ref.current.value = "";
    }
  }, []);

  // remove feature
  const handelFeatureKey = useCallback((id: string) => {
    setFeatures((keys) => keys.filter((key) => key.id !== id));
  }, []);

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Main Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The destination title ,subTitle , distance and features
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* destination title */}
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
        {/* destination subTitle */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            type="text"
            disabled={disabled}
            placeholder="Subtitle"
            {...register("sub_title", { required: true })}
          />
          {errors?.sub_title ? (
            <InlineAlert type="error">{errors.sub_title.message}</InlineAlert>
          ) : null}
        </div>
        {/* destination distance */}
        <div className="flex flex-col col-span-2  w-full gap-2">
          <Label htmlFor="distance">Distance (Km)</Label>
          <Input
            id="time"
            min={1}
            max={100}
            step={0.5}
            type="number"
            disabled={disabled}
            placeholder="Open Positions"
            {...register("distance", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors?.distance ? (
            <InlineAlert type="error">{errors.distance.message}</InlineAlert>
          ) : null}
        </div>
        {/* destination features */}
        <div className="flex flex-col gap-3 col-span-2">
          <div className="w-full flex items-center gap-5">
            <Input
              placeholder="feature"
              disabled={disabled}
              className="max-w-full xl:w-[24em]"
              ref={features_input_ref}
            />
            <Button
              disabled={disabled}
              type="button"
              onClick={handleAddFeature}
            >
              Add Feature
            </Button>
          </div>
          {/* destinations features */}
          <div className="w-full flex items-center flex-wrap gap-3">
            {features.map((feature) => (
              <Badge
                key={feature.id}
                variant="outline"
                className="rounded-full gap-2 text-sm font-normal"
              >
                {feature.name}
                <button
                  onClick={() => handelFeatureKey(feature.id)}
                  type="button"
                  disabled={disabled}
                  className="text-foreground/60 hover:text-foreground/100"
                >
                  <HiOutlineX className="size-4" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        {/* destination features error */}
        <div className="col-span-2">
          {errors?.features ? (
            <InlineAlert type="error">{errors.features.message}</InlineAlert>
          ) : null}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default UpdateDestination_MainInformation_Section;
