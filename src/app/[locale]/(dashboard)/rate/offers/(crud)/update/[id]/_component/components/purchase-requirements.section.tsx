"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

const UpdateRate_PurchaseRequirements_Section = () => {
  const {
    formState: { errors, disabled, isSubmitted },
    register,
    watch,
    setValue,
  } = useFormContext<UpdateOffersValidationSchemaType>();
  console.log(errors);
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="overflow-x-auto xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Minimum purchase requirements</h1>
        <br />
        <RadioGroup
          defaultValue="no_requirements"
          value={watch("requirements.type")}
          onValueChange={(e) => setValue("requirements.type", e)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={"no_requirements"}
              id={"no_requirements"}
            />
            <Label htmlFor={"no_requirements"}>No Minimum requirements</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={"purchase_amount"}
              id={"purchase_amount"}
            />
            <Label htmlFor={"purchase_amount"}>Minimum purchase amount</Label>
          </div>
          {watch("requirements.type") === "purchase_amount" && (
           <Input
              type="number"
              min={0}
              placeholder="Set the minimum purchase amount"
              disabled={disabled}
              {...register("requirements.minPurchaseAmount", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="mt-1 mb-2"
            />
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={"quantity_amount"}
              id={"quantity_amount"}
            />
            <Label htmlFor={"quantity_amount"}>Minimum quantity of items</Label>
          </div>
          {watch("requirements.type") === "quantity_amount" && (
           <Input
              type="number"
              min={0}
              placeholder="Set the minimum quantity of items"
              disabled={disabled}
              {...register("requirements.minTotalSpend", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="mt-1 mb-2"
            />
          )}
        </RadioGroup>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateRate_PurchaseRequirements_Section;
