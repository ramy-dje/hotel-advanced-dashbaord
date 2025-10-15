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
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { HiOutlinePlus } from "react-icons/hi";
import PropertiesTable from "./_components/table";
import { useState } from "react";
import DeletePropertyPopup from "./_components/delete-property-popup";
import useAccess from "@/hooks/use-access";

export default function PropertiesPage() {
  // Access control
  const { has } = useAccess();

  // Dialog state management
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  const router = useRouter();

  // Handlers
  const handleUpdate = (id: string) => {
    if (id) {
      router.push(`/property/update/${id}`);
    }
  };

  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleView = (id: string) => {
    if (id) {
      router.push(`/property/${id}`);
    }
  };

  return (
    <>
      {has(["property:delete"]) && (
        <DeletePropertyPopup
          id={deleteSelected}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      )}

      <PageLayout>
        <PageLayoutHeader>
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Properties
            </PageLayoutHeaderNameAndBreadcrumbsTitle>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Properties</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          <PageLayoutHeaderActions>
            {/* create contact dialog (rendered with the needed permissions) */}
            {has(["property:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/property/create" className="flex items-center gap-2">
                  <HiOutlinePlus className="size-4" /> Add Property
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <PropertiesTable
          meta={{ handleDelete, handleUpdate, handleView, has }}
        />
      </PageLayout>
    </>
  );
}
