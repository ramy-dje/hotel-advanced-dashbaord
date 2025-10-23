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
import RatePlanTable from "./_components/table";
import DeleteRatePlanPopup from "./_components/delete-rate-plan-popup"
import useAccess from "@/hooks/use-access";
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";

export default function RateCategoriesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // selected ingredient to update and delete
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);



  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      {/* the delete category dialog */}
      {has(["blog_category:delete"]) ? (
        <DeleteRatePlanPopup
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
              Rates
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
                <BreadcrumbItem>Rates</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
              <Link href="/rate/create">
                <HiOutlinePlus className="size-4" /> New Rate
              </Link>
            </Button>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <RatePlanTable meta={{ handleDelete, has }} />
      </PageLayout>
    </>
  );
}
