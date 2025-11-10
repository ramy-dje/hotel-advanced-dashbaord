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
import {
  FormProvider,
  useController,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  UpdateRoomExtraServiceValidationSchema,
  UpdateRoomExtraServiceValidationSchemaType,
} from "./update-room-extra-service.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { crud_update_roomExtraService } from "@/lib/curd/room-extra-services";
import toast from "react-hot-toast";
import useRoomExtraServicesStore from "../../store";
import BasicInformations from "./components/basic-informations";
import Pricing from "./components/pricing";
import ServiceProvider from "./components/service-provider";
import DisplaySettings from "./components/display-settings";
import { UploadFile } from "@/lib/storage";

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

  const methods = useForm<UpdateRoomExtraServiceValidationSchemaType>({
    resolver: zodResolver(UpdateRoomExtraServiceValidationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // the icon form controller
  const { field: IconField } = useController({
    control: methods.control,
    name: "icon",
    defaultValue: "",
  });

  const handleUpdate = async (
    newdata: UpdateRoomExtraServiceValidationSchemaType,
  ) => {
    if (!data?.name || !data?.id) return;
    setIsLoading(true);
    setError("");
    try {
      let public_url = "";
      if (newdata.image && newdata.image !== data.image) {
        alert("image updated");
        public_url = await UploadFile(newdata.image, "service-image");
      } else {
        public_url = data.image;
      }
      const res = await crud_update_roomExtraService(data.id, {
        ...newdata,
        image: public_url,
      });
      // update the extra service in store
      if (res) {
        update_extra_service(res.id, res);
      }
      setOpen(false);
      // resting the form
      methods.reset({
        name: "",
        icon: "",
        price: 0,
        costFactor: "",
        taxIncluded: false,
        taxSelected: "",
        description: "",
        usageAllowedAreas: [],
        service_availability: "",
        min_lead_time: 0,
        max_lead_time: 0,
        lead_time_unit: "",
        priceType: "",
        priceTimeUnit: "",
        additionalFees: [],
        service_providers: [],
        service_status: false,
        featured_service: false,
        sales_channels: [],
        category: "",
        property_code: "",
        image: "",
        image_url: "",
      });
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
      methods.reset({ ...data, category: data?.category?._id?.toString() || "", image_url: data.image });
    }
  }, [data]);
  const { existingTaxes } = useRoomExtraServicesStore();
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Basic Information", Component: BasicInformations },
    { label: "Pricing", Component: Pricing },
    { label: "Service Provider", Component: ServiceProvider },
    { label: "Display Settings", Component: DisplaySettings },
  ];

  const CurrentStepComponent = steps[step].Component;
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="min-w-[40em] max-h-[34em] overflow-y-auto  rounded-xl"
        onEscapeKeyDown={
          isLoading
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
      >
        {" "}
        <FormProvider {...methods}>
          <form
            spellCheck={false}
            onSubmit={methods.handleSubmit(handleUpdate)}
            className="flex flex-col gap-6 h-full"
          >
            <DialogHeader>
              <DialogTitle>Create New Room Extra Service</DialogTitle>
            </DialogHeader>

            {/* Current Step Component */}
            <CurrentStepComponent />

            {/* Global errors */}
            {methods.formState.errors?.icon && (
              <InlineAlert type="error">
                {methods.formState.errors.icon.message}
              </InlineAlert>
            )}
            {error && <InlineAlert type="error">{error}</InlineAlert>}

            <DialogFooter className="mt-4 flex flex-row justify-between w-full items-center">
              <div className="text-sm text-start text-muted-foreground w-full">
                Step {step + 1} of {steps.length}: {steps[step].label}
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
                    Update
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
