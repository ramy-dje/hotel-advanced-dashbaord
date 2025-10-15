"use client";
import React from 'react'; // Added explicit React import as a potential safeguard
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useState, useEffect, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BedroomBedConfiguration from "./_components/bedroom-bed-configuration";

// Interface for a selected bed within a bedroom
interface Bed { id: string; name: string; iconPath: string; }
interface SelectedBed extends Bed { quantity: number; }

const CreateRoom_Capacity_Section = forwardRef<HTMLDivElement, { id: string }>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      register,
      control,
    } = useFormContext<CreateRoomValidationSchemaType>();

    const adults = useWatch({ control, name: "capacity_adults" }) || 0;
    const children = useWatch({ control, name: "capacity_children" }) || 0;
    const total = Number(adults) + Number(children);

    // Watch the 'bedrooms' field to dynamically generate bed configuration sections
    const numberOfBedrooms = useWatch({ control, name: "bedrooms" });

    // Watch the 'extraBeds' field for conditional rendering of the extra bed fee
    const extraBeds = useWatch({ control, name: "extraBeds" }) || 0;

    // State to hold bed configurations for each bedroom
    // This will be an array where each element is an array of SelectedBed for a specific bedroom
    const [bedsByBedroom, setBedsByBedroom] = useState<SelectedBed[][]>([]);

    // Effect to synchronize bedsByBedroom state with the numberOfBedrooms input
    useEffect(() => {
      // Ensure numberOfBedrooms is a non-negative number
      if (numberOfBedrooms === undefined || numberOfBedrooms < 0) {
        setBedsByBedroom([]); // Reset if invalid or zero bedrooms
        return;
      }

      setBedsByBedroom(prevBeds => {
        const newBedsByBedroom = [...prevBeds]; // Create a mutable copy

        // If the number of bedrooms decreased, truncate the array
        if (newBedsByBedroom.length > numberOfBedrooms) {
          return newBedsByBedroom.slice(0, numberOfBedrooms);
        }

        // If the number of bedrooms increased, add empty arrays for new bedrooms
        while (newBedsByBedroom.length < numberOfBedrooms) {
          newBedsByBedroom.push([]); // Add an empty array for each new bedroom
        }
        return newBedsByBedroom;
      });
    }, [numberOfBedrooms]); // Rerun this effect whenever numberOfBedrooms changes

    // Callback function to save the bed configuration for a specific bedroom
    const handleSaveBedroomBeds = useCallback((index: number, beds: SelectedBed[]) => {
      setBedsByBedroom(prevBeds => {
        const updatedBeds = [...prevBeds];
        updatedBeds[index] = beds; // Update the beds for the specific bedroom index
        return updatedBeds;
      });
    }, []);

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Size & Capacity
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The room square size and capacity for adults and children.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent className="grid-cols-2">
          {/* Size section - full width */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="size">
              Size
              <span className="text-xs ml-1">(Value & Unit)</span>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="size"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="Value"
                {...register("size", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <Select {...register("size_unit")}>
                <SelectTrigger
                  id="size_unit"
                  disabled={disabled}
                  className="w-auto"
                >
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqm">Square Meters</SelectItem>
                  <SelectItem value="sqft">Square Feet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors?.size && (
              <InlineAlert type="error">{errors.size.message}</InlineAlert>
            )}
          </div>

          {/* Capacity section - full width */}
          <div className="flex flex-col col-span-2 gap-4 mt-4">
            <Label>Capacity</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="adults">Adults</Label>
                <Input
                  id="adults"
                  min={0}
                  defaultValue={0}
                  type="number"
                  disabled={disabled}
                  placeholder="# Adults"
                  {...register("capacity_adults", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors?.capacity_adults && (
                  <InlineAlert type="error">
                    {errors.capacity_adults.message}
                  </InlineAlert>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  min={0}
                  defaultValue={0}
                  type="number"
                  disabled={disabled}
                  placeholder="# Children"
                  {...register("capacity_children", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors?.capacity_children && (
                  <InlineAlert type="error">
                    {errors.capacity_children.message}
                  </InlineAlert>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Label>Total Guests:</Label>
              <span className="ml-2 font-medium">{total}</span>
            </div>
          </div>

          {/* Room features - 2 column grid */}
          <div className="grid grid-cols-2 gap-4 col-span-2 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="beds">Number of Beds</Label>
              <Input
                id="beds"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="Beds"
                {...register("beds", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.beds && (
                <InlineAlert type="error">{errors.beds.message}</InlineAlert>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="Bedrooms"
                {...register("bedrooms", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.bedrooms && (
                <InlineAlert type="error">{errors.bedrooms.message}</InlineAlert>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="Bathrooms"
                {...register("bathrooms", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.bathrooms && (
                <InlineAlert type="error">{errors.bathrooms.message}</InlineAlert>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sittingAreas">Sitting Areas</Label>
              <Input
                id="sittingAreas"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="# Sitting Areas"
                {...register("sitting_areas", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.sitting_areas && (
                <InlineAlert type="error">{errors.sitting_areas.message}</InlineAlert>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="kitchens">Kitchens</Label>
              <Input
                id="kitchens"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="# Kitchens"
                {...register("kitchens", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.kitchens && (
                <InlineAlert type="error">{errors.kitchens.message}</InlineAlert>
              )}
            </div>
          </div>

          {/* Dynamic Bedroom Bed Configuration Section */}
          <div className="col-span-2 mt-6">
            <h3 className="font-semibold text-lg mb-4">Bed Details by Bedroom</h3>
            {/* Render a BedroomBedConfiguration component for each bedroom */}
            {numberOfBedrooms > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: numberOfBedrooms }).map((_, index) => (
                  <BedroomBedConfiguration
                    key={index} // Use index as key
                    bedroomIndex={index}
                    initialBeds={bedsByBedroom[index] || []} // Pass current beds for this bedroom
                    onSave={(beds) => handleSaveBedroomBeds(index, beds)} // Pass save handler
                    disabled={disabled}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Please specify the number of bedrooms to configure their beds.</p>
            )}
          </div>

          {/* Extra Beds Section - FIXES APPLIED HERE */}
          {/* <div className="col-span-2 mt-6"> */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="extra_beds">Extra Beds</Label>
              <Input
                id="extra_beds"
                min={0}
                defaultValue={0}
                type="number"
                disabled={disabled}
                placeholder="# Extra Beds" 
                {...register("extraBeds", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors?.extraBeds && (
                <InlineAlert type="error">{errors.extraBeds.message}</InlineAlert>
              )}
            </div>

            {extraBeds > 0 && (
              < div className="flex flex-col gap-2">
                <Label htmlFor="extra_beds_fee">Extra Bed Fee</Label>
                <Input
                  id="extra_beds_fee"
                  min={0}
                  defaultValue={0}
                  type="number"
                  disabled={disabled}
                  placeholder="Extra Bed Fee" 
                  {...register("extraBedFee", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors?.extraBedFee && (
                  <InlineAlert type="error">{errors.extraBedFee.message}</InlineAlert>
                )}
              </div>
            )}
          {/* </div> */}
        </CreationFormSectionContent>
      </CreationFormSection >
    );
  }
);

export default CreateRoom_Capacity_Section;
