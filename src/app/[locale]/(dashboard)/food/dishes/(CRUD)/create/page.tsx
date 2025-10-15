"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
  PageLayoutHeaderActions,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import FoodTypeInterface from "@/interfaces/food-type.interface";
import FoodIngredientInterface from "@/interfaces/food-ingredient.interface";
import { crud_get_all_food_types } from "@/lib/curd/food-type";
import { crud_get_all_food_ingredients } from "@/lib/curd/food-ingredient";
import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import CreateDishFrom from "./_components/create-form";

export default function CreateDishPage() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [formData, setFormData] = useState<{
    types: FoodTypeInterface[];
    ingredients: FoodIngredientInterface[];
  }>({
    types: [],
    ingredients: [],
  });

  useEffect(() => {
    // fetching the food types and ingredients which's needed for the creation of the dish
    (async () => {
      setIsFetchingData(true);
      try {
        // types
        const types = await crud_get_all_food_types({
          page: 0,
          size: 100,
        });

        // ingredients

        const ingredients = await crud_get_all_food_ingredients({
          page: 0,
          size: 100,
        });

        if (types && ingredients) {
          setFormData({
            types,
            ingredients,
          });
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
      }
      setIsFetchingData(false);
    })();
  }, []);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Create Dish
            </PageLayoutHeaderNameAndBreadcrumbsTitle>
            {/* breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>Food & Drink</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Dish</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && formData.types && formData.ingredients ? (
          <CreateDishFrom formData={formData} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
