"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import Image from "next/image";
import { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  CreateRateValidationSchemaType,
} from "../createRateDetailsValidation.schema";
import { IoIosCheckmarkCircle } from "react-icons/io";
import InlineAlert from "@/components/ui/inline-alert";


interface Props {
  id: string;
}

const CreateRate_Meals_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext<CreateRateValidationSchemaType>();

    const mealPlanController = useController({
      control,
      name: "mealPlan",
      defaultValue: [],
    });

    const selectedValues = mealPlanController.field.value || [];

    const isRoomOnlySelected = selectedValues.includes("room only");

    const toggleSelection = (title: string) => {
      let newValue: string[];

      if (title === "room only") {
        // Selecting "room only" clears all other selections
        newValue = isRoomOnlySelected ? [] : [title];
      } else {
        if (isRoomOnlySelected) return; // block interaction when room only is active
        newValue = selectedValues.includes(title)
          ? selectedValues.filter((item) => item !== title)
          : [...selectedValues, title];
      }

      mealPlanController.field.onChange(newValue);
    };

    const carouselInfo = [
      { title: "room only", image: "/meals/room.png" },
      { title: "breakfast", image: "/meals/breakfast.png" },
      { title: "lunch", image: "/meals/lunch.png" },
      { title: "dinner", image: "/meals/dinner.png" },
      { title: "extra meal", image: "/meals/extra.png" },
    ];



    

   
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Meals plan</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Specifies the meals included with the rate, such as breakfast,
            lunch, dinner, or combinations like half-board and full-board.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent className="overflow-x-auto">
          <div className="flex w-full gap-3 col-span-2">
            {carouselInfo.map((item, index) => {
              const isSelected = selectedValues.includes(item.title);
              const isDisabled =
                isRoomOnlySelected && item.title !== "room only";

              return (
                <div
                  key={index}
                  onClick={() => !isDisabled && toggleSelection(item.title)}
                  className={`w-[150px] border hover:border-primary rounded-lg p-4 flex flex-col items-center gap-2 mb-3 relative cursor-pointer transition ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isSelected ? "border-primary border-2" : ""
                  }`}
                >
                  <IoIosCheckmarkCircle 
                    className={`absolute top-2 right-2 size-6 rounded-full ${
                      isSelected ? "text-primary" : "text-transparent"
                    }`}
                  />

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={50}
                    height={50}
                  />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
          {errors?.mealPlan ? (
            <InlineAlert type="error">{errors.mealPlan.message}</InlineAlert>
          ) : null}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRate_Meals_Section;
