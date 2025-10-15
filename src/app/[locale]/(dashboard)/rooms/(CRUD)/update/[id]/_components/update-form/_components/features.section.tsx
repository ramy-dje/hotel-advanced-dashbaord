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
import { UpdateRoomValidationSchemaType } from "../update-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import MultipleSelector from "@/components/ui/mutli-select";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import RoomIncludesInterface from "@/interfaces/room-includes.interface";
import RoomTypeInterface from "@/interfaces/room-type.interface";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";

// Create Room Features Section

interface Props {
  id: string;
  features: RoomFeatureInterface[];
  includes: RoomIncludesInterface[];
  extra_services: RoomExtraServiceInterface[];
  types: RoomTypeInterface[];
  beds: RoomBedInterface[];
}

const UpdateRoom_Features_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, beds, extra_services, features, includes, types }, ref) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<UpdateRoomValidationSchemaType>();

    // features controller
    const features_controller = useController({
      control,
      name: "features",
      defaultValue: [],
    });
    // includes controller
    const includes_controller = useController({
      control,
      name: "includes",
      defaultValue: [],
    });
    // includes controller
    const beds_controller = useController({
      control,
      name: "beds",
      defaultValue: [],
    });
    // types controller
    const types_controller = useController({
      control,
      name: "types",
      defaultValue: [],
    });
    // extra_services controller
    const extra_services_controller = useController({
      control,
      name: "extra_services",
      defaultValue: [],
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Features</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The features of room , types ,includes ,beds ,extra services and
            room features.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* room features */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="features">Room Features</Label>
            <MultipleSelector
              id="features"
              defaultOptions={features.map((feature) => ({
                label: feature.name,
                value: feature.id,
              }))}
              disabled={disabled}
              className="w-full"
              value={
                features_controller.field.value.map((value) => {
                  const feature = features.find((e) => e.id === value);
                  return { label: feature?.name, value: feature?.id };
                }) as never
              }
              onChange={(values) =>
                features_controller.field.onChange(values.map((n) => n.value))
              }
              placeholder="Select features..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            {errors?.features ? (
              <InlineAlert type="error">{errors.features.message}</InlineAlert>
            ) : null}
          </div>
          {/* room beds */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="beds">Room Beds</Label>
            <MultipleSelector
              id="beds"
              defaultOptions={beds.map((bed) => ({
                label: bed.name,
                value: bed.id,
              }))}
              disabled={disabled}
              className="w-full"
              value={
                beds_controller.field.value.map((value) => {
                  const bed = beds.find((e) => e.id === value);
                  return { label: bed?.name, value: bed?.id };
                }) as never
              }
              onChange={(values) =>
                beds_controller.field.onChange(values.map((n) => n.value))
              }
              placeholder="Select features..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            {errors?.beds ? (
              <InlineAlert type="error">{errors.beds.message}</InlineAlert>
            ) : null}
          </div>
          {/* room includes */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="includes">Room Includes</Label>
            <MultipleSelector
              id="includes"
              defaultOptions={includes.map((include) => ({
                label: include.name,
                value: include.id,
              }))}
              className="w-full"
              disabled={disabled}
              value={
                includes_controller.field.value.map((value) => {
                  const include = includes.find((e) => e.id === value);
                  return { label: include?.name, value: include?.id };
                }) as never
              }
              onChange={(values) =>
                includes_controller.field.onChange(values.map((n) => n.value))
              }
              placeholder="Select includes..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            {errors?.includes ? (
              <InlineAlert type="error">{errors.includes.message}</InlineAlert>
            ) : null}
          </div>
          {/* room types */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="types">Room Types</Label>
            <MultipleSelector
              id="types"
              defaultOptions={types.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
              className="w-full"
              disabled={disabled}
              value={
                types_controller.field.value.map((value) => {
                  const type = types.find((e) => e.id === value);
                  return { label: type?.name, value: type?.id };
                }) as never
              }
              onChange={(values) =>
                types_controller.field.onChange(values.map((n) => n.value))
              }
              placeholder="Select types..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            {errors?.types ? (
              <InlineAlert type="error">{errors.types.message}</InlineAlert>
            ) : null}
          </div>
          {/* room extra services */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="extra-services">Room Extra Services</Label>
            <MultipleSelector
              id="extra-services"
              defaultOptions={extra_services.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
              className="w-full"
              disabled={disabled}
              value={
                extra_services_controller.field.value.map((value) => {
                  const service = extra_services.find((e) => e.id === value);
                  return { label: service?.name, value: service?.id };
                }) as never
              }
              onChange={(values) =>
                extra_services_controller.field.onChange(
                  values.map((n) => n.value)
                )
              }
              placeholder="Select services..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            {errors?.extra_services ? (
              <InlineAlert type="error">
                {errors.extra_services.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateRoom_Features_Section;
