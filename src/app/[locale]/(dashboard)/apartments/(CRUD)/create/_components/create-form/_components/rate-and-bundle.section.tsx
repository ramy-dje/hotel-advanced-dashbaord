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
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import MultipleSelector from "@/components/ui/mutli-select"; // For the search-enabled dropdown

// Assuming these interfaces are defined globally or locally as needed
interface Option {
  label: string;
  value: string;
}

interface RateCodeOption {
  id: string;
  name: string;
}

// Props for the new component
interface Props {
  id: string;
  rate_code_options: RateCodeOption[]; // Options for the rate code dropdown
  frequently_bought_options: Option[]; // Options for frequently bought together items
}

const CreateRoom_RateAndBundles_Section = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      rate_code_options = [], // Default to empty array for safety
      frequently_bought_options = [], // Default to empty array for safety
    },
    ref
  ) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<CreateRoomValidationSchemaType>();

    // Rate Plan (Rate Code like a select drop down with a search)
    const rate_code_controller = useController({
      control,
      name: "rate_code", // This must be a field in your CreateRoomValidationSchemaType
      defaultValue: "",
    });

    // Frequently Bought Together (values inputs with a button to add another additionl feature)
    const frequently_bought_together_controller = useController({
      control,
      name: "frequently_bought_together", // This must be a field in your CreateRoomValidationSchemaType (e.g., string[])
      defaultValue: [],
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Rate Plans & Bundles</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Configure the rate plan for this room and add frequently bundled items.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* Rate Plan (Rate Code Select Dropdown with Search) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="rate-code">Rate Code</Label>
            <MultipleSelector
              id="rate-code"
              defaultOptions={rate_code_options.map((rate) => ({
                label: rate.name,
                value: rate.id,
              }))}
              disabled={disabled}
              className="w-full"
              onChange={(values) => {
                // Ensure single selection logic for this field
                rate_code_controller.field.onChange(values.length > 0 ? values[0].value : "");
              }}
              // Display the currently selected value correctly
              value={
                rate_code_controller.field.value
                  ? [{ label: rate_code_options.find(opt => opt.id === rate_code_controller.field.value)?.name || "", value: rate_code_controller.field.value }]
                  : []
              }
              placeholder="Search or select a rate code..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
              maxSelected={1} // Important: Restrict to single selection
            />
            {errors?.rate_code ? (
              <InlineAlert type="error">{errors.rate_code.message}</InlineAlert>
            ) : null}
          </div>

          {/* Frequently Bought Together (Multi-select) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="frequently-bought-together">Frequently Bought Together</Label>
            <MultipleSelector
              id="frequently-bought-together"
              defaultOptions={frequently_bought_options.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              disabled={disabled}
              className="w-full"
              onChange={(values) =>
                frequently_bought_together_controller.field.onChange(values.map((n) => n.value))
              }
              placeholder="Select items frequently bought together..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
            />
            {errors?.frequently_bought_together ? (
              <InlineAlert type="error">{errors.frequently_bought_together.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_RateAndBundles_Section;