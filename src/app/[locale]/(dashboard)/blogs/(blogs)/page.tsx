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
import DeleteBlogPopup from "../_components/delete-blog-popup";
import BlogsTable from "../_components/table";

export default function JobsPage() {
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
      // pushing the update blog page
      router.push(`/blogs/update/${id}`);
    }
  };

  // // handle delete
  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      {/* delete blog dialog */}
      {has(["blog:delete"]) ? (
        <DeleteBlogPopup
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
              Posts
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
                  <BreadcrumbPage>Posts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create blog dialog (rendered with the needed permissions) */}
            {has(["blog:create"]) ? (
              <Button asChild className="gap-2 font-normal w-1/2 md:w-auto">
                <Link href="/blogs/create">
                  <HiOutlinePlus className="size-4" /> New Post
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <BlogsTable meta={{ handleUpdate, handleDelete, has }} />
      </PageLayout>
    </>
  );
}
