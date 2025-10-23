"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import {
  CreateRateSeasonValidationSchemaType,
  CreateRateSeasonValidationSchema,
} from "./create-rate-season.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_create_rate_season } from "@/lib/curd/rate-season";
import toast from "react-hot-toast";
import useRateSeasonStore from "../../store";
import { CreateRatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { generateCode } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { RiSparkling2Fill } from "react-icons/ri";
import PeriodCard from "@/app/[locale]/(dashboard)/_components/season/periodCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export default function CreateRateSeasonPopup() {
  const { add_season } = useRateSeasonStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm<CreateRateSeasonValidationSchemaType>({
    resolver: zodResolver(CreateRateSeasonValidationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateRatePlanSeasonInterface) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_rate_season(data);
      if (res) {
        add_season(res);
        setOpen(false);
        reset({ name: "" });
        toast.success("Season created successfully");
      }
    } catch (err) {
      if (err == 409) {
        setError("The season name is used before, please try another one.");
      } else {
        setError("Something went wrong, please try again.");
      }
    }
    setIsLoading(false);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "periods",
  });

  const seasonPeriods = useWatch({
    control,
    name: "periods",
  });

  const [dateError, setDateError] = useState<{ [key: string]: string }>({});
  const [seasonOverlapError, setSeasonOverlapError] = useState<string | null>(
    null,
  );

  const validateSeasonPeriods = useCallback(() => {
    if (!seasonPeriods || seasonPeriods.length === 0) return true;

    let hasOverlap = false;
    const newDateErrors: { [key: string]: string } = {};
    setSeasonOverlapError(null);
    setDateError({});

    seasonPeriods.forEach((period, index) => {
      const beginDate = new Date(period.beginSellDate);
      const endDate = new Date(period.endSellDate);

      if (beginDate > endDate) {
        newDateErrors[`periods.${index}`] =
          "Begin date must be before or equal to end date";
        hasOverlap = true;
      }

      if (!period.weekdays || period.weekdays.length === 0) {
        newDateErrors[`periods.${index}.weekdays`] =
          "At least one weekday must be selected";
        hasOverlap = true;
      }

      for (let i = 0; i < seasonPeriods.length; i++) {
        if (i !== index) {
          const otherBegin = new Date(seasonPeriods[i].beginSellDate);
          const otherEnd = new Date(seasonPeriods[i].endSellDate);
          if (beginDate <= otherEnd && otherBegin <= endDate) {
            newDateErrors[
              `periods.${index}`
            ] = `This period overlaps with period ${i + 1}`;
            hasOverlap = true;
            break;
          }
        }
      }
    });

    setDateError(newDateErrors);
    if (hasOverlap) {
      setSeasonOverlapError(
        "Some periods are invalid or overlap. Please fix them before continuing.",
      );
    }

    return !hasOverlap;
  }, [seasonPeriods]);
  useEffect(() => {
    setValue("repeatType", "never");
  }, [])
  useEffect(() => {
    validateSeasonPeriods();
    console.log("seasonPeriods");
  }, [seasonPeriods, validateSeasonPeriods]);

  const addNewPeriod = () => {
    append({
      beginSellDate: new Date(),
      endSellDate: new Date(),
      weekdays: [],
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> Create Season
        </Button>
      </DialogTrigger>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        crud_dialog_size
        onEscapeKeyDown={isLoading ? (e) => e.preventDefault() : undefined}
        className="max-h-[90vh] overflow-auto"
      >
        <form
          spellCheck={false}
          onSubmit={handleSubmit((data) => {
            if (validateSeasonPeriods()) {
              handleCreate(data as any);
            }
          })}
          className="h-full flex flex-col justify-between"
        >
          <DialogHeader>
            <DialogTitle>Create New Rate Season</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Season name</Label>
              <Input
                disabled={isLoading}
                id="name"
                placeholder="Name"
                {...register("name")}
              />
              {errors?.name && (
                <InlineAlert type="error">{errors.name.message}</InlineAlert>
              )}
            </div>

            {/* Code */}
            <div className="grid gap-2">
              <Label htmlFor="code">Season Code</Label>
              <Input
                disabled={isLoading}
                id="code"
                placeholder="Code"
                {...register("code")}
              />
              <div className="flex justify-end">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    const generatedCode = generateCode(watch("name"));
                    setValue("code", generatedCode);
                  }}
                  className="text-sm underline text-primary"
                >
                  <RiSparkling2Fill /> Generate code
                </Button>
              </div>
              {errors?.code && (
                <InlineAlert type="error">{errors.code.message}</InlineAlert>
              )}
            </div>

            {/* Property ID */}
            <div className="grid gap-2">
              <Label htmlFor="propertyId">Properties</Label>
              <Input
                disabled={isLoading}
                id="propertyId"
                placeholder="Properties"
                {...register("propertyId")}
              />
              {errors?.propertyId && (
                <InlineAlert type="error">
                  {errors.propertyId.message}
                </InlineAlert>
              )}
            </div>

            {/* Repeat */}
            <div className="flex flex-col gap-2">
              <Label>Repeat</Label>
              <RadioGroup
                defaultValue="never"
                value={watch("repeatType")}
                onValueChange={(e) => setValue("repeatType", e)}
              >
                {["never", "annually"].map((type, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={type}
                      id={type}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors?.repeatType && (
                <InlineAlert type="error">
                  {errors.repeatType.message}
                </InlineAlert>
              )}
            </div>

            {/* Active */}
            <div className="flex flex-row gap-2 items-center">
              <Switch
                checked={watch("isActive")}
                onCheckedChange={(e) => setValue("isActive", e)}
              />
              <Label>Active</Label>
            </div>

            {/* Periods */}
            <Label>Periods</Label>
            {fields.length > 0 &&
              fields.map((field, index) => {
                const weekdays = watch(`periods.${index}.weekdays`) || [];
                const toggleWeekday = (day: string) => {
                  const updated  = weekdays.includes(day as any)
                    ? weekdays.filter((d: string) => d !== day)
                    : [...weekdays, day];
                  setValue(`periods.${index}.weekdays`, updated as any, {
                    shouldValidate: true,
                  });
                };

                return (
                  <PeriodCard
                    key={field.id}
                    field={field}
                    index={index}
                    register={register}
                    errors={errors}
                    validateSeasonPeriods={validateSeasonPeriods}
                    dateError={dateError}
                    remove={remove}
                    toggleWeekday={toggleWeekday}
                    weekdays={weekdays}
                    setValue={setValue}
                    watch={watch}
                  />
                );
              })}

            <Button
              type="button"
              onClick={addNewPeriod}
              className="mt-4 w-full"
              disabled={seasonOverlapError !== null}
            >
              {fields.length > 0 ? "Add another period" : "Add period"}
            </Button>
            {error && <InlineAlert type="error">{error}</InlineAlert>}
          </div>

          <DialogFooter className="justify-end pt-4">
            <DialogClose asChild>
              <Button
                className="w-[6em]"
                disabled={isLoading}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-[6em]"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
