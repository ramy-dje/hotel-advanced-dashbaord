"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import InlineAlert from "@/components/ui/inline-alert";
import { useRef, useState, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";
import { HiOutlineX } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";
import SearchRoomsPopup from "./popups/search-rooms.popup";
import SearchServicesPopup from "./popups/search-services.popup";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";

const CreateOffers_BuyXGetY_Section = () => {
  const {
    formState: { errors, disabled },
    setValue,
    register,
    watch,
    control,
  } = useFormContext<CreateOffersValidationSchemaType>();
  const offerType = useSearchParams().get(
    "offerType",
  ) as CreateOffersValidationSchemaType["type"];
  const [selectedBuyRooms, setSelectedBuyRooms] = useState([]);
  const [selectedBuyServices, setSelectedBuyServices] = useState([]);
  const [selectedGetRooms, setSelectedGetRooms] = useState([]);
  const [selectedGetServices, setSelectedGetServices] = useState([]);
  const refRooms = useRef<HTMLButtonElement>(null);
  const refServices = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setValue("bxgy.type", "quantity");
    setValue("bxgy.discountType", "percentage");
  }, []);
  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Customer buys</h1>
        <br />
        <RadioGroup
          value={watch("bxgy.type")}
          onValueChange={(e) => setValue("bxgy.type", e)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="quantity"
              id="quantitybxgy"
            />
            <Label htmlFor="quantitybxgy">Minimum quantity of items</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="amount"
              id="amountbxgy"
            />
            <Label htmlFor="amountbxgy">Minimum purchase amount</Label>
          </div>
          {errors?.bxgy?.type ? (
            <InlineAlert type="error">
              {errors?.bxgy?.message}
            </InlineAlert>
          ) : null}
        </RadioGroup>

        <div className="flex flex-row col-span-2 w-full gap-4 w-full ">
          <div>
            <Label>Quantity</Label>
           <Input
              type="number"
              min={0}
              disabled={disabled}
              {...register(`bxgy.buyItems.${0}.quantity`, {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </div>
          <div className="w-full">
            <Label>Any items from</Label>
            <Select
              onValueChange={(value) => {
                setValue(`bxgy.buyItems.${0}.itemType`, value);
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
        {watch(`bxgy.buyItems.${0}.itemType`) !== "services" ? (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search rooms</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
                placeholder="Search for specific room "
                onClick={() => refRooms.current?.click()}
              />
              <SearchRoomsPopup
                ref={refRooms}
                selectedRooms={selectedBuyRooms}
                setSelectedRooms={setSelectedBuyRooms}
              />
            </div>

            {errors?.bxgy?.buyItems ? (
              <InlineAlert type="error">
                {errors.bxgy.buyItems.message}
              </InlineAlert>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search services</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
                placeholder="Search for specific service"
                onClick={() => refServices.current?.click()}
              />
              <SearchServicesPopup
                ref={refServices}
                selectedServices={selectedBuyServices}
                setSelectedServices={setSelectedBuyServices}
              />
            </div>

            {errors?.bxgy?.buyItems ? (
              <InlineAlert type="error">
                {errors.bxgy.buyItems.message}
              </InlineAlert>
            ) : null}
          </div>
        )}
        {watch(`bxgy.buyItems.${0}.itemType`) !== "services" &&
          selectedBuyRooms.length > 0 && (
            <div className="flex flex-col col-span-2 w-full gap-2">
              <div className="flex gap-2">
                {selectedBuyRooms.map((room: any, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full gap-2 text-sm font-normal "
                  >
                    {room.name}
                    <HiOutlineX
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        setSelectedBuyRooms(
                          selectedBuyRooms.filter(
                            (r: any) => r.name !== room.name,
                          ),
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        {watch(`bxgy.buyItems.${0}.itemType`) == "services" &&
          selectedBuyServices.length > 0 && (
            <div className="flex flex-col col-span-2 w-full gap-2">
              <div className="flex gap-2">
                {selectedBuyServices.map((service: any, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full gap-2 text-sm font-normal "
                  >
                    {service.name}
                    <HiOutlineX
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        setSelectedBuyServices(
                          selectedBuyServices.filter(
                            (s: any) => s.name !== service.name,
                          ),
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        <hr className="mt-2 col-span-2" />
        <h1 className="text-lg font-semibold">Customer gets</h1>
        <br />
        <p className="text-sm text-gray-500">
          Customers must add the quantity of items specified below to their
          cart.
        </p>
        <div className="flex flex-row col-span-2 w-full gap-4 w-full ">
          <div>
            <Label>Quantity</Label>
           <Input
              type="number"
              min={0}
              disabled={disabled}
              {...register(`bxgy.getItems.${0}.quantity`, {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </div>
          <div className="w-full">
            <Label>Any items from</Label>
            <Select
              value={watch(`bxgy.getItems.${0}.itemType`) || ""}
              onValueChange={(value) =>
                setValue(`bxgy.getItems.${0}.itemType`, value)
              }
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
        {watch(`bxgy.getItems.${0}.itemType`) !== "services" ? (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search rooms</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
                placeholder="search for specific room "
                onClick={() => refRooms.current?.click()}
              />
              <SearchRoomsPopup
                ref={refRooms}
                selectedRooms={selectedGetRooms}
                setSelectedRooms={setSelectedGetRooms}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col col-span-2 w-full gap-2 ">
            <Label>Search services</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
                placeholder="search for specific service"
                onClick={() => refServices.current?.click()}
              />
              <SearchServicesPopup
                ref={refServices}
                selectedServices={selectedGetServices}
                setSelectedServices={setSelectedGetServices}
              />
            </div>
          </div>
        )}

        {errors?.discount?.amount ? (
          <InlineAlert type="error">
            {errors.discount.amount.message}
          </InlineAlert>
        ) : null}
        {watch(`bxgy.getItems.${0}.itemType`) !== "services" &&
          selectedGetRooms.length > 0 && (
            <div className="flex flex-col col-span-2 w-full gap-2">
              <div className="flex gap-2">
                {selectedGetRooms.map((room: any, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full gap-2 text-sm font-normal "
                  >
                    {room.name}
                    <HiOutlineX
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        setSelectedGetRooms(
                          selectedGetRooms.filter(
                            (r: any) => r.name !== room.name,
                          ),
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        {watch(`bxgy.getItems.${0}.itemType`) == "services" &&
          selectedGetServices.length > 0 && (
            <div className="flex flex-col col-span-2 w-full gap-2">
              <div className="flex gap-2">
                {selectedGetServices.map((service: any, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full gap-2 text-sm font-normal "
                  >
                    {service.name}
                    <HiOutlineX
                      className="ml-2 cursor-pointer"
                      onClick={() =>
                        setSelectedGetServices(
                          selectedGetServices.filter(
                            (s: any) => s.name !== service.name,
                          ),
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

        <RadioGroup
          value={watch("bxgy.discountType")}
          onValueChange={(e) => setValue("bxgy.discountType", e)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="percentage"
              id="percentagebxgy"
            />
            <Label htmlFor="percentagebxgy">Percentage</Label>
          </div>
          {watch("bxgy.discountType") === "percentage" && (
           <Input
              type="number"
              min={0}
              placeholder="Enter minimum purchase amount"
              disabled={disabled}
              {...register("bxgy.discountValue", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="mt-1 mb-2"
            />
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="fixed"
              id="fixedbxgy"
            />
            <Label htmlFor="fixedbxgy">Fixed amount</Label>
          </div>
          {watch("bxgy.discountType") === "fixed" && (
            <Input
              type="number"
              min={0}
              placeholder="Enter minimum purchase amount"
              disabled={disabled}
              {...register("bxgy.discountValue", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              className="mt-1 mb-2"
            />
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="free"
              id="freebxgy"
            />
            <Label htmlFor="freebxgy">Free</Label>
          </div>
          {errors?.bxgy?.discountType ? (
            <InlineAlert type="error">
              {errors?.bxgy?.message}
            </InlineAlert>
          ) : null}
        </RadioGroup>
        <hr />
        <div className="flex flex-row col-span-2 w-full gap-2">
          <Checkbox
            disabled={disabled}
            checked={watch("bxgy.hasMaxUsage")}
            onCheckedChange={(e) => setValue("bxgy.hasMaxUsage", e as boolean)}
            id="bxgy.hasMaxUsage"
          />
          <Label htmlFor="bxgy.hasMaxUsage">
            Set a maximum number of uses per order
          </Label>
        </div>
        {watch("bxgy.hasMaxUsage") && (
          <Input
            type="number"
            min={0}
            placeholder="Enter minimum purchase amount"
            disabled={disabled}
            {...register("bxgy.maxUsage", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
        )}
        {errors?.bxgy?.maxUsage ? (
          <InlineAlert type="error">{errors.bxgy.maxUsage.message}</InlineAlert>
        ) : null}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateOffers_BuyXGetY_Section;
