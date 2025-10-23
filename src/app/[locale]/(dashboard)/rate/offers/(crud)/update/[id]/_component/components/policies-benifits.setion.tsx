"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
} from "@/components/creation-form";
import { useFormContext } from "react-hook-form";
import { UpdateOffersValidationSchemaType } from "../updateOffersValidation.schema";
import PolicyManager from "@/app/[locale]/(dashboard)/_components/policies";

const UpdateOffer_Policies_Benifits_Section = () => {
  const {
    formState: { errors, disabled, isSubmitted },
    register,
    setValue,
    watch,
    control,
  } = useFormContext<UpdateOffersValidationSchemaType>();

  return (
    <CreationFormSection>
      <CreationFormSectionContent className="overflow-x-auto xl:col-span-full p-3 shadow-md border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Policies & Benifits</h1>
        <br />
        <div className="flex flex-col col-span-2 w-full gap-2">
          <PolicyManager
            setValue={setValue}
            control={control}
          />
        </div>

        {/* offer description */}
        {/*<div className="flex flex-col col-span-2 w-full gap-2">
          <Label htmlFor="benefits">Benefits</Label>
          <Textarea
            id="benefits"
            placeholder="benefits"
            rows={8}
            {...register("benefits")}
          />
          {errors?.benefits ? (
            <InlineAlert type="error">{errors.benefits.message}</InlineAlert>
          ) : null}
        </div>*/}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default UpdateOffer_Policies_Benifits_Section;
