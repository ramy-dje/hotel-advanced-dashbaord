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
import { useForm } from "react-hook-form";
import {
  UpdateFoodTypeValidationSchema,
  UpdateFoodTypeValidationSchemaType,
} from "./update-food-type.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_update_food_type } from "@/lib/curd/food-type";
import toast from "react-hot-toast";
import useFoodTypesStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: { name: string; id: string } | null;
}

export default function UpdateFoodTypePopup({ data, open, setOpen }: Props) {
  // food types store hook
  const { update_type } = useFoodTypesStore();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateFoodTypeValidationSchemaType>({
    resolver: zodResolver(UpdateFoodTypeValidationSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (newdata: UpdateFoodTypeValidationSchemaType) => {
    if (!data?.name || !data?.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_food_type(data.id, newdata.name);
      // update the type in the store
      if (res) {
        update_type(res.id, res);
      }
      setOpen(false);
      // resting the form
      reset({ name: "" });
      // adding a toast
      toast.success("Type Updated Successful");
    } catch (err) {
      if (err == 409) {
        setError("The type name is used before ,please try other one");
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
            onSubmit={handleSubmit(handleUpdate)}
            spellCheck={false}
            className="h-full flex flex-col gap-6  justify-between"
          >
            <DialogHeader>
              <DialogTitle>Edit Type</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Type name</Label>
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
