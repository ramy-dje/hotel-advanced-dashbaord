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
import TaxesTable from "./_components/table";
import CreateFeePopup from "./_components/create-fees-popup";
import DeleteFeePopup from "./_components/delete-fees-popup";
import UpdateFeePopup from "./_components/update-fees-popup";
import useAccess from "@/hooks/use-access";
import { FeeInterface } from "@/interfaces/fees.interface";

export default function FeesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  // selected ingredient to update and delete
  const [updateSelected, setUpdateSelected] = useState<{
    name: string;
    id: string;
    type: FeeInterface['type'];
    amount: number;
  } | null>(null);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  // methods
  const handleUpdate = (id: string, name: string, type: FeeInterface['type'], amount: number) => {
    if (id && name && type && amount) {
      setUpdateSelected({ id, name, type, amount });
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
      {/* the update tax dialog */}
      {has(["blog_category:update"]) ? (
        <UpdateFeePopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}

      {/* the delete tax dialog */}
      {has(["blog_category:delete"]) ? (
        <DeleteFeePopup
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
              Fees
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
                <BreadcrumbItem>Fees</BreadcrumbItem>
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

            {/* create tax dialog (rendered with the needed permissions) */}
            {has(["blog_category:create"]) ? <CreateFeePopup /> : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <TaxesTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
