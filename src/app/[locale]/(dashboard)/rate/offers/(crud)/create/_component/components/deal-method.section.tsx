"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useController, useFormContext } from "react-hook-form";
import { CreateOffersValidationSchemaType } from "../createOffersValidation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Button } from "@/components/ui/button";
import { RiSparkling2Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";

const CreateOffer_DealMethod_Section = () => {
  const {
    formState: { errors, disabled },
    register,
    control,
    setValue,
  } = useFormContext<CreateOffersValidationSchemaType>();

  // image controller
  const methodController = useController({
    control,
    name: "method",
  });

  return (
    <CreationFormSection>
      <CreationFormSectionContent className="xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Deal method</h1>
        <br />
        {/* offer code */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="offerCode">Method</Label>
          <div className="flex flex-row w-full">
            <button
              type="button"
              className={cn(
                "w-1/2 h-10 border border-input rounded-l-md",
                methodController.field.value == "code" ? "bg-gray-100" : "",
              )}
              onClick={() => {
                setValue("method", "code");
              }}
            >
              Discount code
            </button>
            <button
              type="button"
              className={cn(
                "w-1/2 h-10 border border-input rounded-r-md",
                methodController.field.value == "auto" ? "bg-gray-100" : "",
              )}
              onClick={() => {
                setValue("method", "auto");
              }}
            >
              Automatic discount
            </button>
          </div>
          {errors?.method ? (
            <InlineAlert type="error">{errors.method.message}</InlineAlert>
          ) : null}
        </div>
        {methodController.field.value == "code" ? (
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="offerCode">Offer code</Label>
            <Input
              id="code"
              type="text"
              disabled={disabled}
              placeholder="Set the offer code"
              {...register("code")}
            />
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">
                Customers must enter this code at checkout.
              </p>
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  const generatedCode: string = Math.floor(
                    1000000 + Math.random() * 9000000,
                  ).toString();
                  setValue("code", generatedCode);
                }}
                className="text-sm cursor-pointer text-end underline text-primary"
              >
                <RiSparkling2Fill /> Generate code
              </Button>
            </div>
            {errors?.code ? (
              <InlineAlert type="error">{errors.code.message}</InlineAlert>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col col-span-2 w-full gap-2">
            {/*<Label htmlFor="name">Deal name</Label>
              <Input
                id="name"
                type="text"
                disabled={disabled}
                placeholder="name"
                {...register("name")}
              />
              <p className="text-xs text-gray-500">
                Customers will see this in their cart and at checkout.
              </p>
              {errors?.name ? (
                <InlineAlert type="error">{errors.name.message}</InlineAlert>
              ) : null}*/}
          </div>
        )}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateOffer_DealMethod_Section;
