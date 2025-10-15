"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderActions,
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
import { useState } from "react";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "./store";
import AllReservationsTable from "./_components/table";
import CompleteApprovedReservationSheet from "./approved/_components/complete-reservation-sheet/sheet";
import ViewCompletedReservationSheet from "./approved/_components/reservations-view/sheet";
import CreateReservationSheet from "./pending/_components/create-reservation-sheet/sheet";
import UpdateReservationSheet from "./pending/_components/update-reservation-sheet/sheet";
import ViewTrashedReservationSheet from "./archived/_components/reservations-view/sheet";
import ViewCanceledReservationSheet from "./canceled/_components/reservations-view/sheet";

export default function AllReservationsPage() {
  // access info
  const { has } = useAccess();
  // reservation store hook
  const { setSelectedReservation } = useReservationsStore();
  // view completed reservation sheet open
  const [viewCompletedReservationOpen, setViewCompletedReservationOpen] =
    useState(false);

  // view archived reservation sheet open
  const [viewArchivedReservationOpen, setViewArchivedReservationOpen] =
    useState(false);

  // view canceled reservation sheet open
  const [viewCanceledReservationOpen, setViewCanceledReservationOpen] =
    useState(false);

  // update reservation sheet open
  const [updateCompleteOpen, setUpdateCompleteOpen] = useState(false);

  // update pending reservation sheet open
  const [updatePendingReservationOpen, setUpdatePendingReservationOpen] =
    useState(false);

  // Methods
  // handle update approved reservation
  const handleApprovedReservation = (id: string) => {
    // reset the selected id
    setSelectedReservation(null);
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setUpdateCompleteOpen(true);
    }
  };

  //   // handle view completed reservation
  const handleViewCompletedReservation = (id: string) => {
    // reset the selected id
    setSelectedReservation(null);
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setViewCompletedReservationOpen(true);
    }
  };

  // handle update pending reservation
  const handleUpdatePendingReservation = (id: string) => {
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setUpdatePendingReservationOpen(true);
    }
  };

  // handle view archived reservation
  const handleViewArchivedReservation = (id: string) => {
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setViewArchivedReservationOpen(true);
    }
  };

  // handle view canceled reservation
  const handleViewCanceledReservation = (id: string) => {
    // set/save the id in the store
    if (id) {
      setSelectedReservation(id);
      setViewCanceledReservationOpen(true);
    }
  };

  return (
    <>
      {/* update reservation sheet */}
      {has(["reservation:update"]) ? (
        <CompleteApprovedReservationSheet
          open={updateCompleteOpen}
          setOpen={setUpdateCompleteOpen}
        />
      ) : null}

      {/* update pending reservation sheet */}
      {has(["reservation:update"]) ? (
        <UpdateReservationSheet
          open={updatePendingReservationOpen}
          setOpen={setUpdatePendingReservationOpen}
          keep // to just change the reservation's status (not remove it from the store)
        />
      ) : null}

      {/* view completed reservation sheet */}
      <ViewCompletedReservationSheet
        open={viewCompletedReservationOpen}
        setOpen={setViewCompletedReservationOpen}
        keep // to just change the reservation's status (not remove it from the store)
      />

      {/* view trashed reservation sheet */}
      <ViewTrashedReservationSheet
        open={viewArchivedReservationOpen}
        setOpen={setViewArchivedReservationOpen}
      />

      {/* view reservation sheet */}
      <ViewCanceledReservationSheet
        open={viewCanceledReservationOpen}
        setOpen={setViewCanceledReservationOpen}
        keep // to just change the reservation's status (not remove it from the store)
      />

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Reservations
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Reservations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {has(["reservation:create"]) ? <CreateReservationSheet /> : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <AllReservationsTable
          meta={{
            handleApprovedReservation,
            handleUpdatePendingReservation,
            handleViewCompletedReservation,
            handleViewArchivedReservation,
            handleViewCanceledReservation,
            has,
          }}
        />
      </PageLayout>
    </>
  );
}
