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
import { useController, useForm } from "react-hook-form";
import { HiOutlinePlus, HiPlusCircle } from "react-icons/hi";
import {
  CreateRoomFeatureValidationSchema,
  CreateRoomFeatureValidationSchemaType,
} from "./create-room-feature.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import AppIconSelect from "@/components/app-icon-select";
import { AppIconComponent } from "@/components/app-icon/icons";
import { crud_create_roomFeature } from "@/lib/curd/room-features";
import useRoomFeaturesStore from "../../store";

interface Props {}

export default function CreateRoomFeaturePopup() {
  // room features store hook
  const { add_feature } = useRoomFeaturesStore();

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateRoomFeatureValidationSchemaType>({
    resolver: zodResolver(CreateRoomFeatureValidationSchema),
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // the icon form controller
  const { field: IconField } = useController({
    control,
    name: "icon",
    defaultValue: "",
  });

  const handleCreate = async (data: CreateRoomFeatureValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_roomFeature({
        icon: data.icon,
        name: data.name,
      });
      // add the new feature to the store
      if (res) {
        add_feature(res);
      }
      // closing the dialog
      setOpen(false);
      // resting the form
      reset({ name: "", icon: "" });
      // adding a toast
      toast.success("Feature Was Created Successful");
    } catch (err) {
      setError("Something went wrong ,please try again");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Feature
        </Button>
      </DialogTrigger>
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
            onSubmit={handleSubmit(handleCreate)}
            className="h-full flex flex-col gap-4 justify-between"
          >
            <DialogHeader>
              <DialogTitle>Create New Room Feature</DialogTitle>
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
                      <Label htmlFor="name">Feature name</Label>
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
