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
import { UserInterface } from "@/interfaces/user.interfaces";
import { crud_get_all_roles } from "@/lib/curd/role";
import { crud_get_user_by_id } from "@/lib/curd/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpdateUserFrom from "./_components/update-form";

export default function UpdateUserPage({ params }: { params: { id: string } }) {
  // router
  const router = useRouter();

  // is fetching state
  const [isFetchingData, setIsFetchingData] = useState(false);

  // form data (a needed data for the form)
  const [formData, setFormData] = useState<{
    roles: RoleInterface[];
  }>({
    roles: [],
  });

  // selected user
  const [oldUser, setOldUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    // if there no user id
    if (!params?.id) {
      router.replace("/users");
      return;
    }

    // fetching the role
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the user & roles

        const user = await crud_get_user_by_id(params.id);

        // if the user is the admin
        if (user.access.isAdmin) {
          router.replace("/users");
          return;
        }

        // roles
        const roles = await crud_get_all_roles({
          page: 0,
          size: 100,
        });

        if (user && roles) {
          // setting the user
          setOldUser(user);
          // setting the form data
          setFormData({
            roles,
          });
        } else {
          // redirect to the users page
          router.replace("/users");
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
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
              Update User
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
                  <BreadcrumbPage>Update User</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && oldUser && formData.roles ? (
          <UpdateUserFrom oldUser={oldUser} formData={formData} />
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
