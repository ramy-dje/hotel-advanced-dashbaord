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
import { useController, useForm, useWatch } from "react-hook-form";
import {
  UpdateRoomBedValidationSchema,
  UpdateRoomBedValidationSchemaType,
} from "./update-room-bed.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import AppIconSelect from "@/components/app-icon-select";
import { AppIconComponent } from "@/components/app-icon/icons";
import { HiPlusCircle } from "react-icons/hi";
import { crud_update_roomBed } from "@/lib/curd/room-beds";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoomBedsStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: (UpdateRoomBedValidationSchemaType & { id: string }) | null;
}

export default function UpdateRoomBedPopup({ data, open, setOpen }: Props) {
  // room beds store hook
  const { update_bed } = useRoomBedsStore();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateRoomBedValidationSchemaType>({
    resolver: zodResolver(UpdateRoomBedValidationSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // the icon form controller
  const { field: IconField } = useController({
    control,
    name: "icon",
    defaultValue: "",
  });

  // unite watcher
  const unite = useWatch({
    control,
    name: "unite",
  });

  const handleUpdate = async (newdata: UpdateRoomBedValidationSchemaType) => {
    if (!data?.name || !data?.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_roomBed(data.id, newdata);
      // update the bed in the store
      if (res) {
        update_bed(res.id, res);
      }
      setOpen(false);
      // resting the form
      reset({ name: "", icon: "", height: 0, unite: "cm", width: 0 });
      // adding a toast
      toast.success("Bed Updated Successful");
    } catch (err) {
      setError("Something went wrong ,please try again");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // update the state
    if (data) {
      // setting the form fields
      setValue("name", data.name);
      setValue("icon", data.icon);
      setValue("width", data.width);
      setValue("height", data.height);
      setValue("unite", data.unite);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="w-[28em] max-h-[34em]"
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
            className="h-full flex flex-col gap-4 justify-between"
          >
            <DialogHeader>
              <DialogTitle>Edit Room Bed</DialogTitle>
            </DialogHeader>

            <div className="w-full flex flex-col gap-3">
              <div className="w-full">
                {/* inputs */}
                <div className="flex flex-col gap-2">
                  {/* Icon and Name */}
                  <div className="w-full flex items-start gap-2">
                    <div className="w-auto grid gap-2 ">
                      <Label htmlFor="name">Icon</Label>
                      <AppIconSelect onClick={(n) => IconField.onChange(n)}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-10"
                        >
                          {IconField.value ? (
                            <AppIconComponent
                              name={IconField.value}
                              className="size-6 text-primary fill-primary"
                            />
                          ) : (
                            <HiPlusCircle className="size-4 text-accent-foreground/80" />
                          )}
                        </Button>
                      </AppIconSelect>
                    </div>
                    <div className="w-full grid gap-2">
                      <Label htmlFor="name">Bed name</Label>
                      <Input
                        disabled={isLoading}
                        id="name"
                        placeholder="Name"
                        {...register("name", { required: true })}
                      />
                      {errors?.name ? (
                        <InlineAlert type="error">
                          {errors.name.message}
                        </InlineAlert>
                      ) : null}
                    </div>
                  </div>
                  {/* width & height and unite inputs */}
                  <div className="w-full flex items-start gap-2">
                    {/* width */}
                    <div className="w-full grid gap-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        disabled={isLoading}
                        id="width"
                        type="number"
                        defaultValue={0}
                        min={0}
                        placeholder="Width"
                        {...register("width", {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {/* height */}
                    <div className="w-full grid gap-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        disabled={isLoading}
                        id="height"
                        type="number"
                        defaultValue={0}
                        min={0}
                        placeholder="Height"
                        {...register("height", {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {/* unite */}
                    <div className="w-full grid gap-2">
                      <Label htmlFor="unite">Unite</Label>
                      <Select
                        value={unite}
                        onValueChange={(v) => setValue("unite", v as any)}
                        defaultValue="cm"
                      >
                        <SelectTrigger id="unite" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-[7em]">
                          <SelectItem value="cm" key="cm">
                            CM
                          </SelectItem>
                          <SelectItem value="inch" key="inch">
                            INCH
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {/* height error */}
                {errors?.height ? (
                  <InlineAlert type="error">
                    {errors.height.message}
                  </InlineAlert>
                ) : null}
                {/* width error */}
                {errors?.width ? (
                  <InlineAlert type="error">{errors.width.message}</InlineAlert>
                ) : null}
                {/* Unite error */}
                {errors?.unite ? (
                  <InlineAlert type="error">{errors.unite.message}</InlineAlert>
                ) : null}
                {/* Icon error */}
                {errors?.icon ? (
                  <InlineAlert type="error">{errors.icon.message}</InlineAlert>
                ) : null}
                {/* the creation error  */}
                {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
              </div>
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
