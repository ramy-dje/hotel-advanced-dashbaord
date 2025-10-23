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
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  UpdateFeesValidationSchema,
  UpdateFeesValidationSchemaType,
} from "./update-fees.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_update_fee } from "@/lib/curd/fees";
import toast from "react-hot-toast";
import useFeesStore from "../../store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeInterface } from "@/interfaces/fees.interface";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: { name: string; id: string, type: FeeInterface['type'], amount: number } | null;
}

export default function UpdateFeePopup({
  data,
  open,
  setOpen,
}: Props) {
  const { update_fee } = useFeesStore();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateFeesValidationSchemaType>({
    resolver: zodResolver(UpdateFeesValidationSchema),
    defaultValues: {
      name: data?.name || "",
      type: data?.type || "" as any,
      amount: data?.amount || 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [oldTaxType, setOldTaxType] = useState(data?.type || "");

  const handleUpdate = async (
    newdata: UpdateFeesValidationSchemaType
  ) => {
    if (!data?.name || !data?.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_fee(data.id, newdata.name, newdata.type as any, newdata.amount);
      // update the category in the store
      if (res) {
        update_fee(res.id, res);
      }
      setOpen(false);
      // resting the form
      reset({ name: "", type: "percentage", amount: 0 });
      // adding a toast
      toast.success("Fee Updated Successful");
    } catch (err) {
      if (err == 409) {
        setError("The fee name is used before ,please try other one");
      } else {
        setError("Something went wrong ,please try again");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // update the state
    if (data) {
      // setting the name
      setValue("name", data.name);
      // setting the type
      setValue("type", data.type);
      // setting the amount
      setValue("amount", data.amount);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="max-h-[28em]"
        onEscapeKeyDown={
          isLoading
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
      >
        {" "}
        <div className="w-full h-full">
          <form
            onSubmit={handleSubmit(handleUpdate as any)}
            spellCheck={false}
            className="h-full flex flex-col gap-6  justify-between"
          >
            <DialogHeader>
              <DialogTitle>Edit Fee</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Fee name</Label>
                <Input
                  disabled={isLoading}
                  id="name"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                {errors?.name ? (
                  <InlineAlert type="error">{errors.name.message}</InlineAlert>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Fee type</Label>
                <Select
                  disabled={isLoading}
                  value={watch('type')}
                  onValueChange={(value) => {
                    setValue("type", value as FeeInterface['type']);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.type ? (
                  <InlineAlert type="error">{errors.type.message}</InlineAlert>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Fee amount</Label>
                <Input
                  type="number"
                  min={0}
                  max={watch("type") === "percentage" ? 100 : undefined}
                  disabled={isLoading}
                  id="amount"
                  placeholder="Amount"
                  {...register("amount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors?.amount ? (
                  <InlineAlert type="error">{errors.amount.message}</InlineAlert>
                ) : null}
              </div>
              {/* the creation error  */}
              {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
            </div>

            {/* the footer */}
            <DialogFooter className="justify-end">
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
                className="w-[8.5em]"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
