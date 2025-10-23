"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { useController, useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const UpdateOffers_Maximum_Discount_Uses_Section = () => {
  const {
    formState: { errors, disabled },
    setValue,
    register,
    watch,
  } = useFormContext<UpdateOffersValidationSchemaType>();

  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Maximum discount uses</h1>
        <br />
        <div className="flex flex-row col-span-2 w-full gap-2 ">
          <Checkbox
            id="hasMaxUsage"
            checked={watch("discount.hasMaxUsage")}
            onCheckedChange={(checked: boolean) =>
              setValue("discount.hasMaxUsage", checked)
            }
          />
          <Label htmlFor="hasMaxUsage">
            Limit number of times this discount can be used in total
          </Label>
        </div>
        {watch("discount.hasMaxUsage") && (
          <Input
            type="number"
            min={0}
            disabled={disabled}
            placeholder="Set the limit of usage in total"
            {...register("discount.maxUsage", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        )}
        <div className="flex flex-row col-span-2 w-full gap-2 ">
          <Checkbox
            id="isOnePerUser"
            disabled={disabled}
            checked={watch("discount.isOnePerUser")}
            onCheckedChange={(checked: boolean) =>
              setValue("discount.isOnePerUser", checked)
            }
          />
          <Label htmlFor="isOnePerUser">Limit to one use per customer</Label>
        </div>
        <div className="flex flex-col col-span-2 w-full gap-2 ">
          <Label htmlFor="yieldStatus">Yield status</Label>
          <Select
            disabled={disabled}
            defaultValue={
              watch("isRefundable") ? "refundable" : "nonRefundable"
            }
            onValueChange={(value) => {
              setValue("isRefundable", value === "refundable");
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
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffers_Maximum_Discount_Uses_Section;
