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

import { useEffect } from "react";
import toast from "react-hot-toast";
import { crud_get_crm_contact_by_id } from "@/lib/curd/crm-contact";
import ContactProfileCard from "./_components/profile-card";

export default function CRMContactProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // router
  const router = useRouter();
  // fetcher
  const { data, refetch, error, isFetching } = useFetch(
    {
      // contact
      contact: () => crud_get_crm_contact_by_id(params.id),
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
              Contact Profile
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
                  <BreadcrumbPage>Contact Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {!isFetching && data.contact ? (
          <div className="w-full flex justify-center">
            <ContactProfileCard contact={data.contact} />
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Skeleton className="w-full  flex flex-col gap-8 h-[30em] lg:h-[45em] p-2 lg:p-4 rounded-3xl shadow-sm" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
