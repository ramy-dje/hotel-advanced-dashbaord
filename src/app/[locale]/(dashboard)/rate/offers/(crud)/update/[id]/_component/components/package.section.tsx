"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import InlineAlert from "@/components/ui/inline-alert";
import { useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
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
import SearchServicesPopup from "./popups/search-services.popup";
import { Checkbox } from "@/components/ui/checkbox";

const UpdateOffers_Package_Section = () => {
  const {
    formState: { errors, disabled },
    register,
    setValue,
    watch,
  } = useFormContext<UpdateOffersValidationSchemaType>();
  useEffect(() => {
    setValue("package.taxIncluded", false);
  }, []);
  const ref = useRef<HTMLButtonElement>(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Package</h1>
        <br />
        <div className="flex flex-row col-span-2 w-full gap-4 w-full ">
          <div>
            <Label>Quantity</Label>
           <Input
              type="number"
              min={0}
              disabled={disabled}
              {...register(`package.items.${0}.quantity`, {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </div>
          <div className="w-full">
            <Label>Any items from</Label>
            <Select
              onValueChange={(value) => {
                setValue(`package.items.${0}.type`, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nights">Nights</SelectItem>
                <SelectItem value="rooms">Rooms</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {watch(`package.items.${0}.type`) !== "services" ? (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search rooms</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
              placeholder="Search for specific room "
              onClick={() => ref.current?.click()}
            />
            <SearchRoomsPopup
              ref={ref}
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
            />
          </div>

          {errors?.discount?.amount ? (
            <InlineAlert type="error">
              {errors.discount.amount.message}
            </InlineAlert>
          ) : null}
        </div>) : (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search services</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
              placeholder="Search for specific service "
              onClick={() => ref.current?.click()}
            />
            <SearchServicesPopup
              ref={ref}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          </div>

          {errors?.discount?.amount ? (
            <InlineAlert type="error">
              {errors.discount.amount.message}
            </InlineAlert>
          ) : null}
        </div>
        )}
        <div className="flex flex-col col-span-2  w-full gap-2">
          <Label>Cost type</Label>
          <Select
            disabled={disabled}
            value={watch(`package.costType`)}
            onValueChange={(value) => {
              setValue(`package.costType`, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cost type" />
            </SelectTrigger>
            <SelectContent>
              {["Per night", "Total"].map((n) => (
                <SelectItem
                  key={n}
                  value={n}
                >
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.package?.costType ? (
            <InlineAlert type="error">
              {errors.package?.costType?.message}
            </InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-col col-span-2  w-full gap-2">
          <Label>Cost </Label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            {...register("package.costValue", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            placeholder="Set the cost amount"
          />
          {errors?.package?.costValue ? (
            <InlineAlert type="error">
              {errors.package.costValue.message}
            </InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-col col-span-2  w-full gap-2">
          <Label>Cost per</Label>
          <Select
            disabled={disabled}
            value={watch(`package.costPer`)}
            onValueChange={(value) => {
              setValue(`package.costPer`, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cost per" />
            </SelectTrigger>
            <SelectContent>
              {["Person", "Total guests"].map((n) => (
                <SelectItem
                  key={n}
                  value={n}
                >
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.package?.costPer ? (
            <InlineAlert type="error">
              {errors.package.costPer.message}
            </InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-row items-center col-span-2 lg:col-span-1  w-full gap-4">
          <Checkbox
            disabled={disabled}
            id="includeTaxes"
            checked={watch("package.taxIncluded")}
            onCheckedChange={(checked: boolean) =>
              setValue("package.taxIncluded", checked)
            }
          />
          <Label htmlFor="includeTaxes">Include taxes</Label>
        </div>
        {watch("package.taxIncluded") && (
          <div className="flex flex-col col-span-2  w-full gap-2">
            <Label>Tax percentage</Label>
           <Input
              type="number"
              min={0}
              disabled={disabled}
              {...register("package.taxSelected", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              placeholder="Set the tax percentage "
            />
              {errors?.package?.taxSelected ? (
              <InlineAlert type="error">
                {errors.package.taxSelected.message}
              </InlineAlert>
            ) : null}
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffers_Package_Section;
