"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import InlineAlert from "@/components/ui/inline-alert";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateOffersValidationSchemaType } from "../createOffersValidation.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchRoomsPopup from "./popups/search-rooms.popup";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";

const CreateOffers_Discount_Value_Section = () => {
  const {
    formState: { errors, disabled },
    setValue,
    register,
    watch
  } = useFormContext<CreateOffersValidationSchemaType>();
  const roomPopupRef = useRef<HTMLButtonElement>(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Discount value</h1>
        <br />
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2 ">
          <Label htmlFor="isActive">Discount type</Label>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              setValue("discount.type", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {["Percentage", "Fixed amount"].map((type) => (
                <SelectItem
                  key={type}
                  value={type.toLowerCase()}
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.discount?.type ? (
            <InlineAlert type="error">
              {errors.discount?.message}
            </InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2 ">
          <Label>Discount amount</Label>
          <Input
            type="number"
            min={0}
            max={watch("discount.type") === "percentage" ? 100 : undefined}
            disabled={disabled}
            placeholder="Set the discount amount"
            {...register("discount.amount", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors?.discount?.amount ? (
            <InlineAlert type="error">
              {errors.discount.amount?.message}
            </InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-col col-span-2 w-full gap-2 ">
          <Label>Applies to</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              disabled={disabled}
              placeholder="Search for specific room "
              onChange={(e) => {
                roomPopupRef.current?.click();
              }}
            />
            <SearchRoomsPopup
              ref={roomPopupRef}
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
            />
          </div>

          {errors?.discount?.eligibleRooms ? (
            <InlineAlert type="error">
              {errors.discount.eligibleRooms?.message}
            </InlineAlert>
          ) : null}
          <div className="flex gap-2">
            {selectedRooms.map((room: any, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-full gap-2 text-sm font-normal "
              >
                {room.name}
                <HiOutlineX
                  className="ml-2 cursor-pointer"
                  onClick={() =>
                    setSelectedRooms(
                      selectedRooms.filter((r: any) => r.name !== room.name),
                    )
                  }
                />
              </Badge>
            ))}
          </div>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateOffers_Discount_Value_Section;
