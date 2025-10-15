"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
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
import ArchivedReservationsTable from "./_components/table";
import { useState } from "react";
import ViewCanceledReservationSheet from "./_components/reservations-view/sheet";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../store";

export default function ArchivedReservationsPage() {
  // access info
  const { has } = useAccess();
  // reservation store hook
  const { setSelectedReservation } = useReservationsStore();
  // view reservation sheet open
  const [viewReservationOpen, setViewReservationOpen] = useState(false);

  // Methods
  // handle view reservation
  const handleViewReservation = (id: string) => {
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setViewReservationOpen(true);
    }
  };

  return (
    <>
      {/* view reservation sheet */}
      <ViewCanceledReservationSheet
        open={viewReservationOpen}
        setOpen={setViewReservationOpen}
      />

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Canceled Reservations
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
                  <BreadcrumbPage>Canceled</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          {/* <PageLayoutHeaderActions>
            <Button
              variant="outline"
              disabled
              className="w-1/2 md:w-auto gap-2 font-normal"
            >
              <HiDownload className="size-4 rotate-180 text-accent-foreground/70" />{" "}
              Export
            </Button>
          </PageLayoutHeaderActions> */}
        </PageLayoutHeader>

        {/* the table header and table section */}
        <ArchivedReservationsTable meta={{ handleViewReservation, has }} />
      </PageLayout>
    </>
  );
}
