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
  CreateRoomTypeValidationSchema,
  CreateRoomTypeValidationSchemaType,
} from "./create-room-type.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_create_roomType } from "@/lib/curd/room-types";
import toast from "react-hot-toast";
import useRoomTypesStore from "../../store";

interface Props {}

export default function CreateRoomTypePopup() {
  // room types store hook
  const { add_type } = useRoomTypesStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateRoomTypeValidationSchemaType>({
    resolver: zodResolver(CreateRoomTypeValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateRoomTypeValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_roomType({ name: data.name });
      // add the new type to the store
      if (res) {
        add_type(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "" });
      // adding a toast
      toast.success("Type Was Created Successful");
    } catch (err) {
      setError("Something went wrong ,please try again");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Type
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
              <DialogTitle>Create New Room Type</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Type name</Label>
                <Input
                  disabled={isLoading}
                  id="name"
                  placeholder="Type Name"
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
