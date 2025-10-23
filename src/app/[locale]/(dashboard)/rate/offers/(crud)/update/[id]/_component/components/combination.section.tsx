"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const UpdateOffers_Combination_Section = () => {
  const {
    formState: { disabled },
    setValue,
    register,
    watch,
  } = useFormContext<UpdateOffersValidationSchemaType>();
  function handleCheckboxChange(value: string) {
    const prev = watch("combinations") || [];
    if (prev.includes(value)) {
      setValue(
        "combinations",
        prev.filter((item) => item !== value),
      );
    } else {
      setValue("combinations", [...prev, value]);
    }
  }
  const combinationList = [
    { value: "product_discounts", label: "Product discounts" },
    { value: "order_discounts", label: "Order discounts" },
    { value: "buy_x_get_y", label: "Buy X get Y" },
  ];
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Combinations</h1>
        <br />
        <div className="flex flex-col col-span-2 w-full gap-2 ">
          {combinationList.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2"
            >
              <Checkbox
                value={item.value}
                checked={watch("combinations")?.includes(item.value)}
                onCheckedChange={(checked) => handleCheckboxChange(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffers_Combination_Section;
