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
import { useState } from "react";
import useAccess from "@/hooks/use-access";
import UsersTable from "./_components/table";
import DeleteUserPopup from "./_components/delete-user-popup";
import ActiveUserPopup from "./_components/active-user-popup";

export default function UsersPage() {
  // access info
  const { has } = useAccess();
  // router
  const router = useRouter();

  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  const [activeDialogOpen, setActiveDialogOpen] = useState(false);
  const [activeSelected, setActiveSelected] = useState<{
    id: string;
    name: string;
    active: boolean;
  } | null>(null);

  // methods
  // handle update
  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/users/update/${id}`);
    }
  };

  // handle delete
  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  // handle active
  const handleActive = (user: {
    id: string;
    name: string;
    active: boolean;
  }) => {
    if ((user.id, user.name)) {
      setActiveSelected(user);
      setActiveDialogOpen(true);
    }
  };

  return (
    <>
      {/* delete user dialog */}
      {has(["user:delete"]) ? (
        <DeleteUserPopup
          id={deleteSelected}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      ) : null}

      {/* active user dialog */}
      {has(["user:activation"]) ? (
        <ActiveUserPopup
          user={activeSelected}
          open={activeDialogOpen}
          setOpen={setActiveDialogOpen}
        />
      ) : null}

      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Users
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
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create role dialog (rendered with the needed permissions) */}
            {has(["user:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/users/create">
                  <HiOutlinePlus className="size-4" /> Add User
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <UsersTable meta={{ handleUpdate, handleDelete, handleActive, has }} />
      </PageLayout>
    </>
  );
}
