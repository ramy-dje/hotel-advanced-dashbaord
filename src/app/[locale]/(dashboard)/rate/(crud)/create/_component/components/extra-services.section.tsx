"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateRateValidationSchemaType } from "../createRateDetailsValidation.schema";
import { HiOutlineTrash } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import RatePlanServiceInterface from "@/interfaces/room-extra-services";
import { AppIconComponent } from "@/components/app-icon/icons";
import { MdOutlineLibraryAdd } from "react-icons/md";
import InlineAlert from "@/components/ui/inline-alert";

interface Props {
  id: string;
  services: RatePlanServiceInterface[];
}

const CreateRate_ExtraServices_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, services }, ref) => {
    const {
      formState: { errors, disabled },
      watch,
      setValue,
    } = useFormContext<CreateRateValidationSchemaType>();
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
    function truncateWords(
      text: string | undefined,
      wordLimit: number,
    ): string {
      if (!text) return "";
      const words = text.split(" ");
      const truncated = words.slice(0, wordLimit).join(" ");
      return words.length > wordLimit ? `${truncated}...` : truncated;
    }
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
            Assign extra services that are bundled with this rate.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="flex flex-col col-span-2  w-full gap-2">
            <Label>Select Extra services (optional)</Label>
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
            {
              errors.selectedServices && errors.selectedServices[0] && (
                <InlineAlert type="error">
                  {errors.selectedServices[0].message}
                </InlineAlert>
              )
            }
          </div>
          <div className="flex flex-col col-span-2 w-full gap-3">
            <Label className="text-base font-medium">
              Selected Extra Services
            </Label>

            {selectedServices.length > 0 ? (
              <div className="flex flex-col gap-2 w-full p-4 rounded-lg border border-border bg-muted/50 min-h-[150px]">
                {selectedServices.map((service, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4 p-3 bg-white border border-border rounded-md shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <AppIconComponent
                        name={service.icon}
                        className="w-10 h-10 text-primary"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {service.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {truncateWords(service.description, 8)}
                        </span>
                      </div>
                    </div>

                    <HiOutlineTrash
                      className="size-5 mt-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      onClick={() => removeService(service.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border bg-gray-50 min-h-[150px] text-muted-foreground">
                <MdOutlineLibraryAdd className="size-10" />
                <span className="text-sm font-medium">
                  No extra services selected
                </span>
              </div>
            )}
            
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default CreateRate_ExtraServices_Section;
