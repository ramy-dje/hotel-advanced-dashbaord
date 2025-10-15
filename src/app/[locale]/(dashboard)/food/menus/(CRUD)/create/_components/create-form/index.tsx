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
  CreateFoodMenuValidationSchema,
  CreateFoodMenuValidationSchemaType,
} from "./components/create-menu-validation.schema";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import CreateMenu_MainInformation_Section from "./components/main-info.section";
import { crud_create_food_menu } from "@/lib/curd/food-menu";
import CreateMenu_Sections_Section from "./components/menu-sections.section";
// import CreateDish_CategoryAndIngredients_Section from "./_components/category-ingredients.section";

interface Props {
  formData: {
    dishes: FoodDishInterface[];
  };
}

export default function CreateMenuFrom({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateFoodMenuValidationSchemaType>({
    resolver: zodResolver(CreateFoodMenuValidationSchema),
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_menu_sections_info_ref = useRef<HTMLDivElement>(null);

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
  const handleCreate = async (data: CreateFoodMenuValidationSchemaType) => {
    // clear the errors
    methods.clearErrors();

    setIsLoading(true);
    try {
      // create the menu
      await crud_create_food_menu({
        name: data.name,
        sections: data.sections.map((e) => ({
          description: e.des,
          dishes: e.dishes.map((d) => d.id),
          notes: e.notes.map((d) => d.name),
          sub_title: e.sub_title,
          featured_dish: e.featuredDish,
          title: e.title,
        })),
      });
      // to the dishes page
      router.push("/food/menus");
      // tost
      toast.success("Menu Created Successfully");
    } catch (err) {
      if (err == 409) {
        methods.setError("name", {
          message: "The menu name is used before",
        });
      } else {
        toast.error("Something went wrong");
      }
      setIsLoading(false);
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
              hash="#menu-sections"
              selected={hash == "#menu-sections"}
              ref={section_menu_sections_info_ref}
            >
              Menu Sections
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <CreateMenu_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* menu sections section */}
              <CreateMenu_Sections_Section
                ref={section_menu_sections_info_ref}
                formData={formData}
                id="#menu-sections"
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
            Create Menu
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
