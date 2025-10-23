"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { useController, useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import { Label } from "@/components/ui/label";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { HiOutlineCalendar } from "react-icons/hi";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateOffers_valid_from_to_Section = () => {
  const {
    formState: { errors, disabled, isSubmitted },
    register,
    getValues,
    watch,
    setValue,
    control,
  } = useFormContext<UpdateOffersValidationSchemaType>();
  const startDateController = useController({
    control,
    name: "timeValidity.startDate",
  });
  const endDateController = useController({
    control,
    name: "timeValidity.endDate",
  });
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Active dates</h1>
        <br />
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Start date</Label>
          <Popover>
            <PopoverTrigger
              id="expire"
              asChild
            >
              <Button
                id="date"
                disabled={disabled}
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full gap-2 justify-start text-left font-normal",
                  startDateController.field.value && "text-muted-foreground",
                )}
              >
                <HiOutlineCalendar className="size-4" />
                {startDateController.field.value ? (
                  format(startDateController.field.value, "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDateController.field.value as any}
                onSelect={(date: Date | undefined) => {
                  startDateController.field.onChange(date?.toString());
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {errors?.timeValidity?.startDate && (
            <InlineAlert type="error">
              {errors.timeValidity.startDate.message}
            </InlineAlert>
          )}
        </div>
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label>Start time</Label>
          <Select
            disabled={disabled}
            value={watch("timeValidity.startTime")}
            onValueChange={(value) => {
              setValue("timeValidity.startTime", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {[
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
              ].map((time) => (
                <SelectItem
                  key={time}
                  value={time}
                >
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.timeValidity?.startTime && (
            <InlineAlert type="error">
              {errors.timeValidity.startTime.message}
            </InlineAlert>
          )}
        </div>
        <div className="flex flex-row col-span-2 w-full gap-2">
          <Checkbox
            id="hasEndDate"
            checked={watch("timeValidity.hasEndDate")}
            onCheckedChange={(checked: boolean) =>
              setValue("timeValidity.hasEndDate", checked)
            }
          />
          <Label htmlFor="hasEndDate">Set end date</Label>
        </div>
        {watch("timeValidity.hasEndDate") && (
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label>End date</Label>
            <Popover>
              <PopoverTrigger
                id="expire"
                asChild
              >
                <Button
                  id="date"
                  disabled={disabled}
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full gap-2 justify-start text-left font-normal",
                    endDateController.field.value && "text-muted-foreground",
                  )}
                >
                  <HiOutlineCalendar className="size-4" />
                  {endDateController.field.value ? (
                    format(endDateController.field.value, "LLL dd, y")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDateController.field.value as any}
                  onSelect={(date: Date | undefined) => {
                    endDateController.field.onChange(date?.toString());
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors?.timeValidity?.endDate && (
              <InlineAlert type="error">
                {errors.timeValidity.endDate.message}
              </InlineAlert>
            )}
          </div>
        )}
        {watch("timeValidity.hasEndDate") && (
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label>End time</Label>
            <Select
              disabled={disabled}
              value={watch("timeValidity.endTime")}
              onValueChange={(value) => {
                setValue("timeValidity.endTime", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "00:00",
                  "01:00",
                  "02:00",
                  "03:00",
                  "04:00",
                  "05:00",
                  "06:00",
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                  "22:00",
                  "23:00",
                ].map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.timeValidity?.endTime && (
              <InlineAlert type="error">
                {errors.timeValidity.endTime.message}
              </InlineAlert>
            )}
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffers_valid_from_to_Section;
