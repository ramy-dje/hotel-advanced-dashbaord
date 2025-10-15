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
import { forwardRef, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateRoomValidationSchemaType } from "../update-room-validation.schema";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/text-editor";

// Update Room Main Info Section

interface Props {
  id: string;
  categories: RoomCategoryInterface[];
}

const UpdateRoom_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, categories }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      setValue,
      register,
    } = useFormContext<UpdateRoomValidationSchemaType>();
    // logic
    // old name controller
    const old_name_controller = useController({
      control,
      name: "old_name",
    });
    // category controller
    const category_controller = useController({
      control,
      name: "category",
    });

    // descriptions controller
    const description_controller = useController({
      control,
      name: "description",
    });

    // Change the name to the category when the category gets changed
    useEffect(() => {
      // see if the name is old
      if (old_name_controller.field.value) {
        setValue("name", old_name_controller.field.value);
        old_name_controller.field.onChange(null);
      } else if (category_controller.field.value) {
        const selectedCategory = categories.find(
          (cate) => cate.id == category_controller.field.value
        )!;
        setValue("name", selectedCategory.name);
      }
    }, [category_controller.field.value]);

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Write your room name, description and main information from here
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* room category */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category_controller.field.value}
              onValueChange={(e) => e && category_controller.field.onChange(e)}
            >
              <SelectTrigger
                disabled={disabled}
                id="category"
                className="w-auto"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors?.category ? (
              <InlineAlert type="error">{errors.category.message}</InlineAlert>
            ) : null}
          </div>
          {/* room name */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              disabled={disabled}
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {errors?.name ? (
              <InlineAlert type="error">{errors.name.message}</InlineAlert>
            ) : null}
          </div>
          {/* room code */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              type="text"
              disabled={disabled}
              placeholder="Unique Code"
              {...register("code", { required: true })}
            />
            {errors?.code ? (
              <InlineAlert type="error">{errors.code.message}</InlineAlert>
            ) : null}
          </div>
          {/* room description */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextEditor
              content={description_controller.field.value}
              setContent={(n) => {
                description_controller.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Description Of The Room"
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateRoom_MainInformation_Section;
