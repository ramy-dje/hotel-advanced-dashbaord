import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { HiOutlineCalendar } from "react-icons/hi";

type Props = {
  field: any;
  index: number;
  register: any;
  errors: any;
  validateSeasonPeriods: any;
  dateError: any;
  remove: any;
  toggleWeekday: any;
  weekdays: any;
  setValue: any;
  watch: any;
};

const allWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function periodCard({
  field,
  index,
  register,
  errors,
  validateSeasonPeriods,
  dateError,
  remove,
  toggleWeekday,
  weekdays,
  setValue,
  watch,
}: Props) {
  return (
    <div
      key={field.id}
      className="border p-4 rounded-xl mb-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`periods.${index}.beginSellDate`}>
            Begin sell date
          </Label>
          <Popover>
            <PopoverTrigger
              id="expire"
              asChild
            >
              <Button
                id="date"
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full gap-2 justify-start text-left font-normal",
                  watch(`periods.${index}.beginSellDate`) &&
                    "text-muted-foreground",
                )}
              >
                <HiOutlineCalendar className="size-4" />
                {watch(`periods.${index}.beginSellDate`) ? (
                  format(watch(`periods.${index}.beginSellDate`), "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                // initialFocus
                selected={watch(`periods.${index}.beginSellDate`) as any}
                mode="single"
                onSelect={(r: any) => {
                  validateSeasonPeriods();
                  setValue(`periods.${index}.beginSellDate`, r.toString());
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          {errors?.periods?.[index]?.beginSellDate && (
            <InlineAlert type="error">
              {errors.periods[index].beginSellDate?.message}
            </InlineAlert>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`periods.${index}.endSellDate`}>End sell date</Label>
          <Popover>
            <PopoverTrigger
              id="expire"
              asChild
            >
              <Button
                id="date"
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full gap-2 justify-start text-left font-normal",
                  watch(`periods.${index}.endSellDate`) &&
                    "text-muted-foreground",
                )}
              >
                <HiOutlineCalendar className="size-4" />
                {watch(`periods.${index}.endSellDate`) ? (
                  format(watch(`periods.${index}.endSellDate`), "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                // initialFocus
                selected={watch(`periods.${index}.endSellDate`) as any}
                mode="single"
                onSelect={(r: any) => {
                  validateSeasonPeriods();
                  setValue(`periods.${index}.endSellDate`, r.toString());
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          {(errors?.periods?.[index]?.endSellDate ||
            dateError[`periods.${index}`]) && (
            <InlineAlert type="error">
              {errors?.periods?.[index]?.endSellDate?.message ||
                dateError[`periods.${index}`]}
            </InlineAlert>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <Label>Weekdays</Label>
        <div className="flex w-full">
          {allWeekdays.map((day, i) => {
            const isSelected = weekdays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekday(day)}
                className={`flex-1 py-2 border text-sm font-medium rounded-none first:rounded-l last:rounded-r transition-colors ${
                  isSelected
                    ? "text-white bg-primary border-primary"
                    : "text-gray-700 border-[#e5e7eb]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {errors?.periods?.[index]?.weekdays && (
          <InlineAlert type="error">
            {errors.periods[index].weekdays?.message}
          </InlineAlert>
        )}
      </div>

      <Button
        type="button"
        variant="destructive"
        onClick={() => remove(index)}
        className="w-full"
      >
        Remove Period
      </Button>
    </div>
  );
}

export default periodCard;
