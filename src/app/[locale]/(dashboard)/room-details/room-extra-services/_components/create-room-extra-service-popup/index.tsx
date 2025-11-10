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
import { FormProvider, useController, useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import {
  CreateRoomExtraServiceValidationSchema,
  CreateRoomExtraServiceValidationSchemaType,
} from "./create-room-extra-service.schema";
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import AppIconSelect from "@/components/app-icon-select";
import { AppIconComponent } from "@/components/app-icon/icons";
import { crud_create_roomExtraService } from "@/lib/curd/room-extra-services";
import useRoomExtraServicesStore from "../../store";
import BasicInformations from "./components/basic-informations";
import Pricing from "./components/pricing";
import ServiceProvider from "./components/service-provider";
import DisplaySettings from "./components/display-settings";
import { UploadFile } from "@/lib/storage";

export default function CreateRoomExtraServicePopup() {
  const { add_extra_service } = useRoomExtraServicesStore();

  const methods = useForm<CreateRoomExtraServiceValidationSchemaType>({
    resolver: zodResolver(CreateRoomExtraServiceValidationSchema),
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const { field: IconField } = useController({
    control,
    name: "icon",
    defaultValue: "",
  });

  const steps = [
    { label: "Basic Information", Component: BasicInformations },
    { label: "Pricing", Component: Pricing },
    { label: "Service Provider", Component: ServiceProvider },
    { label: "Display Settings", Component: DisplaySettings },
  ];

  const CurrentStepComponent = steps[step].Component;

  const handleCreate = async (
    data: CreateRoomExtraServiceValidationSchemaType,
  ) => {
    setIsLoading(true);
    setError("")
    let public_url = "";
    if (data.image) {
      public_url = await UploadFile(data.image, "service-image");
    }
    try {
      const res = await crud_create_roomExtraService({
        ...data,
        image: public_url,
      });

      if (res) {
        add_extra_service(res);
        setOpen(false);
        toast.success("Service was created successfully");
        setStep(0);
      }
    } catch (err) {
      setError("Something went wrong, please try again");
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setStep(0);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Extra Service
        </Button>
      </DialogTrigger>

      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="min-w-[40em] max-h-[34em] overflow-y-auto rounded-xl"
        onEscapeKeyDown={isLoading ? (e) => e.preventDefault() : undefined}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleCreate)}
            className="flex flex-col gap-4 h-full"
            spellCheck={false}
          >
            <DialogHeader>
              <DialogTitle>Create New Room Extra Service</DialogTitle>
            </DialogHeader>

            {/* Current Step Component */}
            <CurrentStepComponent />

            {/* Global errors */}
            {errors?.icon && (
              <InlineAlert type="error">{errors.icon.message}</InlineAlert>
            )}
            {error && <InlineAlert type="error">{error}</InlineAlert>}

            <DialogFooter className="mt-4 flex flex-row justify-between w-full items-center">
              <div className="flex items-center justify-start space-x-2 text-sm w-full">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-1"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        i <= step ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                    {i === step && (
                      <span className="text-muted-foreground">
                        {s.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  {/* Cancel */}
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  {/* Next or Submit */}

                  <Button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={isLoading}
                    className={`${step < steps.length - 1 ? "" : "hidden"}`}
                  >
                    Next
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className={`${step == steps.length - 1 ? "" : "hidden"}`}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
