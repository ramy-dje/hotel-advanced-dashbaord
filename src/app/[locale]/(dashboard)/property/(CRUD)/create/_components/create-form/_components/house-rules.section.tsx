"use client";
import { forwardRef } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form"; // Import Controller
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Reusable FieldArray Component (no changes needed here)
export const FieldArraySection = ({
  title,
  description,
  fields,
  append,
  remove,
  namePrefix,
  placeholders,
  className = "",
}: {
  title: string;
  description: string;
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  namePrefix: string;
  placeholders: string[];
  className?: string;
}) => {
  const { register } = useFormContext();

  return (
    <CreationFormSection className={`border-b pb-6 ${className}`}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>{title}</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          {description}
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {fields.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No items added yet.
          </p>
        ) : (
          <div className="space-y-4 flex flex-col col-span-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-3 items-start col-span-2">
                {placeholders.map((placeholder, i) => (
                  <Input
                    key={i}
                    className="flex-1"
                    placeholder={placeholder}
                    {...register(`${namePrefix}.${idx}.${i === 0 ? "key" : "value"}`)}
                  />
                ))}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(idx)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex justify-end items-center mb-4 w-full">
              <Button size="sm" onClick={() => append({ key: "", value: "" })}>
                Add Item
              </Button>
            </div>
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// General Rules Subsection
export const GeneralRulesSection = ({ id }: { id: string }) => {
  const { register, control } = useFormContext();
  const smokingAllowed = useWatch({ name: "houseRules.smokingAllowed", control });

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>General Rules</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Basic property rules and policies
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        <div className="space-y-2">
          <Label>Check-in Time</Label>
          <Input
            type="time"
            {...register("houseRules.checkInTime")}
            placeholder="14:00 (2 PM)"
          />
        </div>

        <div className="space-y-2">
          <Label>Check-out Time</Label>
          <Input
            type="time"
            {...register("houseRules.checkOutTime")}
            placeholder="11:00 (11 AM)"
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Occupancy (per unit)</Label>
          <Input
            type="number"
            min={1}
            placeholder="e.g., 4 guests"
            {...register("houseRules.maxOccupancy", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Rooms per Booking</Label>
          <Input
            type="number"
            min={1}
            placeholder="e.g., 2 rooms"
            {...register("houseRules.maxRoomsPerBooking", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label>Minimum Stay (nights)</Label>
          <Input
            type="number"
            min={1}
            placeholder="e.g., 2 nights minimum"
            {...register("houseRules.minStay", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Quiet Hours</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="time"
              {...register("houseRules.quietHours.start")}
              placeholder="22:00 (10 PM)"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="time"
              {...register("houseRules.quietHours.end")}
              placeholder="08:00 (8 AM)"
            />
          </div>
        </div>

        {/* --- FIX: Switch for No Parties/Events Allowed using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.noParties"
            control={control}
            render={({ field }) => (
              <Switch
                id="noParties"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="noParties">No Parties/Events Allowed</Label>
        </div>

        {/* --- FIX: Switch for Smoking Allowed using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.smokingAllowed"
            control={control}
            render={({ field }) => (
              <Switch
                id="smokingAllowed"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="smokingAllowed">Smoking Allowed</Label>
        </div>

        {smokingAllowed && (
          <div className="space-y-2 md:col-span-2">
            <Label>Designated Smoking Areas</Label>
            <Input
              {...register("houseRules.smokingAreas")}
              placeholder="e.g., Outdoor balcony only"
            />
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// Pets & Visitors Subsection
export const PetsVisitorsSection = ({ id }: { id: string }) => {
  const { register, control } = useFormContext();
  const petsAllowed = useWatch({ name: "houseRules.petsAllowed", control });
  const visitorsAllowed = useWatch({ name: "houseRules.visitorsAllowed", control });

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Pets & Visitors</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Policies regarding pets and guest visitors
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {/* --- FIX: Switch for Pets Allowed using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.petsAllowed"
            control={control}
            render={({ field }) => (
              <Switch
                id="petsAllowed"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="petsAllowed">Pets Allowed</Label>
        </div>

        {petsAllowed && (
          <div className="space-y-2 md:col-span-2">
            <Label>Pet Conditions</Label>
            <Textarea
              {...register("houseRules.petConditions")}
              placeholder="e.g., Maximum 2 pets under 25 lbs, €15/day fee, must be leashed in common areas"
              rows={3}
            />
          </div>
        )}

        {/* --- FIX: Switch for Visitors Allowed using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.visitorsAllowed"
            control={control}
            render={({ field }) => (
              <Switch
                id="visitorsAllowed"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="visitorsAllowed">Visitors Allowed</Label>
        </div>

        {visitorsAllowed && (
          <div className="space-y-2">
            <Label>Visitor Hours</Label>
            <Input
              {...register("houseRules.visitorHours")}
              placeholder="e.g., 9:00 AM - 8:00 PM"
            />
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// Cleanliness Subsection
export const CleanlinessSection = ({ id }: { id: string }) => {
  const { register, control } = useFormContext(); // Destructure control

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Cleanliness & Maintenance
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Expectations for property upkeep and guest responsibilities
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        <div className="space-y-2">
          <Label>Guest Responsibilities</Label>
          <Textarea
            {...register("houseRules.guestResponsibilities")}
            placeholder="e.g., Wash dishes before leaving, take out trash, leave towels in bathroom"
            rows={3}
          />
        </div>

        {/* --- ADDITION: Select for Cleaning Fee with options --- */}
        <div className="space-y-2">
          <Label>Cleaning Fee</Label>
          <Controller
            name="houseRules.cleaningFee"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cleaning fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage of Booking</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* --- FIX: Switch for Report Damages using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.reportDamages"
            control={control}
            render={({ field }) => (
              <Switch
                id="reportDamages"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="reportDamages">Report Damages Immediately</Label>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// Utilities Subsection (no changes needed here as it only uses Input/Textarea)
export const UtilitiesSection = ({ id }: { id: string }) => {
  const { register } = useFormContext();

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Usage Guidelines</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Guidelines for using property utilities and amenities
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        <div className="space-y-2">
          <Label>Wi-Fi Guidelines</Label>
          <Textarea
            {...register("houseRules.wifiGuidelines")}
            placeholder="e.g., No illegal downloads, fair usage policy (max 5GB/day)"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Appliance Rules</Label>
          <Textarea
            {...register("houseRules.applianceRules")}
            placeholder="e.g., Turn off oven after use, no laundry after 10 PM, dishwasher tablets provided"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Shared Space Rules</Label>
          <Textarea
            {...register("houseRules.sharedSpaceRules")}
            placeholder="e.g., Clean after use in kitchen, respect quiet hours in common areas"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Climate Control Rules</Label>
          <Textarea
            {...register("houseRules.climateControlRules")}
            placeholder="e.g., Keep windows closed when AC is on, heating max 22°C in winter"
            rows={2}
          />
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// Security Subsection
export const SecuritySection = ({ id }: { id: string }) => {
  const { register, control } = useFormContext(); // Destructure control

  return (
    <CreationFormSection id={id} className="border-b pb-6">
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Security</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Property access and security protocols
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        <div className="space-y-2">
          <Label>Key/Access Instructions</Label>
          <Textarea
            {...register("houseRules.accessInstructions")}
            placeholder="e.g., Code #1234 for front door, keys in lockbox #5 under mat"
            rows={2}
          />
        </div>

        {/* --- ADDITION: Select for Locking Policy with options --- */}
        <div className="space-y-2">
          <Label>Locking Policy</Label>
          <Controller
            name="houseRules.lockingPolicy"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select locking policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* --- FIX: Switch for No Unauthorized Access using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.noUnauthorizedAccess"
            control={control}
            render={({ field }) => (
              <Switch
                id="noUnauthorizedAccess"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="noUnauthorizedAccess">Unauthorized Access Prohibited</Label>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

// Family & Children Subsection
export const FamilyChildrenSection = ({ id }: { id: string }) => {
  const { register, control } = useFormContext();
  const childFriendly = useWatch({ name: "houseRules.childFriendly", control });

  return (
    <CreationFormSection id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Family & Children</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Policies and accommodations for families with children
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {/* --- FIX: Switch for Suitable for Children using Controller --- */}
        <div className="flex items-center gap-3">
          <Controller
            name="houseRules.childFriendly"
            control={control}
            render={({ field }) => (
              <Switch
                id="childFriendly"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="childFriendly">Suitable for Children</Label>
        </div>

        {childFriendly && (
          <div className="space-y-2">
            <Label>Age Restrictions</Label>
            <Input
              {...register("houseRules.childAgeRestrictions")}
              placeholder="e.g., Children must be 5+ years"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Baby Equipment Provided</Label>
          <Textarea
            {...register("houseRules.babyEquipment")}
            placeholder="e.g., Crib, high chair, baby monitor, outlet covers"
            rows={2}
          />
        </div>

        {/* --- ADDITION: Select for Childproofing Level with options --- */}
        <div className="space-y-2">
          <Label>Childproofing Level</Label>
          <Controller
            name="houseRules.childproofing"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select childproofing level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};