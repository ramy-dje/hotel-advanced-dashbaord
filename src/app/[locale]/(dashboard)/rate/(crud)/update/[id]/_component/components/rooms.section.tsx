"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateRateValidationSchemaType } from "../updateRateDetailsValidation.schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";

// Create rate categories and tags Section

interface Props {
  id: string;
  formData: {
    categories: RatePlanCategoryInterface[];
    seasons: RatePlanSeasonInterface[];
  };
}

const UpdateRate_Rooms_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData }, ref) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<UpdateRateValidationSchemaType>();


    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Rooms to attribute
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Assign the rate to specific room types to apply pricing and availability accordingly.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          
          <Button
            variant="default"
          >select rooms</Button>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default UpdateRate_Rooms_Section;
