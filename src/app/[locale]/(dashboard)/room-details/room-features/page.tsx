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
import CreateRoomFeaturePopup from "./_components/create-room-feature-popup";
import DeleteRoomFeaturePopup from "./_components/delete-room-feature-popup";
import RoomFeaturesTable from "./_components/table";
import { UpdateRoomFeatureValidationSchemaType } from "./_components/update-room-feature-popup/update-room-feature.schema";
import UpdateRoomFeaturePopup from "./_components/update-room-feature-popup";
import useAccess from "@/hooks/use-access";

export default function RoomFeaturesPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  // selected categories to update and delete
  const [updateSelected, setUpdateSelected] = useState<
    (UpdateRoomFeatureValidationSchemaType & { id: string }) | null
  >(null);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  // methods
  const handleUpdate = (
    id: string,
    data: UpdateRoomFeatureValidationSchemaType
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
      {/* the update feature dialog */}
      {has(["room_feature:update"]) ? (
        <UpdateRoomFeaturePopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}

      {/* the delete feature dialog */}
      {has(["room_feature:delete"]) ? (
        <DeleteRoomFeaturePopup
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
              Room Features
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
                <BreadcrumbItem>Room Details</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Room Features</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create bed dialog */}
            {has(["room_feature:create"]) ? <CreateRoomFeaturePopup /> : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <RoomFeaturesTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
