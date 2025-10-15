import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import {
  UpdateFoodDishValidationSchema,
  UpdateFoodDishValidationSchemaType,
} from "./_components/update-dish-validation.schema";
import { crud_update_food_dish } from "@/lib/curd/food-dish";
import { UploadFile } from "@/lib/storage";
import UpdateDish_MainInformation_Section from "./_components/main-info.section";
import FoodIngredientInterface from "@/interfaces/food-ingredient.interface";
import FoodTypeInterface from "@/interfaces/food-type.interface";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import UpdateDish_TypeAndIngredients_Section from "./_components/type-ingredients.section";

interface Props {
  formData: {
    types: FoodTypeInterface[];
    ingredients: FoodIngredientInterface[];
  };
  oldDish: FoodDishInterface;
}

export default function UpdateDishFrom({ formData, oldDish }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateFoodDishValidationSchemaType>({
    resolver: zodResolver(UpdateFoodDishValidationSchema),
    defaultValues: {
      price: 0,
      description: "",
      type: null,
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_typeAndIngredients_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("name");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful updating
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // set the old dish data
  useEffect(() => {
    // set the old dish data to the form
    if (oldDish) {
      // main info
      methods.setValue("name", oldDish.name);
      methods.setValue("description", oldDish.description || "");
      methods.setValue("price", oldDish.price);
      methods.setValue("image", oldDish.image);
      methods.setValue("image_old_url", oldDish.image);
      // type & ingredients
      methods.setValue("type", oldDish.type?.id || null);
      methods.setValue("old_ingredients", oldDish.ingredients);
    }
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateFoodDishValidationSchemaType) => {
    if (!oldDish) return;
    setIsLoading(true);
    try {
      let img_url = null;

      // if the image is changed
      if (typeof data.image == "string" && data.image == data.image_old_url) {
        // old image
        img_url = data.image_old_url;
      } else {
        // new image
        // upload the image
        const public_url = await UploadFile(data.image, "dish-image");
        img_url = public_url;
      }

      // create the room
      await crud_update_food_dish(oldDish.id, {
        name: data.name,
        image: img_url,
        ingredients: data.ingredients,
        price: data.price,
        type: data.type || null,
        description: data.description,
      });
      // clearing the image object URL
      if (data.image_url) {
        URL.revokeObjectURL(data.image_url);
      }
      // to the dishes page
      router.push("/food/dishes");
      // tost
      toast.success("Dish Updated Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleUpdate)}>
        <div className="w-full min-h-screen">
          {/* header */}
          <CreationTabsContent>
            <CreationTabsTab
              hash="#main-information"
              selected={hash == "#main-information"}
              ref={section_main_info_ref}
            >
              Main Information
            </CreationTabsTab>
            <CreationTabsTab
              hash="#type&ingredients"
              selected={hash == "#type&ingredients"}
              ref={section_typeAndIngredients_ref}
            >
              Type & Ingredients
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <UpdateDish_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* type & ingredients */}
              <UpdateDish_TypeAndIngredients_Section
                ref={section_typeAndIngredients_ref}
                formData={formData}
                id="#type&ingredients"
              />
              {/* <div className="mb-[5em]"></div> */}
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/food/dishes")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* Cancel */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Update Dish
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
