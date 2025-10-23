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
import { HiOutlineTrash, HiOutlineX, HiTrash } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { Label } from "@/components/ui/label";
import RatePlanServiceInterface from "@/interfaces/room-extra-services";
import Image from "next/image";
import { AppIconComponent } from "@/components/app-icon/icons";
import { Switch } from "@/components/ui/switch";

interface Props {
  id: string;
  services: RatePlanServiceInterface[];
}

const UpdateRate_ExtraServices_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, services }, ref) => {
    const {
      formState: { errors, disabled },
      watch,
      setValue,
    } = useFormContext<UpdateRateValidationSchemaType>();
    const [selectedServices, setSelectedServices] = useState<
      RatePlanServiceInterface[]
    >([]);
    function removeService(id: string) {
      setSelectedServices((prev) => {
        const res = prev.filter((service) => service.id !== id);
        setValue("selectedServices", res.map((service) => service.id));
        return res;
      });
    }
    function addService(serviceId: string) {
      if (selectedServices.find((service) => service.id === serviceId)) {
        return;
      }
      const service = services.find((service) => service.id === serviceId);
      if (service) {
        setSelectedServices((prev) => {
          const res = [...prev, service];
          setValue("selectedServices", res.map((service) => service.id));
          return res;
        });
      }
    }
    function truncateWords(text: string | undefined, wordLimit: number): string {
      if (!text) return "";
      const words = text.split(" ");
      const truncated = words.slice(0, wordLimit).join(" ");
      return words.length > wordLimit ? `${truncated}...` : truncated;
    }
    useEffect(() => {
      const selectedServicesIds = watch("selectedServices");
      const selectedServices = services.filter((service) =>
        selectedServicesIds?.includes(service.id),
      );
      setSelectedServices(selectedServices);
    }, [watch("selectedServices")]);
    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Extra services
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Assign the rate to specific room types to apply pricing and
            availability accordingly.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="flex flex-col col-span-2  w-full gap-2">
            <Label>Select Extra services</Label>
            <Select
              onValueChange={(value) => addService(value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rate categories" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service, i) => (
                  <SelectItem
                    key={i}
                    value={service.id}
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label>Selected Extra services</Label>
            <div className="flex flex-col gap-1 w-full p-2 rounded-md border border-input min-h-[150px]">
              {selectedServices.map((service, i) => (
                <div
                  key={i}
                  className="border border-input p-2 rounded-md flex items-center justify-between"
                >
                  <div className="flex gap-2">
                    <AppIconComponent
                      name={service.icon}
                      className="w-10 h-10"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">
                        {service.name}
                      </span>
                      <span className={`text-sm text-muted-foreground`}>
                        {truncateWords(service.description, 8)}
                      </span>
                    </div>
                  </div>
                  <HiOutlineTrash
                    className="size-4 text-red-500 cursor-pointer"
                    onClick={() => removeService(service.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default UpdateRate_ExtraServices_Section;
