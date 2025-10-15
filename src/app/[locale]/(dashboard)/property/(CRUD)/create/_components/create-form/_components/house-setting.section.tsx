"use client";

import React, { forwardRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoTitle,
  CreationFormSectionInfoDescription,
} from "@/components/creation-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Search Parameters Subsection
export const SearchParametersSection = ({ id }: { id: string }) => {
  const { register } = useFormContext();

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Search Parameters</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Define filters and limits for customer search queries
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {/* Days in Advance */}
        <div className="space-y-2">
          <Label>Days in Advance</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              min={0} 
              {...register("houseSettings.houseSearchParams.daysAdvance.value", { valueAsNumber: true })} 
              placeholder="e.g., 30" 
            />
            <Select {...register("houseSettings.houseSearchParams.daysAdvance.unit")}>
              <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Max Date in Future */}
        <div className="space-y-2">
          <Label>Max Future Date</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              min={0} 
              {...register("houseSettings.houseSearchParams.maxFuture.value", { valueAsNumber: true })} 
              placeholder="e.g., 365" 
            />
            <Select {...register("houseSettings.houseSearchParams.maxFuture.unit")}>
              <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nights */}
        <div className="space-y-2">
          <Label>Min Nights</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 1"
            {...register("houseSettings.houseSearchParams.minNights", { valueAsNumber: true })} 
          />
        </div>
        <div className="space-y-2">
          <Label>Max Nights</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 14"
            {...register("houseSettings.houseSearchParams.maxNights", { valueAsNumber: true })} 
          />
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label>Min Rooms</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 1"
            {...register("houseSettings.houseSearchParams.minRooms", { valueAsNumber: true })} 
          />
        </div>
        <div className="space-y-2">
          <Label>Max Rooms</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 5"
            {...register("houseSettings.houseSearchParams.maxRooms", { valueAsNumber: true })} 
          />
        </div>

        {/* Adults */}
        <div className="space-y-2">
          <Label>Adults From</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 1"
            {...register("houseSettings.houseSearchParams.adultsFrom", { valueAsNumber: true })} 
          />
        </div>
        <div className="space-y-2">
          <Label>Adults To</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 10"
            {...register("houseSettings.houseSearchParams.adultsTo", { valueAsNumber: true })} 
          />
        </div>

        {/* Children */}
        <div className="space-y-2">
          <Label>Children From</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 0"
            {...register("houseSettings.houseSearchParams.childrenFrom", { valueAsNumber: true })} 
          />
        </div>
        <div className="space-y-2">
          <Label>Children To</Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="e.g., 5"
            {...register("houseSettings.houseSearchParams.childrenTo", { valueAsNumber: true })} 
          />
        </div>

        {/* Closing Dates */}
        <div className="space-y-2">
          <Label>Closing Date From</Label>
          <Input 
            type="date" 
            {...register("houseSettings.houseSearchParams.closingFrom")} 
            placeholder="Select start date"
          />
        </div>
        <div className="space-y-2">
          <Label>Closing Date To</Label>
          <Input 
            type="date" 
            {...register("houseSettings.houseSearchParams.closingTo")} 
            placeholder="Select end date"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Closing Reason</Label>
          <Input 
            {...register("houseSettings.houseSearchParams.closingReason")} 
            placeholder="e.g., Annual maintenance" 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Closing Types</Label>
          <Select {...register("houseSettings.houseSearchParams.closingTypes")}>
            <SelectTrigger><SelectValue placeholder="Select closure types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="holidays">Holidays</SelectItem>
              <SelectItem value="private">Private Events</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Modification Mode */}
        <div className="space-y-2 md:col-span-2">
          <Label>Modification Mode</Label>
          <Select {...register("houseSettings.houseSearchParams.modificationMode")}>
            <SelectTrigger><SelectValue placeholder="Select modification policy" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="disabled_request">Disabled with Request</SelectItem>
              <SelectItem value="mod_no_cancel">Modification Disabled, Cancellation Enabled</SelectItem>
              <SelectItem value="cancel_no_mod">Cancellation Enabled, Modification Disabled</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};
