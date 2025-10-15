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
import { crud_get_all_crm_industries } from "@/lib/curd/crm-industry";
import { crud_get_all_crm_company_categories } from "@/lib/curd/crm-category";
import CreateCRMCompanyFrom from "./_components/create-form";

export default function CreateCRMCompanyPage() {
  // router
  const router = useRouter();
  // fetcher
  const { data, error, isFetching } = useFetch(
    {
      // categories
      categories: () =>
        crud_get_all_crm_company_categories({
          page: 0,
          size: 100,
        }),
      // industries
      industries: () =>
        crud_get_all_crm_industries({
          page: 0,
          size: 100,
        }),
    },
    true // to fetch at the first mount
  );

  // when error happen
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong when fetching the data");
      // redirect to the crm companies page
      router.replace("/crm/companies");
    }
  }, [error]);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Create Company
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
                <BreadcrumbItem>Companies</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Company</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {!isFetching ? (
          <CreateCRMCompanyFrom
            formData={{
              industries: data.industries || [],
              categories: data.categories || [],
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
