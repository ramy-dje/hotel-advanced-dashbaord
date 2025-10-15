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
import RoomsTable from "./_components/table";
import { useState } from "react";
import DeleteRoomPopup from "./_components/delete-room-popup";
import useAccess from "@/hooks/use-access";

export default function RoomsPage() {
  // access info
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);
  const router = useRouter();

  // methods
  // handle update
  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/rooms/update/${id}`);
    }
  };

  // handle delete
  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  // handle View
  const handleView = (id: string) => {
    if (id) {
      router.push(`/rooms/${id}`);
    }
  };

  return (
    <>
      {has(["room:delete"]) ? (
        <DeleteRoomPopup
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
              Rooms
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
                  <BreadcrumbPage>Rooms</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create room dialog */}
            {has(["room:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/rooms/create">
                  <HiOutlinePlus className="size-4" /> New Room
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <RoomsTable meta={{ handleDelete, handleUpdate, handleView, has }} />
      </PageLayout>
    </>
  );
}
