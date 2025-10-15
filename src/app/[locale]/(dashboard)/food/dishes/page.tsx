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
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import FoodDishesTable from "./_components/table";
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";
import DeleteFoodDishPopup from "./_components/delete-dish-popup";
import useAccess from "@/hooks/use-access";

export default function FoodDishesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);
  const router = useRouter();

  // methods

  // handle update
  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update dish page
      router.push(`/food/dishes/update/${id}`);
    }
  };

  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      {/* the delete dish dialog */}
      {has(["food_dish:delete"]) ? (
        <DeleteFoodDishPopup
          id={deleteSelected}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      ) : null}
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Dishes
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
                  <BreadcrumbPage>Dishes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create dish page (Rendered With Permissions) */}
            {has(["food_dish:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/food/dishes/create">
                  <HiOutlinePlus className="size-4" /> New Dish
                </Link>
              </Button>
            ) : null}
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <FoodDishesTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
