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
  UpdateFoodMenuValidationSchema,
  UpdateFoodMenuValidationSchemaType,
} from "./components/update-menu-validation.schema";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import { crud_update_food_menu } from "@/lib/curd/food-menu";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import UpdateMenu_MainInformation_Section from "./components/main-info.section";
import UpdateMenu_Sections_Section from "./components/menu-sections.section";
import { generateSimpleId } from "@/lib/utils";

interface Props {
  oldMenu: FoodMenuInterface;
  formData: {
    dishes: FoodDishInterface[];
  };
}

export default function UpdateMenuFrom({ formData, oldMenu }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateFoodMenuValidationSchemaType>({
    resolver: zodResolver(UpdateFoodMenuValidationSchema),
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

  // set the old menu data
  useEffect(() => {
    // set the old menu data to the form
    if (oldMenu) {
      // main info
      methods.setValue("name", oldMenu.name);
      // sections
      methods.setValue(
        "sections",
        oldMenu.sections.map((sec) => ({
          id: generateSimpleId(),
          des: sec.description,
          notes:
            sec?.notes?.map((e) => ({
              id: generateSimpleId(),
              name: e,
            })) || [],
          sub_title: sec.sub_title,
          featuredDish: sec.featured_dish || "",
          title: sec.title,
          dishes: sec.dishes.map((d) => ({
            id: d.id,
            name: d.name,
          })),
        }))
      );
    }
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateFoodMenuValidationSchemaType) => {
    if (!oldMenu) return;

    // clear the errors
    methods.clearErrors();

    setIsLoading(true);
    try {
      // update the menu
      await crud_update_food_menu(oldMenu.id, {
        name: data.name,
        sections: data.sections.map((e) => ({
          description: e.des,
          notes: e.notes.map((d) => d.name),
          sub_title: e.sub_title,
          dishes: e.dishes.map((d) => d.id),
          featured_dish: e.featuredDish,
          title: e.title,
        })),
      });
      // to the dishes page
      router.push("/food/menus");
      // tost
      toast.success("Menu Updated Successfully");
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
              <UpdateMenu_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* <div className="mb-[5em]"></div> */}
            </CreationFormContent>
            {/* menu sections section */}
            <UpdateMenu_Sections_Section
              ref={section_menu_sections_info_ref}
              formData={formData}
              id="#menu-sections"
            />
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
            Update Menu
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
