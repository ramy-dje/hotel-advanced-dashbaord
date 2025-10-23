"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import { useRef, useState } from "react";
import SearchCustomersPopup from "./popups/search-customers.popup";
import SearchCustomersSegmentsPopup from "./popups/search-customers-segments";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
// Create offer Main Info Section

const UpdateOffer_Eligibility_Section = () => {
  const {
    formState: { disabled },
    register,
    watch,
    setValue,
  } = useFormContext<UpdateOffersValidationSchemaType>();
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomersSegments, setSelectedCustomersSegments] = useState(
    [],
  );
  const clientPopupRef = useRef<HTMLButtonElement>(null);
  const segmentPopupRef = useRef<HTMLButtonElement>(null);
  const eligibilityTypes = [
    { value: "allCustomers", label: "All customers" },
    { value: "specificCustomers", label: "Specific customers" },
    { value: "specificCustomerSegments", label: "Specific customer segments" },
  ];
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Eligibility</h1>
        <br />
        <RadioGroup
          value={watch("eligibility.type")}
          onValueChange={(e) => setValue("eligibility.type", e)}
        >
          {eligibilityTypes.map((type, i) => (
            <div
              className="flex items-center space-x-2"
              key={i}
            >
              <RadioGroupItem
                value={type.value}
                id={type.value}
              />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {watch("eligibility.type") === "specificCustomers" && (
          <div className="flex flex-row col-span-2 w-full gap-4">
            <Input
              type="text"
              disabled={disabled}

              placeholder="Search for specific customers"
            />
            <SearchCustomersPopup
              ref={clientPopupRef}
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
            />
          </div>
        )}
        {watch("eligibility.type") === "specificCustomerSegments" && (
          <div className="flex flex-row col-span-2 w-full gap-4">
            <Input
              type="text"
              disabled={disabled}
       
              placeholder="Search for specific customers segments"
            />
            <SearchCustomersSegmentsPopup
              ref={segmentPopupRef}
              selectedCustomersSegments={selectedCustomersSegments}
              setSelectedCustomersSegments={setSelectedCustomersSegments}
            />
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffer_Eligibility_Section;
