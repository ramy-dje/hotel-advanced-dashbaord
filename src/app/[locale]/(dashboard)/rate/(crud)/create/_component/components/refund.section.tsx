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
import { forwardRef, useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { crud_get_rate_by_code } from "@/lib/curd/rate";
import { RiSparkling2Fill } from "react-icons/ri";
import CreateRatePlanCategoryPopup from "../../../../categories/_components/create-rate-plan-category-popup";
import { generateCode } from "@/lib/utils";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { Switch } from "@/components/ui/switch";

// Create Rate Main Info Section

interface Props {
  id: string;
}

const CreateRate_Refund_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled, isSubmitSuccessful },
      register,
      control,
      watch,
      setValue,
    } = useFormContext<CreateRateValidationSchemaType>();
    useEffect(() => {
      setValue("yieldStatus", false);
    }, []);
    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Refund Restrictions
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Create your rate by selecting base occupancy, applying restrictions,
            and setting taxes.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="flex flex-col col-span-2 w-full gap-4 ">
            <Label htmlFor="yieldStatus">Yield status</Label>
            <Select
              disabled={disabled}
              value={watch("yieldStatus") ? "refundable" : "nonRefundable"}
              onValueChange={(value) => {
                setValue("yieldStatus", value === "refundable");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select yield status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refundable">Refundable</SelectItem>
                <SelectItem value="nonRefundable">Non Refundable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {watch("yieldStatus") && (<>
            <div className="flex flex-col col-span-2 w-full gap-4 ">
              <Label>Maximum refund days before arrival</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                placeholder="set the maximum number of days that client can get a refund before arrival"
                {...register("refundBeforeArrival", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </div>
            <div className="flex flex-col col-span-2 w-full gap-4 ">
              <Label htmlFor="yieldStatus">Refund type</Label>
              <Select
                disabled={disabled}
                value={watch("refundType")}
                onValueChange={(value) => {
                  setValue("refundType", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select yield status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Refund</SelectItem>
                  <SelectItem value="partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {watch("refundType") === "partial" && (
              <div className="flex flex-col col-span-2 w-full gap-4 ">
                <Label>Partial refund amount</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  disabled={disabled}
                  placeholder="Enter partial refund amount"
                  {...register("partialRefundAmount", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
              </div>
            )}
          </>)}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default CreateRate_Refund_Section;
