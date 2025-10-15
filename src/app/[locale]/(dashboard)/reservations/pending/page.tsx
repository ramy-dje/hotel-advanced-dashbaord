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
import { Link } from "@/i18n/routing";

import PendingReservationsTable from "./_components/table";
import { useState } from "react";
import CreateReservationSheet from "./_components/create-reservation-sheet/sheet";
import UpdateReservationSheet from "./_components/update-reservation-sheet/sheet";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../store";

export default function RoomsPage() {
  // access info
  const { has } = useAccess();
  // reservation store hook
  const { setSelectedReservation } = useReservationsStore();
  // update reservation sheet open
  const [updateReservationOpen, setUpdateReservationOpen] = useState(false);

  // Methods
  // handle update reservation
  const handleUpdateReservation = (id: string) => {
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setUpdateReservationOpen(true);
    }
  };

  return (
    <>
      {/* update reservation sheet */}
      {has(["reservation:update"]) ? (
        <UpdateReservationSheet
          open={updateReservationOpen}
          setOpen={setUpdateReservationOpen}
        />
      ) : null}

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Pending Reservations
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
                <BreadcrumbItem>Reservations</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pending</BreadcrumbPage>
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

            {/* create reservation sheet */}
            {has(["reservation:create"]) ? <CreateReservationSheet /> : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <PendingReservationsTable meta={{ handleUpdateReservation, has }} />
      </PageLayout>
    </>
  );
}
