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
import { useEffect } from "react";
import {
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { UpdateRateValidationSchemaType } from "../updateRateDetailsValidation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HiOutlineCalendar } from "react-icons/hi";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import InfoSection from "@/app/[locale]/(dashboard)/_components/policies";
import { Switch } from "@/components/ui/switch";
import { TaxInterface } from "@/interfaces/taxes.interface";

interface Props {
  id: string;
  taxes: TaxInterface[];
}

const UpdateRate_Restrictions_Section = ({ id, taxes }: Props) => {
  const {
    formState: { errors, disabled },
    register,
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext<UpdateRateValidationSchemaType>();

  const minAdvancedBookingController = useController({
    control,
    name: "minAdvancedBooking",
  });

  const maxAdvancedBookingController = useController({
    control,
    name: "maxAdvancedBooking",
  });
  const ageRestriction = useWatch({
    control,
    name: "ageRestriction",
  });
  const factorRateCalculator = useWatch({
    control,
    name: "factorRateCalculator",
  });
  const taxIncluded = useWatch({
    control,
    name: "taxIncluded",
  });
  const selectedTax = useWatch({
    control,
    name: "selectedTax",
  });

  useEffect(() => {
    if (taxIncluded) {
      setValue("taxIncluded", taxIncluded);
    }
    if (ageRestriction) {
      setValue("ageRestriction", ageRestriction);
    }
    if (factorRateCalculator) {
      setValue("factorRateCalculator", factorRateCalculator);
    }
    if (selectedTax) {
      setValue("selectedTax", selectedTax);
    }
  }, [taxIncluded,ageRestriction,factorRateCalculator,selectedTax]);

  return (
    <CreationFormSection id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Rate plan and restrictions
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Create your rate by selecting base occupancy, applying restrictions,
          and setting taxes.
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {/* Minimum stay */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Minimum stay through</Label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            placeholder="Minimum of nights"
            {...register("minStay", {
              required: true,
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors?.minStay && (
            <InlineAlert type="error">{errors.minStay.message}</InlineAlert>
          )}
        </div>

        {/* Maximum stay */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Maximum stay through</Label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            placeholder="Maximum of nights"
            {...register("maxStay", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors?.maxStay && (
            <InlineAlert type="error">{errors.maxStay.message}</InlineAlert>
          )}
        </div>

        {/* Min advance booking */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Minimum advance booking date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full gap-2 justify-start text-left font-normal",
                  minAdvancedBookingController.field.value && "text-muted-foreground",
                )}
              >
                <HiOutlineCalendar className="size-4" />
                {minAdvancedBookingController.field.value ? (
                  format(new Date(minAdvancedBookingController.field.value), "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                selected={minAdvancedBookingController.field.value as any}
                mode="single"
                onSelect={(r: Date | undefined) =>
                  minAdvancedBookingController.field.onChange(r ?? null)
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {errors?.minAdvancedBooking && (
            <InlineAlert type="error">{errors.minAdvancedBooking.message}</InlineAlert>
          )}
        </div>

        {/* Max advance booking */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Maximum advance booking date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full gap-2 justify-start text-left font-normal",
                  maxAdvancedBookingController.field.value && "text-muted-foreground",
                )}
              >
                <HiOutlineCalendar className="size-4" />
                {maxAdvancedBookingController.field.value ? (
                  format(new Date(maxAdvancedBookingController.field.value), "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                selected={maxAdvancedBookingController.field.value as any}
                mode="single"
                onSelect={(r: Date | undefined) =>
                  maxAdvancedBookingController.field.onChange(r ?? null)
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {errors?.maxAdvancedBooking && (
            <InlineAlert type="error">{errors.maxAdvancedBooking.message}</InlineAlert>
          )}
        </div>

        {/* Age restriction */}
        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label>Age restriction</Label>
          <Select
            disabled={disabled}
            value={watch("ageRestriction")}
            onValueChange={(value) => setValue("ageRestriction", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age restriction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adults">Adults only</SelectItem>
              <SelectItem value="adults_children">Both adults and children</SelectItem>
            </SelectContent>
          </Select>
          {errors?.ageRestriction && (
            <InlineAlert type="error">{errors.ageRestriction.message}</InlineAlert>
          )}
        </div>

        {/* Factor rate calculator */}
        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label>Factor rate calculator</Label>
          <Select
            disabled={disabled}
            value={watch("factorRateCalculator")}
            onValueChange={(value) => setValue("factorRateCalculator", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select factor rate calculator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PER_GUEST_PER_DAY">Per guest per night</SelectItem>
              <SelectItem value="PER_ACC_PER_DAY">Per accommodation per night</SelectItem>
              <SelectItem value="PER_ACC">Per accommodation</SelectItem>
            </SelectContent>
          </Select>
          {errors?.factorRateCalculator && (
            <InlineAlert type="error">{errors.factorRateCalculator.message}</InlineAlert>
          )}
        </div>

        {/* Tax included toggle */}
        <div className="flex flex-row items-center justify-between col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Tax included</Label>
          <Switch
            disabled={disabled}
            checked={watch("taxIncluded")}
            onCheckedChange={(value) => setValue("taxIncluded", value)}
          />
        </div>

        {/* Select Tax if included */}
        {watch("taxIncluded") && (
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label>Select tax</Label>
            <Select
              disabled={disabled}
              value={watch("selectedTax") || undefined}
              onValueChange={(value) => setValue("selectedTax", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="select a tax" />
              </SelectTrigger>
              <SelectContent>
                {taxes.map((tax) => (
                  <SelectItem key={tax.id || tax.name} value={tax.id}>
                    {tax.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Policies */}
        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label>Policies</Label>
          <InfoSection setValue={setValue} control={control} />
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateRate_Restrictions_Section;
