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
  CreateFoodDishValidationSchema,
  CreateFoodDishValidationSchemaType,
} from "./_components/create-dish-validation.schema";
import { crud_create_food_dish } from "@/lib/curd/food-dish";
import { UploadFile } from "@/lib/storage";
import CreateDish_MainInformation_Section from "./_components/main-info.section";
import FoodIngredientInterface from "@/interfaces/food-ingredient.interface";
import FoodTypeInterface from "@/interfaces/food-type.interface";
import CreateDish_TypeAndIngredients_Section from "./_components/type-ingredients.section";

interface Props {
  formData: {
    types: FoodTypeInterface[];
    ingredients: FoodIngredientInterface[];
  };
}

export default function CreateDishFrom({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateFoodDishValidationSchemaType>({
    resolver: zodResolver(CreateFoodDishValidationSchema),
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

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateFoodDishValidationSchemaType) => {
    setIsLoading(true);
    try {
      // upload the image
      const public_url = await UploadFile(data.image, "dish-image");

      // create the room
      await crud_create_food_dish({
        name: data.name,
        image: public_url,
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
      toast.success("Dish Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
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
              <CreateDish_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* type & ingredients */}
              <CreateDish_TypeAndIngredients_Section
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
            {/* Save as draft */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create Dish
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
