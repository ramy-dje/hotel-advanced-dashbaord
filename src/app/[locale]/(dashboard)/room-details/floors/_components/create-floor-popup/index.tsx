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
  CreateFloorValidationSchema,
  CreateFloorValidationSchemaType,
} from "./create-floor.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import { crud_create_floors } from "@/lib/curd/floors";
import useFloorsStore from "../../store";

interface Props {}

export default function CreateFloorPopup() {
  // floors store hook
  const { add_floor } = useFloorsStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateFloorValidationSchemaType>({
    resolver: zodResolver(CreateFloorValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateFloorValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_floors(data);
      // add the new floor to the store
      if (res) {
        add_floor(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "", level: 0, range_end: 0, range_start: 0 });
      // adding a toast
      toast.success("Floor Created Successful");
    } catch (err) {
      if (err == 409) {
        setError("The level is used before ,please try other one");
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
          <HiOutlinePlus className="size-4" /> Add Floor
        </Button>
      </DialogTrigger>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="max-h-[24em]"
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
              <DialogTitle>Create New Floor</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex items-start gap-2">
                <div className="w-full grid gap-2">
                  <Label htmlFor="name">Floor name</Label>
                  <Input
                    disabled={isLoading}
                    id="name"
                    placeholder="Include Name"
                    {...register("name", { required: true })}
                  />
                  {errors?.name ? (
                    <InlineAlert type="error">
                      {errors.name.message}
                    </InlineAlert>
                  ) : null}
                </div>
                <div className="w-full grid gap-2">
                  <Label htmlFor="level">Floor Level</Label>
                  <Input
                    disabled={isLoading}
                    id="level"
                    type="number"
                    min={0}
                    defaultValue={0}
                    placeholder="Level"
                    {...register("level", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.level ? (
                    <InlineAlert type="error">
                      {errors.level.message}
                    </InlineAlert>
                  ) : null}
                </div>
              </div>
              <div className="w-full flex items-start gap-2">
                <div className="w-full grid gap-2">
                  <Label htmlFor="range-start">Range Start</Label>
                  <Input
                    disabled={isLoading}
                    type="number"
                    min={0}
                    defaultValue={0}
                    id="range-start"
                    placeholder="Start"
                    {...register("range_start", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.range_start ? (
                    <InlineAlert type="error">
                      {errors.range_start.message}
                    </InlineAlert>
                  ) : null}
                </div>
                <div className="w-full grid gap-2">
                  <Label htmlFor="range-end">Range End</Label>
                  <Input
                    disabled={isLoading}
                    type="number"
                    min={0}
                    defaultValue={0}
                    id="range-end"
                    placeholder="Start"
                    {...register("range_end", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.range_end ? (
                    <InlineAlert type="error">
                      {errors.range_end.message}
                    </InlineAlert>
                  ) : null}
                </div>
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
