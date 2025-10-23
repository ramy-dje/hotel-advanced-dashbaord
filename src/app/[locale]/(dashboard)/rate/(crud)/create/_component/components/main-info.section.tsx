"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRateValidationSchemaType } from "../createRateDetailsValidation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { crud_get_rate_by_code } from "@/lib/curd/rate";
import { RiSparkling2Fill } from "react-icons/ri";
import CreateRatePlanCategoryPopup from "../../../../categories/_components/create-rate-plan-category-popup";
import { generateCode } from "@/lib/utils";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

// Create Rate Main Info Section

interface Props {
  id: string;

  formData: {
    rateCategories: RatePlanCategoryInterface[];
    seasons: RatePlanSeasonInterface[];
  };
  setSeasonData: (data: any) => void;
}

const CreateRate_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData, setSeasonData }, ref) => {
    const {
      formState: { errors, disabled, isSubmitSuccessful },
      register,
      control,
      watch,
      setValue,
    } = useFormContext<CreateRateValidationSchemaType>();
    const nameController = useController({
      control,
      name: "rateName",
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const category_controller = useController({
      control,
      name: "rateCategory",
    });
    const [categoryList, setCategoryList] = useState<
      RatePlanCategoryInterface[]
    >([]);

    useEffect(() => {
      setSelectedCategory("");
      setCategoryList(formData.rateCategories);
    }, [isSubmitSuccessful, formData.rateCategories]);
    const [parentRate, setParentRate] = useState("");

    // Set isActive to true by default
    useEffect(() => {
      setValue("isActive", true);
    }, [setValue]);

    async function findParentRate() {
      if (!parentRate) return;
      const res = await crud_get_rate_by_code(parentRate);
      if (res) {
        console.log(res);
        setValue("rateCategory", res.rateCategory);
        setSelectedCategory(res.rateCategory);
        setValue("description", res.description);
        setValue("predefinedSeason", res.predefinedSeason._id);
        setValue("mealPlan", res.mealPlan);
        setSeasonData(res.predefinedSeason);
      }
    }
    console.log(errors)
    // logic
    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Main rate details including name, internal code, category, and the
            room types the rate applies to.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* rate name */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="rateName">Rate name</Label>
            <Input
              id="rateName"
              type="text"
              disabled={disabled}
              placeholder="enter the rate name"
              {...register("rateName", { required: true })}
            />
            {errors?.rateName ? (
              <InlineAlert type="error">{errors.rateName.message}</InlineAlert>
            ) : null}
          </div>
          {/* rate code */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="ratecode">Rate code</Label>
            <Input
              id="ratecode"
              type="text"
              disabled={disabled}
              placeholder="enter the rate code"
              {...register("rateCode", { required: true })}
            />
            <div className="flex justify-end">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  const generatedCode: string = generateCode(
                    nameController.field.value,
                  );
                  setValue("rateCode", generatedCode);
                }}
                className="text-sm cursor-pointer text-end underline text-primary"
              >
                <RiSparkling2Fill /> Generate code
              </Button>
            </div>
            {errors?.rateCode ? (
              <InlineAlert type="error">{errors.rateCode.message}</InlineAlert>
            ) : null}
          </div>

          {/* rate type */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label>Rate type</Label>
            <RadioGroup defaultValue="option-one" onValueChange={(e) => setValue("rateType", e)}>
              {["Standard", "Parent", "Child"].map((type,i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={type}
                    id={type}
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors?.rateType ? (
              <InlineAlert type="error">{errors.rateType.message}</InlineAlert>
            ) : null}
          </div>
          {watch("rateType") === "Child" && (
            <div
              id="parentRate"
              className="w-full flex items-center col-span-2 gap-5"
            >
              <Input
                type="text"
                placeholder="enter the parent rate code"
                disabled={disabled}
                value={parentRate}
                onChange={(e) => {
                  setParentRate(e.target.value);
                }}
              />
              <Button
                disabled={disabled}
                type="button"
                onClick={findParentRate}
              >
                Set parent
              </Button>
            </div>
          )}
          {/* rate category */}
          <div className="flex flex-col col-span-2  w-full gap-2">
            <Label htmlFor="author">Rate category</Label>
            <div className="flex items-center gap-2">
              <Select
                value={selectedCategory}
                onValueChange={(e) => {
                  setSelectedCategory(e);
                  category_controller.field.onChange(e);
                }}
              >
                <SelectTrigger
                  disabled={disabled}
                  id="categories"
                  className="w-full"
                >
                  <SelectValue placeholder="select a rate category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CreateRatePlanCategoryPopup />
            </div>
            {errors?.rateCategory ? (
              <InlineAlert type="error">
                {errors.rateCategory.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* rate description */}
          <div className="flex flex-col col-span-2 w-full gap-2">
            <Label htmlFor="description">Rate description (optional)</Label>
            <Textarea
              id="description"
              placeholder="enter the rate description"
              rows={8}
              {...register("description", { required: true })}
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
          {/*<div className="flex flex-row items-center col-span-2 w-full gap-24">
            <Label htmlFor="isActive">Is active</Label>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(e) => setValue("isActive", e)}
            />
          </div>*/}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default CreateRate_MainInformation_Section;
