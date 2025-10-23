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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import {
  CreateTaxesValidationSchemaType,
  CreateTaxesValidationSchema,
} from "./create-taxes.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_create_tax } from "@/lib/curd/taxes";
import toast from "react-hot-toast";
import useTaxesStore from "../../store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaxInterface } from "@/interfaces/taxes.interface";

export default function CreateTaxPopup() {
  const { add_tax } = useTaxesStore();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaxesValidationSchemaType>({
    resolver: zodResolver(CreateTaxesValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateTaxesValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_tax(data.name, data.type as any, data.amount);
      // add the new category to the store
      if (res) {
        add_tax(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "" });
      // adding a toast
      toast.success("Tax created Successful");
    } catch (err) {
      if (err == 409) {
        setError("The tax name is used before ,please try other one");
      } else {
        setError("Something went wrong ,please try again");
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> Add Tax
        </Button>
      </DialogTrigger>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
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
            spellCheck={false}
            onSubmit={handleSubmit(handleCreate)}
            className="h-full flex flex-col gap-6 justify-between"
          >
            <DialogHeader>
              <DialogTitle>Create New Tax</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Tax name</Label>
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
                <Label htmlFor="type">Tax type</Label>
                <Select
                  disabled={isLoading}
                  value={watch("type")}
                  onValueChange={(value) => {
                    setValue("type", value as TaxInterface['type']);
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
                <Label htmlFor="amount">Tax amount</Label>
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
                className="w-[6em]"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
