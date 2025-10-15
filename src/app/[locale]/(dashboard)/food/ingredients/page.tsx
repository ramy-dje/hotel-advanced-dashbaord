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
import { Link } from "@/i18n/routing";
import FoodIngredientTable from "./_components/table";
import CreateFoodIngredientPopup from "./_components/create-food-ingredient-popup";
import UpdateFoodIngredientPopup from "./_components/update-food-ingredient-popup";
import DeleteFoodIngredientPopup from "./_components/delete-food-ingredient-popup";
import useAccess from "@/hooks/use-access";

export default function FoodIngredientsPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  // selected ingredient to update and delete
  const [updateSelected, setUpdateSelected] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  // methods
  const handleUpdate = (id: string, name: string) => {
    if (id && name) {
      setUpdateSelected({ id, name });
      setUpdateDialogOpen(true);
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
      {/* the update ingredient dialog */}
      {has(["food_ingredient:update"]) ? (
        <UpdateFoodIngredientPopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}

      {/* the delete ingredient dialog */}
      {has(["food_ingredient:delete"]) ? (
        <DeleteFoodIngredientPopup
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
              Ingredients
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
                  <BreadcrumbPage>Ingredients</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* <Button
              variant="outline"
              disabled
              className="w-1/2 md:w-auto gap-2 font-normal"
            >
              <HiDownload className="size-4 rotate-180 text-accent-foreground/70" />{" "}
              Export
            </Button> */}

            {/* create ingredient dialog (Rendered With Permissions) */}
            {has(["food_ingredient:create"]) ? (
              <CreateFoodIngredientPopup />
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <FoodIngredientTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
