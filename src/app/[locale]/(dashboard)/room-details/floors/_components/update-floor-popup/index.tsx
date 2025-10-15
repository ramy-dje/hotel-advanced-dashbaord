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
  UpdateFloorValidationSchema,
  UpdateFloorValidationSchemaType,
} from "./update-floor.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import { crud_update_floors } from "@/lib/curd/floors";
import useFloorsStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: (UpdateFloorValidationSchemaType & { id: string }) | null;
}

export default function UpdateFloorPopup({ data, open, setOpen }: Props) {
  // floors store hook
  const { update_floor } = useFloorsStore();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateFloorValidationSchemaType>({
    resolver: zodResolver(UpdateFloorValidationSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (newData: UpdateFloorValidationSchemaType) => {
    if (!data) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_floors(data.id, newData);
      // update the floor in store
      if (res) {
        update_floor(res.id, res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "", level: 0, range_end: 0, range_start: 0 });
      // adding a toast
      toast.success("Floor Updated Successful");
    } catch (err) {
      if (err == 409) {
        setError("The level is used before ,please try other one");
      } else {
        setError("Something went wrong ,please try again");
      }
    }
    setIsLoading(false);
  };

  // setting the from
  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("level", data.level);
      setValue("range_end", data.range_end);
      setValue("range_start", data.range_start);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            onSubmit={handleSubmit(handleUpdate)}
            className="h-full flex flex-col gap-6 justify-between"
          >
            <DialogHeader>
              <DialogTitle>Edit New Floor</DialogTitle>
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
                    id="range-end"
                    min={0}
                    defaultValue={0}
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
