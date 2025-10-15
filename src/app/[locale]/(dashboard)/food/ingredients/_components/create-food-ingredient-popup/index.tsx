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
  CreateFoodIngredientValidationSchemaType,
  CreateFoodIngredientValidationSchema,
} from "./create-food-ingredient.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_create_food_ingredient } from "@/lib/curd/food-ingredient";
import toast from "react-hot-toast";
import useFoodIngredientsStore from "../../store";

export default function CreateFoodIngredientPopup() {
  // food ingredients store hook
  const { add_ingredient } = useFoodIngredientsStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateFoodIngredientValidationSchemaType>({
    resolver: zodResolver(CreateFoodIngredientValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (
    data: CreateFoodIngredientValidationSchemaType
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_food_ingredient(data.name);
      // add the new ingredient to the store
      if (res) {
        add_ingredient(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "" });
      // adding a toast
      toast.success("Ingredient was Created Successful");
    } catch (err) {
      if (err == 409) {
        setError("The ingredient name is used before ,please try other one");
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
          <HiOutlinePlus className="size-4" /> New Ingredient
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
              <DialogTitle>Create New Ingredient</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Ingredient name</Label>
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
