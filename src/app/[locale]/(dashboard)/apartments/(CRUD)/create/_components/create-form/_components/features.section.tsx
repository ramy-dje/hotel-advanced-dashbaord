"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema"; // Ensure this schema is updated
import InlineAlert from "@/components/ui/inline-alert";
import MultipleSelector from "@/components/ui/mutli-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import the new ToggleInput component
import { ToggleInput } from "@/app/[locale]/(dashboard)/property/(CRUD)/create/_components/create-form/_components/toggle_button"; // Adjust this path if your ToggleInput is elsewhere

// Assuming these interfaces exist for the options of your dropdowns/multi-selects
interface Option {
  label: string;
  value: string;
}

interface RoomFeatureInterface {
  id: string; // Or number, depending on your actual ID type
  name: string;
}

// Props for the component
interface Props {
  id: string;
  amenities_options: Option[];
  views_options: Option[];
  features_options?: RoomFeatureInterface[];
}

const CreateRoom_Features_Section = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      amenities_options = [],
      views_options = [],
      features_options = [],
    },
    ref
  ) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<CreateRoomValidationSchemaType>();

    const [newAdditionalFeatureInput, setNewAdditionalFeatureInput] = useState("");
    const [newSuitableForInput, setNewSuitableForInput] = useState(""); // State for "Suitable for" input

    // 1. Amenities (Select Dropdown)
    const amenities_controller = useController({
      control,
      name: "amenities",
      defaultValue: "",
    });

    // 2. Views (Select Dropdown)
    const views_controller = useController({
      control,
      name: "views",
      defaultValue: "",
    });

    // 3. Additional Features (Values inputs with a button to add another additional feature)
    const additional_features_controller = useController({
      control,
      name: "additional_features",
      defaultValue: [],
    });

    const handleAddAdditionalFeature = () => {
      if (newAdditionalFeatureInput.trim()) {
        const currentFeatures = additional_features_controller.field.value || [];
        additional_features_controller.field.onChange([
          ...currentFeatures,
          newAdditionalFeatureInput.trim(),
        ]);
        setNewAdditionalFeatureInput("");
      }
    };

    // 4. Suitable for (A text area or editor) - Now manages an array of strings
    const suitable_for_controller = useController({
      control,
      name: "suitable_for",
      defaultValue: [], // Default to an empty array for multiple values
    });

    const handleAddSuitableForValue = () => {
      if (newSuitableForInput.trim()) {
        const currentSuitableFor = suitable_for_controller.field.value || [];
        suitable_for_controller.field.onChange([
          ...currentSuitableFor,
          newSuitableForInput.trim(),
        ]);
        setNewSuitableForInput(""); // Clear the input after adding
      }
    };

    // 8. Configuration (Shared room, private room, entire home) select
    const configuration_controller = useController({
      control,
      name: "configuration",
      defaultValue: "",
    });

    // Optional: Room Features (if you still want to include this as a multi-select)
    const room_features_controller = useController({
      control,
      name: "room_features",
      defaultValue: [],
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Room Details & Features</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Provide detailed information about the room's amenities, views, and specific features.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* 1. Amenities (Select Dropdown List) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Select
              onValueChange={amenities_controller.field.onChange}
              value={amenities_controller.field.value}
              disabled={disabled}
            >
              <SelectTrigger id="amenities" className="w-full">
                <SelectValue placeholder="Select amenities" />
              </SelectTrigger>
              <SelectContent>
                {amenities_options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.amenities ? (
              <InlineAlert type="error">{errors.amenities.message}</InlineAlert>
            ) : null}
          </div>

          {/* 2. Views (Dropdown List) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="views">Views</Label>
            <Select
              onValueChange={views_controller.field.onChange}
              value={views_controller.field.value}
              disabled={disabled}
            >
              <SelectTrigger id="views" className="w-full">
                <SelectValue placeholder="Select views" />
              </SelectTrigger>
              <SelectContent>
                {views_options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.views ? (
              <InlineAlert type="error">{errors.views.message}</InlineAlert>
            ) : null}
          </div>

          {/* 3. Additional Features (Values inputs with a button to add another additional feature) */}
           <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="additional-features">Additional Features</Label>
            <div className="flex items-center gap-2">
              <Input
                id="additional-features-input"
                placeholder="E.g., Smart TV, Coffee Machine"
                value={newAdditionalFeatureInput}
                onChange={(e) => setNewAdditionalFeatureInput(e.target.value)}
                disabled={disabled}
              />
              <Button onClick={handleAddAdditionalFeature} type="button" disabled={disabled}>
                +
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {additional_features_controller.field.value?.map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedFeatures = additional_features_controller.field.value.filter(
                        (_, i) => i !== index
                      );
                      additional_features_controller.field.onChange(updatedFeatures);
                    }}
                    className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={disabled}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {errors?.additional_features ? (
              <InlineAlert type="error">{errors.additional_features.message}</InlineAlert>
            ) : null}
          </div>

          {/* 4. Suitable for (Input field to add multiple values) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="suitable-for">Suitable For</Label>
            <div className="flex items-center gap-2">
              <Input
                id="suitable-for-input"
                placeholder="E.g., Families with kids, Business travelers"
                value={newSuitableForInput}
                onChange={(e) => setNewSuitableForInput(e.target.value)}
                disabled={disabled}
              />
              <Button onClick={handleAddSuitableForValue} type="button" disabled={disabled}>
                +
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suitable_for_controller.field.value?.map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedSuitableFor = suitable_for_controller.field.value.filter(
                        (_, i) => i !== index
                      );
                      suitable_for_controller.field.onChange(updatedSuitableFor);
                    }}
                    className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={disabled}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {errors?.suitable_for ? (
              <InlineAlert type="error">{errors.suitable_for.message}</InlineAlert>
            ) : null}
          </div>

          {/* 5. Accessible Room (Yes, No button) - Using ToggleInput */}
          <ToggleInput name="accessible_room" label="Accessible Room" disabled={disabled} />
           {errors?.accessible_room ? (
            <InlineAlert type="error">{errors.accessible_room.message}</InlineAlert>
          ) : null}

          {/* 6. Connecting Rooms (Yes/No button) - Using ToggleInput */}
          <ToggleInput name="connecting_rooms" label="Connecting Rooms" disabled={disabled} />
           {errors?.connecting_rooms ? (
            <InlineAlert type="error">{errors.connecting_rooms.message}</InlineAlert>
          ) : null}

          {/* 7. Balcony Outdoor Space (Y/N button) - Using ToggleInput */}
          <ToggleInput name="balcony_outdoor_space" label="Balcony/Outdoor Space" disabled={disabled} />
           {errors?.balcony_outdoor_space ? (
            <InlineAlert type="error">{errors.balcony_outdoor_space.message}</InlineAlert>
          ) : null}

          {/* 8. Configuration (Shared room, private room, entire home) select */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="configuration">Configuration</Label>
            <Select
              onValueChange={configuration_controller.field.onChange}
              value={configuration_controller.field.value}
              disabled={disabled}
            >
              <SelectTrigger id="configuration" className="w-full">
                <SelectValue placeholder="Select room configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared_room">Simplex</SelectItem>
                <SelectItem value="private_room">Duplex</SelectItem>
                <SelectItem value="entire_home">Triplex</SelectItem>
                <SelectItem value="entire_home">Multi-level</SelectItem>
                <SelectItem value="entire_home">Penthouse</SelectItem>
              </SelectContent>
            </Select>
            {errors?.configuration ? (
              <InlineAlert type="error">{errors.configuration.message}</InlineAlert>
            ) : null}
          </div>

          {/* Optional: Original Room Features Multi-Select (if still needed) */}
          {features_options && features_options.length > 0 && (
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="room-features">Room Features (Multi-Select)</Label>
              <MultipleSelector
                id="room-features"
                defaultOptions={features_options.map((feature) => ({
                  label: feature.name,
                  value: feature.id,
                }))}
                disabled={disabled}
                className="w-full"
                onChange={(values) =>
                  room_features_controller.field.onChange(values.map((n) => n.value))
                }
                placeholder="Select room features..."
                emptyIndicator={
                  <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                    No results found.
                  </p>
                }
              />
              {errors?.room_features ? (
                <InlineAlert type="error">{errors.room_features.message}</InlineAlert>
              ) : null}
            </div>
          )}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_Features_Section;