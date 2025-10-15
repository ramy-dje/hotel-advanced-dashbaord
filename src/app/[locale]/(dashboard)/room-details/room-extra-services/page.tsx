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
import { useState } from "react";
import RoomExtraServicesTable from "./_components/table";
import CreateRoomExtraServicePopup from "./_components/create-room-extra-service-popup";
import DeleteRoomExtraServicePopup from "./_components/delete-room-extra-service-popup";
import { UpdateRoomExtraServiceValidationSchemaType } from "./_components/update-room-extra-service-popup/update-room-extra-service.schema";
import UpdateRoomExtraServicePopup from "./_components/update-room-extra-service-popup";
import useAccess from "@/hooks/use-access";

export default function RoomCategoriesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  // selected categories to update and delete
  const [updateSelected, setUpdateSelected] = useState<
    (UpdateRoomExtraServiceValidationSchemaType & { id: string }) | null
  >(null);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  // methods
  const handleUpdate = (
    id: string,
    data: UpdateRoomExtraServiceValidationSchemaType
  ) => {
    if (id && data) {
      setUpdateSelected({ id, ...data });
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
      {has(["room_extra_services:update"]) ? (
        <UpdateRoomExtraServicePopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}

      {/* the delete extra service dialog */}
      {has(["room_extra_services:delete"]) ? (
        <DeleteRoomExtraServicePopup
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
              Room Extra Services
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
                  <BreadcrumbPage>Room Extra Services</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create extra service dialog */}
            {has(["room_extra_services:create"]) ? (
              <CreateRoomExtraServicePopup />
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <RoomExtraServicesTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
