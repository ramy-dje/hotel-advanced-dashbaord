"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateSimpleId } from "@/lib/utils";

// Create Room Pricing Section

interface Props {
  id: string;
}

const CreateRoom_Pricing_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      register,
      formState: { errors, disabled },
      setError,
      control,
    } = useFormContext<CreateRoomValidationSchemaType>();

    const [pricingList, setPricingList] = useState<
      {
        from: Date | undefined;
        to: Date | undefined;
        price: number;
        id: string;
      }[]
    >([
      {
        from: new Date(Date.now()),
        to: undefined,
        price: 0,
        id: generateSimpleId(),
      },
    ]);

    // price controller
    const price_controller = useController({
      control,
      name: "price",
      defaultValue: [],
    });

    // update the pricing controller
    useEffect(() => {
      if (pricingList) {
        price_controller.field.onChange(
          pricingList.map((p) => ({ ...p, price: Number(p.price) }))
        );
      }
    }, [pricingList]);

    useEffect(() => {}, [price_controller.field.value]);

    // Methods

    // Add price

    const setPriceDate = (id: string, dates?: DateRange) => {
      setPricingList((prices) =>
        prices.map((price) =>
          price.id == id
            ? {
                ...price,
                from: dates?.from,
                to: dates?.to,
              }
            : price
        )
      );
    };

    // set price
    const setPrice = (id: string, newPrice: string | number) => {
      if (isNaN(newPrice as any)) return;
      setPricingList((prices) =>
        prices.map((price) =>
          price.id == id
            ? {
                ...price,
                price: newPrice as number,
              }
            : price
        )
      );
    };

    const handleAddPrice = () => {
      // clear the errors
      setError("price", {});
      // checking the validation
      const isValidPrices = pricingList.every((p) => p.price >= 100);
      const isValidDates = pricingList.every((p) => p.from && p.to);
      // throw error if one of the prices isn't valid
      if (!isValidDates) {
        setError("price", {
          message: "Dates should be valid",
          type: "validate",
        });
        return;
      } else if (!isValidPrices) {
        setError("price", {
          message: "Price should at least 100",
          type: "validate",
        });
        return;
      }
      // add empty price
      const lastDate = new Date(
        pricingList[pricingList.length - 1]!.to as Date
      );
      // add one day
      lastDate.setDate(lastDate.getDate() + 1);

      setPricingList((e) => [
        ...e,
        { from: lastDate, to: undefined, id: generateSimpleId(), price: 0 },
      ]);
    };

    // remove price
    const handleRemovePrice = (id: string) => {
      // clear the errors
      setError("price", {});
      // remove the price
      if (id) {
        setPricingList((e) => e.filter((p) => p.id !== id));
      }
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Pricing</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The pricing of the room in different dates
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* default price */}
          <div className="flex flex-col col-span-full gap-2">
            <Label htmlFor="defaultprice">Default Price</Label>
            <Input
              id="defaultprice"
              min={0}
              defaultValue={0}
              type="number"
              disabled={disabled}
              placeholder="Default Price"
              {...register("default_price", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors?.default_price ? (
              <InlineAlert type="error">
                {errors.default_price.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* pricing list */}
          <>
            {pricingList.map((price) => (
              <div className="col-span-2 md:col-span-full flex flex-col md:flex-row items-start gap-7 mb-2">
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <Label htmlFor={"date" + price.id}>Dates</Label>
                  <Popover>
                    <PopoverTrigger id={"date" + price.id} asChild>
                      <Button
                        id="date"
                        disabled={disabled}
                        type="button"
                        variant={"outline"}
                        className={cn(
                          "w-full gap-2 justify-start text-left font-normal",
                          !price.from && "text-muted-foreground"
                        )}
                      >
                        <HiOutlineCalendar className="size-4" />
                        {price?.from ? (
                          price.to ? (
                            <>
                              <span>{format(price.from, "LLL dd, y")}</span>
                              ---
                              <span>{format(price.to, "LLL dd, y")}</span>
                            </>
                          ) : (
                            format(price.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={{ from: price.from, to: price.to }}
                        onSelect={(range) => setPriceDate(price.id, range)}
                        defaultMonth={price.from}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <Label htmlFor={"price" + price.id}>Price</Label>
                  <Input
                    type="number"
                    id={"price" + price.id}
                    onChange={(e) => setPrice(price.id, e.target.value)}
                    disabled={disabled}
                    value={price.price}
                    className="col-span-4"
                  />
                </div>
                {pricingList.length > 1 ? (
                  <Button
                    onClick={() => handleRemovePrice(price.id)}
                    type="button"
                    variant="secondary"
                    size="icon"
                    disabled={disabled}
                    className="min-w-10 mt-auto"
                  >
                    <HiOutlineTrash className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </>

          <div className="col-span-2 flex justify-end">
            <Button
              onClick={handleAddPrice}
              type="button"
              variant="outline"
              disabled={disabled}
              className="gap-2"
            >
              <HiOutlinePlus className="size-4" />
              Add Price
            </Button>
          </div>

          {/* errors */}
          <div className="col-span-2">
            {errors?.price ? (
              <InlineAlert type="error">{errors.price.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_Pricing_Section;
