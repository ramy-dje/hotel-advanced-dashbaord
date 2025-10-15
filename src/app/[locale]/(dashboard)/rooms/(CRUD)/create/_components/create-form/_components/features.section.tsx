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
      defaultValue: [],
    });

    // 2. Views (Select Dropdown)
    // const views_controller = useController({
    //   control,
    //   name: "views",
    //   defaultValue: "",
    // });

    // 3. Additional Features (Values inputs with a button to add another additional feature)
    const additional_features_controller = useController({
      control,
      name: "additionalFeatures",
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
      name: "suitableFor",
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


    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Room Details & Features</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Provide detailed information about the room's amenities, and specific features.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* 1. Amenities (Select Dropdown List) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Select
              onValueChange={amenities_controller.field.onChange}
              // value={amenities_controller.field.value}
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
          {/* <div className="flex flex-col gap-2 col-span-2">
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
          </div> */}

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
            {errors?.additionalFeatures ? (
              <InlineAlert type="error">{errors.additionalFeatures.message}</InlineAlert>
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
            {errors?.suitableFor ? (
              <InlineAlert type="error">{errors.suitableFor.message}</InlineAlert>
            ) : null}
          </div>

          {/* 5. Accessible Room (Yes, No button) - Using ToggleInput */}
          <ToggleInput name="accessibleRoom" label="Accessible Room" disabled={disabled} />
           {errors?.accessibleRoom ? (
            <InlineAlert type="error">{errors.accessibleRoom.message}</InlineAlert>
          ) : null}

          {/* 6. Connecting Rooms (Yes/No button) - Using ToggleInput */}
          <ToggleInput name="connectingRooms" label="Connecting Rooms" disabled={disabled} />
           {errors?.connectingRooms ? (
            <InlineAlert type="error">{errors.connectingRooms.message}</InlineAlert>
          ) : null}

          {/* 7. Balcony Outdoor Space (Y/N button) - Using ToggleInput */}
          <ToggleInput name="balcony" label="Balcony" disabled={disabled} />
           {errors?.balcony ? (
            <InlineAlert type="error">{errors.balcony.message}</InlineAlert>
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
                <SelectItem value="shared_room">Shared Room</SelectItem>
                <SelectItem value="private_room">Private Room</SelectItem>
                <SelectItem value="entire_home">Entire Home</SelectItem>
              </SelectContent>
            </Select>
            {errors?.configuration ? (
              <InlineAlert type="error">{errors.configuration.message}</InlineAlert>
            ) : null}
          </div>

        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_Features_Section;