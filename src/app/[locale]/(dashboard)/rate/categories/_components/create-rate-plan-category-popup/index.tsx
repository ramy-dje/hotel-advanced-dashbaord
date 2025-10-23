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
  CreateRatePlanCategoryValidationSchemaType,
  CreateRatePlanCategoryValidationSchema,
} from "./create-rate-plan-category.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_create_rate_category } from "@/lib/curd/rate-category";
import toast from "react-hot-toast";
import useRatePlanCategoriesStore from "../../store";

export default function CreateRatePlanCategoryPopup() {
  const { add_category } = useRatePlanCategoriesStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateRatePlanCategoryValidationSchemaType>({
    resolver: zodResolver(CreateRatePlanCategoryValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateRatePlanCategoryValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_rate_category(data.name);
      // add the new category to the store
      if (res) {
        add_category(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "" });
      // adding a toast
      toast.success("Category created Successful");
    } catch (err) {
      if (err == 409) {
        setError("The category name is used before ,please try other one");
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
          <HiOutlinePlus className="size-4" /> Create Category
        </Button>
      </DialogTrigger>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="max-h-[16em]"
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
              <DialogTitle>Create New Rate Category</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Category name</Label>
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
                type="button"
                onClick={handleSubmit(handleCreate as any)}
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
