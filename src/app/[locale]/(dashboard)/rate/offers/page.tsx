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
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import OfferTable from "./_components/table";
import DeleteOfferPopup from "./_components/delete-offer-popup"
import useAccess from "@/hooks/use-access";
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";
import DiscountTypePopup from "./_components/discount-type-popup";
import { crud_get_all_roomExtraServices } from "@/lib/curd/room-extra-services";
import { crud_get_all_crm_contacts } from "@/lib/curd/crm-contact";

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
      {has(["offer:delete"]) ? (
        <DeleteOfferPopup
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
              Offers
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
                <BreadcrumbItem>Offers</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <DiscountTypePopup  />
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <OfferTable meta={{ handleDelete, has }} />
      </PageLayout>
    </>
  );
}
