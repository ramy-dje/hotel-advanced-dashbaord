"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateFoodDishValidationSchemaType } from "./update-dish-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import FoodIngredientInterface from "@/interfaces/food-ingredient.interface";
import FoodTypeInterface from "@/interfaces/food-type.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// update Dish type & ingredients Section

interface Props {
  id: string;
  formData: {
    types: FoodTypeInterface[];
    ingredients: FoodIngredientInterface[];
  };
}

const UpdateDish_TypeAndIngredients_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData }, ref) => {
    const {
      formState: { errors, disabled },
      control,
    } = useFormContext<UpdateFoodDishValidationSchemaType>();

    const [ingredients, setIngredients] = useState<
      { id: string; name: string }[]
    >([]);

    // ingredients selector
    const [selectedIngredient, setSelectedIngredient] = useState("");

    // old_ingredients controller
    const old_ingredients_controller = useController({
      control,
      name: "old_ingredients",
    });

    // ingredients controller
    const ingredients_controller = useController({
      control,
      name: "ingredients",
    });

    // type controller
    const type_controller = useController({
      control,
      name: "type",
    });

    // setting the ingredients
    useEffect(() => {
      if (ingredients) {
        ingredients_controller.field.onChange(ingredients.map((e) => e.id));
      }
    }, [ingredients]);

    // setting the old ingredients
    useEffect(() => {
      if (old_ingredients_controller.field.value) {
        setIngredients(old_ingredients_controller.field.value);
      }
    }, [old_ingredients_controller.field.value]);

    // methods

    // add key
    const handleAddKeyWord = () => {
      if (selectedIngredient) {
        const selected_ingredient = formData.ingredients.find(
          (e) => e.id == selectedIngredient
        )!;

        setIngredients((keys) => [
          ...keys,
          {
            id: selected_ingredient.id,
            name: selected_ingredient.name,
          },
        ]);

        setSelectedIngredient("");
      }
    };

    // remove key
    const handelRemoveKey = (id: string) => {
      setIngredients((ingredients) =>
        ingredients.filter((ingredient) => ingredient.id !== id)
      );
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Type & Ingredients
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The dish type and ingredients
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* dish ingredients */}
          <div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
            <Label htmlFor="ingredients">Ingredients</Label>
            <div className="w-full flex items-center gap-5">
              <Select
                value={selectedIngredient}
                onValueChange={(e) => setSelectedIngredient(e)}
              >
                <SelectTrigger
                  disabled={disabled}
                  id="extra-services"
                  className="w-full"
                >
                  <SelectValue placeholder="Choose an ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {formData.ingredients
                    ? formData.ingredients.map((ingredient) => (
                        <SelectItem
                          disabled={(() => {
                            return ingredients
                              .map((e) => e.id)
                              .includes(ingredient.id);
                          })()}
                          key={ingredient.id}
                          value={ingredient.id}
                        >
                          {ingredient.name}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
              {/* add ingredient */}
              <Button
                disabled={disabled}
                type="button"
                onClick={handleAddKeyWord}
              >
                Add Ingredient
              </Button>
            </div>
            {/* dish ingredients */}
            <div className="w-full flex items-center flex-wrap gap-3">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {ingredient.name}
                  <button
                    onClick={() => handelRemoveKey(ingredient.id)}
                    type="button"
                    disabled={disabled}
                    className="text-foreground/60 hover:text-foreground/100"
                  >
                    <HiOutlineX className="size-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          {/* dish type */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type_controller.field.value || "null"}
              onValueChange={(e) =>
                e && type_controller.field.onChange(e == "null" ? null : e)
              }
            >
              <SelectTrigger disabled={disabled} id="type" className="w-auto">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">No Type</SelectItem>
                {formData.types.map((type) => (
                  <SelectItem value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors?.type ? (
              <InlineAlert type="error">{errors.type.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateDish_TypeAndIngredients_Section;
