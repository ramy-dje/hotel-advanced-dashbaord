"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { CreateOffersValidationSchemaType } from "../createOffersValidation.schema";
import { useRef, useState } from "react";
import SearchCustomersPopup from "./popups/search-customers.popup";
import SearchCustomersSegmentsPopup from "./popups/search-customers-segments";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
// Create offer Main Info Section

const CreateOffer_Eligibility_Section = () => {
  const {
    formState: { errors, disabled, isSubmitSuccessful },
    register,
    watch,
    setValue,
  } = useFormContext<CreateOffersValidationSchemaType>();
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomersSegments, setSelectedCustomersSegments] = useState(
    [],
  );
  const clientPopupRef = useRef<HTMLButtonElement>(null);
  const segmentPopupRef = useRef<HTMLButtonElement>(null);
  const eligibilityTypes = [
    { value: "allCustomers", label: "All customers" },
    { value: "specificCustomerSegments", label: "Specific customer segments" },
    { value: "specificCustomers", label: "Specific customers" },
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
              {...register("eligibility.clients")}
              placeholder="Search for specific customers"
              onClick={() => clientPopupRef.current?.click()}
            />
            <SearchCustomersPopup
              ref={clientPopupRef}
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
            />
          </div>
        )}
        {watch("eligibility.type") === "specificCustomers" &&
          selectedCustomers.length > 0 && (
            <div className="flex flex-row col-span-2 w-full gap-4">
              {selectedCustomers.map((customer : any, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal "
                >
                  {customer.name}
                  <HiOutlineX
                    className="ml-2 cursor-pointer"
                    onClick={() =>
                      setSelectedCustomers(
                        selectedCustomers.filter(
                          (c: any) => c.name !== customer.name,
                        ),
                      )
                    }
                  />
                </Badge>
              ))}
            </div>
          )}
        {watch("eligibility.type") === "specificCustomerSegments" && (
          <div className="flex flex-row col-span-2 w-full gap-4">
            <Input
              type="text"
              disabled={disabled}
              {...register("eligibility.clients")}
              placeholder="Search for specific customers segments"
              onClick={() => segmentPopupRef.current?.click()}
            />
            <SearchCustomersSegmentsPopup
              ref={segmentPopupRef}
              selectedCustomersSegments={selectedCustomersSegments}
              setSelectedCustomersSegments={setSelectedCustomersSegments}
            />
          </div>
        )}
        {watch("eligibility.type") === "specificCustomerSegments" &&
          selectedCustomersSegments.length > 0 && (
            <div className="flex flex-row col-span-2 w-full gap-4">
              {selectedCustomersSegments.map((segment: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal "
                >
                  {segment.name}
                  <HiOutlineX
                    className="ml-2 cursor-pointer"
                    onClick={() =>
                      setSelectedCustomersSegments(
                        selectedCustomersSegments.filter(
                          (s: any) => s.name !== segment.name,
                        ),
                      )
                    }
                  />
                </Badge>
              ))}
            </div>
          )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateOffer_Eligibility_Section;
