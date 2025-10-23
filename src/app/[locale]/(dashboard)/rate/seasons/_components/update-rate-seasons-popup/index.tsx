"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_update_rate_season } from "@/lib/curd/rate-season";
import toast from "react-hot-toast";
import useRateSeasonsStore from "../../store";
import {
  UpdateRateSeasonValidationSchema,
  UpdateRateSeasonValidationSchemaType,
} from "./update-rate-season.schema";
import PeriodCard from "@/app/[locale]/(dashboard)/_components/season/periodCard";
import { generateCode } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { RiSparkling2Fill } from "react-icons/ri";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: {
    name: string;
    id: string;
    code: string;
    periods: any[];
    propertyId: string;
    repeatType: string;
    isActive: boolean;
  } | null;
}

export default function UpdateRateSeasonPopup({ data, open, setOpen }: Props) {
  const { update_season } = useRateSeasonsStore();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm<UpdateRateSeasonValidationSchemaType>({
    resolver: zodResolver(UpdateRateSeasonValidationSchema),
    defaultValues: {
      name: "",
      code: "",
      periods: [],
      propertyId: "",
      repeatType: "",
      isActive: true,
    },
  });

  const watchedPeriods = useWatch({ control, name: "periods" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "periods",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState<{ [key: string]: string }>({});
  const [seasonOverlapError, setSeasonOverlapError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (data) {
      const newPeriods = data.periods.map((period: any) => ({
        beginSellDate: new Date(period.beginSellDate)
          .toISOString()
          .slice(0, 10),
        endSellDate: new Date(period.endSellDate).toISOString().slice(0, 10),
        weekdays: period.weekdays,
      }));
      reset({
        name: data.name,
        code: data.code,
        periods: newPeriods as any,
        propertyId: data.propertyId,
        repeatType: data.repeatType,
        isActive: data.isActive,
      });
    }
  }, [data]);

  const checkDateOverlap = (
    beginDate1: any,
    endDate1: any,
    beginDate2: any,
    endDate2: any,
  ): boolean => {
    const begin1 = new Date(beginDate1);
    const end1 = new Date(endDate1);
    const begin2 = new Date(beginDate2);
    const end2 = new Date(endDate2);
    return begin1 <= end2 && begin2 <= end1;
  };

  const validateSeasonPeriods = useCallback(() => {
    const newDateErrors: { [key: string]: string } = {};
    setSeasonOverlapError(null);
    setDateError({});

    let hasIssue = false;

    watchedPeriods.forEach((period, i) => {
      const { beginSellDate, endSellDate, weekdays } = period;

      const begin = new Date(beginSellDate);
      const end = new Date(endSellDate);

      if (begin > end) {
        newDateErrors[`periods.${i}`] = "Begin date must be before end date";
        hasIssue = true;
      }

      if (!weekdays || weekdays.length === 0) {
        newDateErrors[`periods.${i}.weekdays`] = "Weekdays must not be empty";
        hasIssue = true;
      }

      for (let j = 0; j < watchedPeriods.length; j++) {
        if (j !== i) {
          const other = watchedPeriods[j];
          const overlap = checkDateOverlap(
            beginSellDate,
            endSellDate ,
            other.beginSellDate,
            other.endSellDate,
          );
          if (overlap) {
            newDateErrors[`periods.${i}`] = `Overlaps with period ${j + 1}`;
            hasIssue = true;
            break;
          }
        }
      }
    });

    setDateError(newDateErrors);
    if (hasIssue) {
      setSeasonOverlapError("There are overlapping or invalid periods.");
    }

    return !hasIssue;
  }, [watchedPeriods]);

  useEffect(() => {
    validateSeasonPeriods();
  }, [watchedPeriods]);

  const addNewPeriod = () => {
    append({
      beginSellDate: new Date(),
      endSellDate: new Date(),
      weekdays: [],
    });
  };

  const handleUpdate = async (
    formData: UpdateRateSeasonValidationSchemaType,
  ) => {
    if (!data?.id) return;

    const isValid = validateSeasonPeriods();
    if (!isValid) return;

    try {
      setIsLoading(true);
      setError("");

      const res = await crud_update_rate_season(data.id, formData as any);

      if (res) update_season(res.id, res);
      setOpen(false);
      toast.success("Season updated successfully");
    } catch (err) {
      if (err == 409) {
        setError("This season name is already used. Try a different one.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        crud_dialog_size
        onEscapeKeyDown={isLoading ? (e) => e.preventDefault() : undefined}
      >
        <form
          spellCheck={false}
          onSubmit={handleSubmit(handleUpdate)}
          className="flex flex-col justify-between h-full"
        >
          <DialogHeader>
            <DialogTitle>Update Rate Season</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Season name</Label>
              <Input
                disabled={isLoading}
                {...register("name")}
              />
              {errors.name && (
                <InlineAlert type="error">{errors.name.message}</InlineAlert>
              )}
            </div>

            {/* Code */}
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                disabled={isLoading}
                {...register("code")}
              />
              <div className="flex justify-end">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    const generated = generateCode(watch("name"));
                    setValue("code", generated);
                  }}
                  className="text-sm underline text-primary"
                >
                  <RiSparkling2Fill /> Generate code
                </Button>
              </div>
              {errors.code && (
                <InlineAlert type="error">{errors.code.message}</InlineAlert>
              )}
            </div>

            {/* Property ID */}
            <div className="grid gap-2">
              <Label htmlFor="propertyId">Property</Label>
              <Input
                disabled={isLoading}
                {...register("propertyId")}
              />
              {errors.propertyId && (
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
              {errors.repeatType && (
                <InlineAlert type="error">
                  {errors.repeatType.message}
                </InlineAlert>
              )}
            </div>

            {/* Active */}
            <div className="flex gap-24 items-center">
              <Label>Active</Label>
              <Switch
                checked={watch("isActive")}
                onCheckedChange={(e) => setValue("isActive", e)}
              />
            </div>

            {/* Periods */}
            <Label>Periods</Label>
            {fields.map((field, index) => {
              const weekdays = watch(`periods.${index}.weekdays`) || [];

              const toggleWeekday = (day: string) => {
                const updated = weekdays.includes(day as any)
                  ? weekdays.filter((d) => d !== day)
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
              + Add Period
            </Button>

            {seasonOverlapError && (
              <InlineAlert type="error">{seasonOverlapError}</InlineAlert>
            )}
            {error && <InlineAlert type="error">{error}</InlineAlert>}
          </div>

          <DialogFooter className="justify-end pt-4">
            <DialogClose asChild>
              <Button
                disabled={isLoading}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
