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
import { useController, useForm } from "react-hook-form";
import {
  UpdateRoomExtraServiceValidationSchema,
  UpdateRoomExtraServiceValidationSchemaType,
} from "./update-room-extra-service.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import AppIconSelect from "@/components/app-icon-select";
import { AppIconComponent } from "@/components/app-icon/icons";
import { HiPlusCircle } from "react-icons/hi";
import { crud_update_roomExtraService } from "@/lib/curd/room-extra-services";
import toast from "react-hot-toast";
import useRoomExtraServicesStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: (UpdateRoomExtraServiceValidationSchemaType & { id: string }) | null;
}

export default function UpdateRoomExtraServicePopup({
  data,
  open,
  setOpen,
}: Props) {
  // room extra_services store hook
  const { update_extra_service } = useRoomExtraServicesStore();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateRoomExtraServiceValidationSchemaType>({
    resolver: zodResolver(UpdateRoomExtraServiceValidationSchema),
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

  const handleUpdate = async (
    newdata: UpdateRoomExtraServiceValidationSchemaType
  ) => {
    if (!data?.name || !data?.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_roomExtraService(data.id, newdata);
      // update the extra service in store
      if (res) {
        update_extra_service(res.id, res);
      }
      setOpen(false);
      // resting the form
      reset({ name: "", booking_name: "", icon: "", price: 0 });
      // adding a toast
      toast.success("Service Was Updated Successful");
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
      setValue("booking_name", data.booking_name);
      setValue("price", data.price);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="min-w-[40em] max-h-[34em]"
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
              <DialogTitle>Edit Room Extra Service</DialogTitle>
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
                      <Label htmlFor="name">Service name</Label>
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
                  {/* Booking name and price */}
                  <div className="w-full flex items-start gap-2">
                    <div className="w-full grid gap-2">
                      <Label htmlFor="booking-name">Booking name</Label>
                      <Input
                        disabled={isLoading}
                        id="booking-name"
                        placeholder="Name"
                        {...register("booking_name", { required: true })}
                      />
                      {errors?.booking_name ? (
                        <InlineAlert type="error">
                          {errors.booking_name.message}
                        </InlineAlert>
                      ) : null}
                    </div>
                    <div className="w-full grid gap-2">
                      <Label htmlFor="price">Service Price</Label>
                      <Input
                        disabled={isLoading}
                        id="price"
                        type="number"
                        min={0}
                        defaultValue={0}
                        placeholder="Price"
                        {...register("price", {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                      {errors?.price ? (
                        <InlineAlert type="error">
                          {errors.price.message}
                        </InlineAlert>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {/* Icon error */}
              {errors?.icon ? (
                <InlineAlert type="error">{errors.icon.message}</InlineAlert>
              ) : null}
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
