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
import useFetch from "@/hooks/use-filtering-fetch";
import { Link, useRouter } from "@/i18n/routing";
import { crud_get_all_crm_contact_occupations } from "@/lib/curd/crm-occupation";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { crud_get_all_crm_industries } from "@/lib/curd/crm-industry";
import { crud_get_all_roles } from "@/lib/curd/role";
import { crud_get_crm_contact_by_id } from "@/lib/curd/crm-contact";
import UpdateCRMContactFrom from "./_components/update-form";
import useAccess from "@/hooks/use-access";

export default function CreateCRMContactPage({
  params,
}: {
  params: { id: string };
}) {
  // access
  const { has } = useAccess();
  // router
  const router = useRouter();
  // fetcher
  const { data, refetch, error, isFetching } = useFetch(
    {
      // occupations
      occupations: () =>
        crud_get_all_crm_contact_occupations({
          page: 0,
          size: 100,
        }),
      // industries
      industries: () =>
        crud_get_all_crm_industries({
          page: 0,
          size: 100,
        }),
      // roles (when user hasn't the permission for it, it returns empty array)
      ...(has(["user:create"])
        ? {
            roles: () =>
              crud_get_all_roles({
                page: 0,
                size: 100,
              }),
          }
        : {
            roles: async () => [],
          }),
      // old contact
      old_contact: () => crud_get_crm_contact_by_id(params.id),
    },
    false // to fetch it manly
  );

  // when error happen
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong when fetching the data");
      // redirect to the crm contacts page
      router.replace("/crm/contacts");
    }
  }, [error]);

  useEffect(() => {
    // if there no contact id
    if (!params?.id) {
      router.replace("/crm/contacts");
      return;
    }
    refetch();
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
              Update Contact
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
                <BreadcrumbItem>CRM</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>Contacts</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Contact</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {!isFetching && data.old_contact ? (
          <UpdateCRMContactFrom
            old_contact={data.old_contact}
            formData={{
              industries: data.industries || [],
              occupations: data.occupations || [],
              roles: data.roles || [],
            }}
          />
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
