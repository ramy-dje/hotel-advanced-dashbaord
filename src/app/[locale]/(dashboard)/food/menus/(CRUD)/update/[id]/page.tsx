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
import { Link, useRouter } from "@/i18n/routing";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import { crud_get_all_food_dishes } from "@/lib/curd/food-dish";
import { crud_get_food_menu_by_id } from "@/lib/curd/food-menu";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UpdateMenuFrom from "./_components/update-form";

export default function UpdateMenuPage({ params }: { params: { id: string } }) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [formData, setFormData] = useState<{
    dishes: FoodDishInterface[];
  }>({
    dishes: [],
  });
  // selected menu
  const [oldMenu, setOldMenu] = useState<FoodMenuInterface | null>(null);

  // router
  const router = useRouter();

  useEffect(() => {
    // if there no id
    if (!params?.id) {
      router.replace("/food/menus");
      return;
    }
    // fetching the food menu and food dishes which's needed for the creation of the dish
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the menu
        const menu = await crud_get_food_menu_by_id(params?.id);

        // dishes
        const dishes = await crud_get_all_food_dishes({
          page: 0,
          size: 100,
        });

        if (dishes && menu) {
          // menu
          setOldMenu(menu);
          // form data
          setFormData({
            dishes,
          });
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        router.replace("/food/menus");
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
              Update Menu
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
                  <BreadcrumbPage>Update Menu</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && oldMenu && formData.dishes ? (
          <UpdateMenuFrom oldMenu={oldMenu} formData={formData} />
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
