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
import RatePlanCategoriesTable from "./_components/table";
import CreateRatePlanCategoryPopup from "./_components/create-rate-plan-category-popup";
import DeleteRatePlanCategoryPopup from "./_components/delete-rate-plan-category-popup";
import UpdateRatePlanCategoryPopup from "./_components/update-rate-plan-category-popup";
import useAccess from "@/hooks/use-access";

export default function RateCategoriesPage() {
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
      {/* the update category dialog */}
      {has(["blog_category:update"]) ? (
        <UpdateRatePlanCategoryPopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}

      {/* the delete category dialog */}
      {has(["blog_category:delete"]) ? (
        <DeleteRatePlanCategoryPopup
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
              Rate Categories
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
                  // eslint-disable-next-line react/no-children-prop
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>Rate</BreadcrumbItem>
                <BreadcrumbSeparator
                // eslint-disable-next-line react/no-children-prop
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categories</BreadcrumbPage>
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

            {/* create category dialog (rendered with the needed permissions) */}
            {has(["blog_category:create"]) ? <CreateRatePlanCategoryPopup /> : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <RatePlanCategoriesTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
