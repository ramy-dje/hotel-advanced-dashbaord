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
import { forwardRef, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRateValidationSchemaType } from "../createRateDetailsValidation.schema";
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
import { HiOutlineCalendar, HiOutlineRefresh } from "react-icons/hi";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import PolicyManager from "@/app/[locale]/(dashboard)/_components/policies";
import { Switch } from "@/components/ui/switch";
import { TaxInterface } from "@/interfaces/taxes.interface";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdOutlineInfo } from "react-icons/md";

// Create Rate Main Info Section

interface Props {
  id: string;
  taxes: TaxInterface[];
}

const CreateRate_Restrictions_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, taxes }, ref) => {
    const {
      formState: { errors, disabled, isSubmitSuccessful },
      register,
      control,
      watch,
      setValue,
    } = useFormContext<CreateRateValidationSchemaType>();

    const minAdvancedBookingController = useController({
      control,
      name: "minAdvancedBooking",
    });
    const maxAdvancedBookingController = useController({
      control,
      name: "maxAdvancedBooking",
    });
    useEffect(() => {
      setValue("selectedTax", "no_taxes");
    }, []);
    useEffect(() => {
      setValue("taxIncluded", false);
    }, []);
    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Rules and restrictions
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Create your rate by selecting base occupancy, applying restrictions,
            and setting taxes.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label>Minimum stay through</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                placeholder="set minimum of required days"
                {...register("minStay", {
                  required: true,
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
              {errors?.minStay ? (
                <InlineAlert type="error">{errors.minStay.message}</InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label>Maximum stay through (optional)</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                placeholder="set maximum of required days"
                {...register("maxStay", {
                  required: true,
                  setValueAs(value) {
                    return value === "" ? undefined : Number(value);
                  },
                })}
              />
              {errors?.maxStay ? (
                <InlineAlert type="error">{errors.maxStay.message}</InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <div className="flex items-center justify-between">
                <Label>Minimum advance booking date</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="link"
                      type="button"
                      aria-label="Refresh Articles Analytics"
                      className="size-8"
                    >
                      <MdOutlineInfo className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    align="center"
                    className="text-xs max-w-[350px]"
                  >
                    minimum number of days in advance that a guest must book a
                    room before the check-in date.
                  </TooltipContent>
                </Tooltip>
              </div>
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
                      minAdvancedBookingController.field.value &&
                        "text-muted-foreground",
                    )}
                  >
                    <HiOutlineCalendar className="size-4" />
                    {minAdvancedBookingController.field.value ? (
                      format(
                        minAdvancedBookingController.field.value,
                        "LLL dd, y",
                      )
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
                    // initialFocus
                    selected={minAdvancedBookingController.field.value as any}
                    mode="single"
                    onSelect={(r: any) => {
                      minAdvancedBookingController.field.onChange(r.toString());
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {errors?.minAdvancedBooking ? (
                <InlineAlert type="error">
                  {errors.minAdvancedBooking.message}
                </InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <div className="flex items-center justify-between">
                <Label>Maximum advance booking date (optional)</Label>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="link"
                      type="button"
                      aria-label="Refresh Articles Analytics"
                      className="size-8"
                    >
                      <MdOutlineInfo className="size-5"/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    align="center"
                    className="text-xs max-w-[350px]"
                  >
                    maximum number of days in advance that a guest must book a
                    room before the check-in date.
                  </TooltipContent>
                </Tooltip>
              </div>
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
                      maxAdvancedBookingController.field.value &&
                        "text-muted-foreground",
                    )}
                  >
                    <HiOutlineCalendar className="size-4" />
                    {maxAdvancedBookingController.field.value ? (
                      format(
                        maxAdvancedBookingController.field.value,
                        "LLL dd, y",
                      )
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
                    // initialFocus
                    selected={maxAdvancedBookingController.field.value as any}
                    mode="single"
                    onSelect={(r: any) => {
                      maxAdvancedBookingController.field.onChange(r.toString());
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {errors?.maxAdvancedBooking ? (
                <InlineAlert type="error">
                  {errors.maxAdvancedBooking.message}
                </InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-col col-span-2 w-full gap-2">
              <Label>Age restriction</Label>
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  setValue("ageRestriction", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select age restriction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adults">Adults only</SelectItem>
                  <SelectItem value="adults_children">
                    Both adults and children
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors?.ageRestriction ? (
                <InlineAlert type="error">
                  {errors.ageRestriction.message}
                </InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-col col-span-2 w-full gap-2">
              <div className="flex items-center justify-between">
              <Label>Factor rate calculator</Label>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="link"
                      type="button"
                      aria-label="Refresh Articles Analytics"
                      className="size-8"
                    >
                      <MdOutlineInfo className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    align="center"
                    className="text-xs max-w-[350px]"
                  >
                    shows the strategy used by the rate calculator to determine the final price 
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  setValue("factorRateCalculator", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select factor rate calculator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PER_GUEST_PER_DAY">
                    Per guest per night
                  </SelectItem>
                  <SelectItem value="PER_ACC_PER_DAY">
                    Per accommodation per night
                  </SelectItem>
                  <SelectItem value="PER_ACC">Per accommodation</SelectItem>
                </SelectContent>
              </Select>
              {errors?.factorRateCalculator ? (
                <InlineAlert type="error">
                  {errors.factorRateCalculator.message}
                </InlineAlert>
              ) : null}
            </div>
            <div className="flex flex-row items-center col-span-2 lg:col-span-1 w-full gap-2">
              <Switch
                disabled={disabled}
                checked={watch("taxIncluded")}
                onCheckedChange={(value) => {
                  setValue("taxIncluded", value);
                }}
              />
              <Label>Tax included</Label>
            </div>
            {watch("taxIncluded") && (
              <div className="flex flex-col col-span-2 w-full gap-2">
                <Label>Select tax</Label>
                <Select
                  disabled={disabled}
                  onValueChange={(value) => {
                    setValue("selectedTax", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select tax to include" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxes.map((tax) => (
                      <SelectItem
                        key={tax.id}
                        value={tax.id}
                      >
                        {tax.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col col-span-2 w-full gap-2">
              <Label>Policies (optional)</Label>
              <PolicyManager
                setValue={setValue}
                control={control}
              />
            </div>
          </TooltipProvider>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default CreateRate_Restrictions_Section;
