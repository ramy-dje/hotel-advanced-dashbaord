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
import { useState } from "react";
import useAccess from "@/hooks/use-access";
import DeletedRoomsTable from "./_components/table";
import ForceDeleteRoomPopup from "./_components/force-delete-room-popup";
import RecoverDeletedRoomPopup from "./_components/recover-delete-room-popup";

export default function DeletedRoomsPage() {
  // access info
  const { has } = useAccess();

  // dialogs open states
  // force delete
  const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = useState(false);
  const [forceDeleteSelected, setForceDeleteSelected] = useState<string | null>(
    null
  );

  // recover
  const [recoverDialogOpen, setRecoverDialogOpen] = useState(false);
  const [recoverSelected, setRecoverSelected] = useState<string | null>(null);

  // handle force delete
  const handleForceDelete = (id: string) => {
    if (id) {
      setForceDeleteSelected(id);
      setForceDeleteDialogOpen(true);
    }
  };

  // handle recover
  const handleRecover = (id: string) => {
    if (id) {
      setRecoverSelected(id);
      setRecoverDialogOpen(true);
    }
  };

  return (
    <>
      {has(["room:force-delete"]) ? (
        <ForceDeleteRoomPopup
          id={forceDeleteSelected}
          open={forceDeleteDialogOpen}
          setOpen={setForceDeleteDialogOpen}
        />
      ) : null}

      {has(["room:recover"]) ? (
        <RecoverDeletedRoomPopup
          id={recoverSelected}
          open={recoverDialogOpen}
          setOpen={setRecoverDialogOpen}
        />
      ) : null}

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Deleted Rooms
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
                  <BreadcrumbLink asChild>
                    <Link href="/rooms">Rooms</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Deleted Rooms</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          <div className=""></div>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <DeletedRoomsTable meta={{ handleForceDelete, handleRecover, has }} />
      </PageLayout>
    </>
  );
}
