import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CreateRoomExtraServiceValidationSchemaType } from "../create-room-extra-service.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoomExtraServicesStore from "../../../store";
import { X } from "lucide-react";

function ServiceProvider() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateRoomExtraServiceValidationSchemaType>();

  const { existingEmployees } = useRoomExtraServicesStore();

  // Watch selected providers (array of ids)
  const selectedIds = watch("service_providers") || [];

  const handleSelect = (value: string) => {
    if (!selectedIds.includes(value)) {
      const updated = [...selectedIds, value];
      setValue("service_providers", updated);
    }
  };

  const handleRemove = (id: string) => {
    const updated = selectedIds.filter((item) => item !== id);
    setValue("service_providers", updated);
  };

  const selectedProviders = existingEmployees.filter((emp) =>
    selectedIds.includes(emp.id),
  );

  return (
    <div className="space-y-3">
      <Label>Service providers (optional)</Label>

      {/* Select box for choosing providers */}
      <Select onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select service provider">
            {selectedProviders.length > 0
              ? `${
                  selectedProviders[selectedProviders.length - 1].personalInfo
                    .firstName
                } ${
                  selectedProviders[selectedProviders.length - 1].personalInfo
                    .lastName
                }`
              : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {existingEmployees.map((item) => (
            <SelectItem
              key={item.id}
              value={item.id}
            >
              <div className="flex flex-col">
                <span className="font-semibold">
                  {item.personalInfo.firstName} {item.personalInfo.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.work.occupation}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected provider list */}
      <div className="mt-2 space-y-2 min-h-[100px]">
      <Label>Selected Providers</Label>
        {selectedProviders.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {selectedProviders.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-primary transition hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                {item.personalInfo.pic ? (
                  <img
                    src={item.personalInfo.pic}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white text-primary font-bold flex items-center justify-center border-2 border-primary shadow-sm">
                    {item.personalInfo.firstName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-semibold text-gray-800">
                    {item.personalInfo.firstName} {item.personalInfo.lastName}
                  </span>
                  <span className="text-xs text-gray-600">
                    {item.work.occupation}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-1 right-1 text-red-400 hover:text-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceProvider;
