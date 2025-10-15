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
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/routing";
import RoleInterface from "@/interfaces/role.interface";
import { crud_get_role_by_id } from "@/lib/curd/role";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpdateRoleFrom from "./_components/update-form";

export default function UpdateRolePage({ params }: { params: { id: string } }) {
  // router
  const router = useRouter();

  // is fetching state
  const [isFetchingData, setIsFetchingData] = useState(false);

  // selected role
  const [oldRole, setOldRole] = useState<RoleInterface | null>(null);

  useEffect(() => {
    // if there no id blog
    if (!params?.id) {
      router.replace("/roles");
      return;
    }

    // fetching the role
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the role
        const role = await crud_get_role_by_id(params.id);

        // if the role isn't deletable or editable

        if (!role.deletable) {
          router.replace("/roles");
        }

        if (role) {
          // setting the role
          setOldRole(role);
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        router.replace("/roles");
      }
      setIsFetchingData(false);
    })();
  }, []);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Update Role
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
                <BreadcrumbItem>Roles</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Role</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && oldRole ? (
          <UpdateRoleFrom oldRole={oldRole} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        )}
        {/* <CreateRoleFrom /> */}
      </PageLayout>
    </>
  );
}
