"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef, useCallback, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateFoodMenuValidationSchemaType } from "./create-menu-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import { HiOutlinePencil, HiOutlineTrash, HiStar } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateMenuSectionPopup from "./add-menu-section-popup";
import { cn } from "@/lib/utils";
import UpdateMenuSectionPopup from "./update-menu-section-popup";

// Create menu sections section Main Info Section

interface Props {
  id: string;
  formData: {
    dishes: FoodDishInterface[];
  };
}

const CreateMenu_Sections_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData }, ref) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<CreateFoodMenuValidationSchemaType>();

    // sections controller
    const sections_controller = useController({
      control,
      defaultValue: [],
      name: "sections",
    });

    // update section model open
    const [updateModelOpen, setUpdateModelOpen] = useState(false);
    // select section to update
    const [toUpdateSection, setToUpdateSection] = useState<
      CreateFoodMenuValidationSchemaType["sections"][0] | null
    >(null);

    // methods
    // handle add section
    const handleAddSection = useCallback(
      (sec: CreateFoodMenuValidationSchemaType["sections"][0]) => {
        if (sec) {
          sections_controller.field.onChange([
            ...sections_controller.field.value,
            sec,
          ]);
        }
      },
      [sections_controller.field.value]
    );

    // handle set to update (to save the section to be updated)
    const handleSetToUpdate = useCallback(
      (sec: CreateFoodMenuValidationSchemaType["sections"][0]) => {
        if (sec) {
          setToUpdateSection(sec);
          // open the model
          setUpdateModelOpen(true);
        }
      },
      []
    );

    // handle update section
    const handleUpdateSection = useCallback(
      (id: string, sec: CreateFoodMenuValidationSchemaType["sections"][0]) => {
        if (id && sec) {
          sections_controller.field.onChange(
            sections_controller.field.value.map((e) => (e.id == id ? sec : e))
          );
        }
      },
      [sections_controller.field.value]
    );

    // handle remove section
    const handleRemoveSection = useCallback(
      (id: string) => {
        sections_controller.field.onChange(
          sections_controller.field.value.filter((e) => e.id != id)
        );
      },
      [sections_controller.field.value]
    );

    // logic
    return (
      <>
        {/* handle update section */}
        <UpdateMenuSectionPopup
          open={updateModelOpen}
          setOpen={setUpdateModelOpen}
          oldSection={toUpdateSection}
          updateSection={handleUpdateSection}
          dishes={formData.dishes}
        />
        <CreationFormSection ref={ref} id={id}>
          <CreationFormSectionInfo>
            <CreationFormSectionInfoTitle>
              Menu Sections
            </CreationFormSectionInfoTitle>
            <CreationFormSectionInfoDescription>
              The menu sections and dishes
            </CreationFormSectionInfoDescription>
          </CreationFormSectionInfo>
          <CreationFormSectionContent>
            {/* add menu section popup */}
            <div className="flex flex-col col-span-2 w-full gap-2">
              <Label htmlFor="sections">Sections</Label>
              {sections_controller.field.value.length ? (
                <div className="w-full flex flex-col gap-3">
                  {/* sections */}
                  {sections_controller.field.value.map((sec) => (
                    <div
                      key={sec.id}
                      className="flex flex-col items-center rounded-md border"
                    >
                      <div className="w-full flex gap-1 items-center justify-between p-2 border-b">
                        <div className="flex gap-1 items-center">
                          <h5 className="text-accent-foreground font-semibold">
                            {sec.title}
                          </h5>
                          <p className="text-sm line-clamp-1 text-neutral-500 dark:text-neutral-600">
                            {sec.sub_title}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => handleSetToUpdate(sec)}
                            className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
                          >
                            <HiOutlinePencil className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => handleRemoveSection(sec.id)}
                            className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
                          >
                            <HiOutlineTrash className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="w-full p-2 border-b">
                        <span className="font-medium mb-1">Description</span>
                        <p className="text-sm text-accent-foreground">
                          {sec.des}
                        </p>
                      </div>
                      <div className="w-full p-2 border-b">
                        <span className="font-medium mb-1">Notes</span>
                        <div className="w-full flex items-center flex-wrap gap-2 mt-1">
                          {sec.notes.map((note) => (
                            <Badge
                              key={note.id}
                              variant="outline"
                              className="group rounded-full gap-2 text-sm font-normal"
                            >
                              {note.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="w-full p-2">
                        <span className="font-medium mb-1">Dishes</span>
                        <div className="w-full flex items-center flex-wrap gap-2 mt-1">
                          {sec.dishes.map((dish) => (
                            <Badge
                              key={dish.id}
                              variant="outline"
                              className="group rounded-full gap-2 text-sm font-normal"
                            >
                              <HiStar
                                className={cn(
                                  "size-[1.2rem] text-gray-300 dark:text-gray-800",
                                  sec.featuredDish == dish.id &&
                                    "text-yellow-500 group-hover:text-yellow-500"
                                )}
                              />
                              {dish.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <CreateMenuSectionPopup
                addSection={handleAddSection}
                dishes={formData.dishes}
              />
              {/* sections error */}
              {errors?.sections ? (
                <InlineAlert type="error">
                  {errors.sections.message}
                </InlineAlert>
              ) : null}
            </div>
          </CreationFormSectionContent>
        </CreationFormSection>
      </>
    );
  }
);

export default CreateMenu_Sections_Section;
