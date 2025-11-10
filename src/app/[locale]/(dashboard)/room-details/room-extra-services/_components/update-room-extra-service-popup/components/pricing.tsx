"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useRoomExtraServicesStore from "../../../store";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { UpdateRoomExtraServiceValidationSchemaType } from "../update-room-extra-service.schema";
function Pricing() {
  const {
    formState: { errors, disabled, isLoading },
    setValue,
    register,
    watch,
    control,
  } = useFormContext<UpdateRoomExtraServiceValidationSchemaType>();
  const { existingTaxes } = useRoomExtraServicesStore();
  const [additionalFees, setAdditionalFees] = useState([
    { name: "", price: 0 },
  ]);
  const handleAddFee = () => {
    if (
      additionalFees &&
      additionalFees.filter((fee) => fee.name === "" || fee.price === 0)
        .length > 0
    ) {
      return;
    }
    setAdditionalFees((prev) => {
      return [...prev, { name: "", price: 0 }];
    });
  };
  const handleRemoveFee = (index: number) => {
    const newFees = additionalFees.filter((_, i) => i !== index);
    setValue("additionalFees", newFees);
    setAdditionalFees(newFees);
  };
  const handleFeeChange = (
    index: number,
    field: "name" | "price",
    value: string,
  ) => {
    const newFees = additionalFees.map((fee, i) =>
      i === index
        ? { ...fee, [field]: field === "price" ? Number(value) : value }
        : fee,
    );
    setValue("additionalFees", newFees);
    setAdditionalFees(newFees);
  };
  const oldAdditionalFees = useWatch({
    control,
    name: "additionalFees",
  });
  useEffect(() => {
    if (Array.isArray(oldAdditionalFees) && oldAdditionalFees.length > 0) {
      console.log("Setting additional fees:", oldAdditionalFees);
      setAdditionalFees([...oldAdditionalFees]);
    }
  }, [oldAdditionalFees]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="price">Service availabilty</Label>
        <Select
          value={watch("service_availability")}
          onValueChange={(value) => {
            setValue("service_availability", value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select service availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="always_available">Always available</SelectItem>
            <SelectItem value="scheduled_time">Scheduled time</SelectItem>
            <SelectItem value="on_demand">On demand</SelectItem>
          </SelectContent>
        </Select>
        {errors?.service_availability && (
          <InlineAlert type="error">
            {errors.service_availability.message}
          </InlineAlert>
        )}
      </div>
      {watch("service_availability") === "scheduled_time" && (
        <div className="flex flex-row gap-4">
          <div
            className={`grid grid-cols-1 md:grid-cols-[1fr,auto] items-end   gap-2 w-1/2`}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Minimum lead time</Label>
              <Input
                disabled={isLoading}
                id="price"
                type="number"
                min={0}
                placeholder="Enter minimum lead time"
                {...register("min_lead_time", {
                  required: true,
                  setValueAs: (value) => (value ? Number(value) : 0),
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  setValue("lead_time_unit", value);
                }}
                defaultValue="hours"
                value={watch("lead_time_unit")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">minutes</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                  <SelectItem value="days">days</SelectItem>
                  <SelectItem value="weeks">weeks</SelectItem>
                  <SelectItem value="months">months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors?.min_lead_time && (
              <InlineAlert type="error">
                {errors.min_lead_time.message}
              </InlineAlert>
            )}
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-[1fr,auto] items-end  gap-2 w-1/2`}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Maximum lead time</Label>
              <Input
                disabled={isLoading}
                id="price"
                type="number"
                min={0}
                placeholder="Enter maximum lead time"
                {...register("max_lead_time", {
                  required: true,
                  setValueAs: (value) => (value ? Number(value) : 0),
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  setValue("lead_time_unit", value);
                }}
                defaultValue="hours"
                value={watch("lead_time_unit")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">minutes</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                  <SelectItem value="days">days</SelectItem>
                  <SelectItem value="weeks">weeks</SelectItem>
                  <SelectItem value="months">months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors?.max_lead_time && (
              <InlineAlert type="error">
                {errors.max_lead_time.message}
              </InlineAlert>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="price">Service price type</Label>
        <Select
          value={watch("priceType")}
          onValueChange={(value) => {
            setValue("priceType", value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select price type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed_amount">Fixed amount</SelectItem>
            <SelectItem value="time_based">Time based</SelectItem>
            <SelectItem value="pieces_based">Pieces based</SelectItem>
            <SelectItem value="quote_based">Quote based</SelectItem>
            <SelectItem value="subscription_based">
              Subscription based
            </SelectItem>
          </SelectContent>
        </Select>
        {errors?.priceType && (
          <InlineAlert type="error">{errors.priceType.message}</InlineAlert>
        )}
      </div>
      <div
        className={`grid grid-cols-1 ${
          watch("priceType") === "time_based" && "md:grid-cols-[auto,1fr]"
        } gap-4`}
      >
        {watch("priceType") === "time_based" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Service price type</Label>
            <Select
              value={watch("priceTimeUnit")}
              onValueChange={(value) => {
                setValue("priceTimeUnit", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_minutes">Per minutes</SelectItem>
                <SelectItem value="per_hour">Per hour</SelectItem>
                <SelectItem value="per_day">Per day</SelectItem>
                <SelectItem value="per_week">Per week</SelectItem>
                <SelectItem value="per_month">Per month</SelectItem>
              </SelectContent>
            </Select>
            {errors?.priceTimeUnit && (
              <InlineAlert type="error">
                {errors.priceTimeUnit.message}
              </InlineAlert>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Service Price</Label>
          <Input
            disabled={isLoading}
            id="price"
            type="number"
            min={0}
            placeholder={
              watch("priceType") === "FIXED_AMOUNT"
                ? "Set total price"
                : watch("priceType") === "time_based"
                ? "Set price per time"
                : "Set price per piece"
            }
            {...register("price", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors?.price && (
            <InlineAlert type="error">{errors.price.message}</InlineAlert>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Additional fees</Label>
        {additionalFees.map((fee, index) => (
          <div
            key={index}
            className="flex items-end gap-2 w-full"
          >
            <div className="flex-1">
              <Label className="text-gray-500">Fee name</Label>
              <Input
                disabled={isLoading}
                id="feeName"
                type="text"
                placeholder="Enter fee name"
                value={fee.name}
                onChange={(e) => handleFeeChange(index, "name", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label className="text-gray-500">Fee price</Label>
              <Input
                disabled={isLoading}
                id="feePrice"
                type="number"
                min={0}
                placeholder="Enter fee price"
                value={fee.price}
                onChange={(e) =>
                  handleFeeChange(index, "price", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRemoveFee(index)}
            >
              <HiOutlineTrash className="size-5 text-primary text-center" />
            </Button>
          </div>
        ))}
        <div className="flex items-center justify-end gap-2 ">
          <Button
            type="button"
            variant="outline"
            className="w-fit text-primary"
            onClick={handleAddFee}
          >
            <HiOutlinePlus className="size-3 " />
            <span className="ml-2">Add fee</span>
          </Button>
        </div>
        {errors?.additionalFees && (
          <InlineAlert type="error">
            {errors.additionalFees.message}
          </InlineAlert>
        )}
      </div>
      {/* Tax toggle */}
      <div className="flex items-center justify-between lg:w-1/2 w-full">
        <Label>Tax Included</Label>
        <Switch
          disabled={isLoading}
          checked={watch("taxIncluded")}
          onCheckedChange={(value) => setValue("taxIncluded", value)}
        />
      </div>

      {/* Tax selection */}
      {watch("taxIncluded") && (
        <div className="flex flex-col gap-2">
          <Label>Select Tax</Label>
          <Select
            value={watch("taxSelected")}
            onValueChange={(value) => {
              setValue("taxSelected", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tax to include" />
            </SelectTrigger>
            <SelectContent>
              {existingTaxes &&
                existingTaxes.map((tax) => (
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
    </>
  );
}

export default Pricing;
