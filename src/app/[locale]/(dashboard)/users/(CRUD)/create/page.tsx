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
import { crud_get_all_roles } from "@/lib/curd/role";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateUserFrom from "./_components/create-form";

export default function CreateUserPage() {
  // router
  const router = useRouter();
  // is fetching
  const [isFetchingData, setIsFetchingData] = useState(false);
  // form data (a needed data for the form)
  const [formData, setFormData] = useState<{
    roles: RoleInterface[];
  }>({
    roles: [],
  });

  useEffect(() => {
    // fetching the roles which's needed for creating a user
    (async () => {
      setIsFetchingData(true);
      try {
        // roles
        const roles = await crud_get_all_roles({
          page: 0,
          size: 100,
        });

        if (roles) {
          setFormData({
            roles,
          });
        } else {
          // redirect to the users page
          router.replace("/users");
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        // redirect to the users page
        router.replace("/users");
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
              Create User
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
                <BreadcrumbItem>Users</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create User</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {!isFetchingData && formData.roles ? (
          <CreateUserFrom formData={formData} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
