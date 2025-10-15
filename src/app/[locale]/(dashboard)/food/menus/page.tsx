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
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";
import FoodMenusTable from "./_components/table";
import DeleteFoodMenuPopup from "./_components/delete-menu-popup";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import ViewFoodMenuPopup from "./_components/view-menu-popup";
import useAccess from "@/hooks/use-access";

export default function FoodDishesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  //
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);
  // selected menu to view and delete
  const [viewSelected, setViewSelected] = useState<FoodMenuInterface | null>(
    null
  );
  const router = useRouter();

  // methods

  // handle update
  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update menus page
      router.push(`/food/menus/update/${id}`);
    }
  };

  // handle delete
  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  // handle view menu
  const handleView = (menu: FoodMenuInterface) => {
    if (menu) {
      setViewSelected(menu);
      setViewDialogOpen(true);
    }
  };

  return (
    <>
      {/* the delete menu dialog */}
      {has(["food_menu:delete"]) ? (
        <DeleteFoodMenuPopup
          id={deleteSelected}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      ) : null}

      {/* show menu */}
      <ViewFoodMenuPopup
        data={viewSelected}
        open={viewDialogOpen}
        setOpen={setViewDialogOpen}
      />

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Menus
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
                  <BreadcrumbPage>Menus</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create menu page (Rendered With Permissions) */}
            {has(["food_menu:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/food/menus/create">
                  <HiOutlinePlus className="size-4" /> New Menu
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <FoodMenusTable
          meta={{ handleUpdate, handleDelete, handleView, has }}
        />
      </PageLayout>
    </>
  );
}
