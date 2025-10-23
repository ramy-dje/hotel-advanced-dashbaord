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
import { Link } from "@/i18n/routing";
import UpdateRateForm from "./_component/updateRateDetailsForm";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { crud_get_all_rate_categories } from "@/lib/curd/rate-category";
import { crud_get_all_rate_seasons } from "@/lib/curd/rate-season";
import { crud_get_rate_by_id } from "@/lib/curd/rate";
import { RatePlanInterface } from "@/interfaces/rate.interface";
import { TaxInterface } from "@/interfaces/taxes.interface";
import { crud_get_all_taxes } from "@/lib/curd/taxes";
import RatePlanServiceInterface from "@/interfaces/room-extra-services";
import { crud_get_all_roomExtraServices } from "@/lib/curd/room-extra-services";


export default function UpdateRatePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [formData, setFormData] = useState<{
    seasons: RatePlanSeasonInterface[];
    rateCategories: RatePlanCategoryInterface[];
    taxes: TaxInterface[];
    services: RatePlanServiceInterface[];
  }>({
    seasons: [],
    rateCategories: [],
    taxes: [],
    services: [],
  });
  const [oldRate, setOldRate] = useState<RatePlanInterface | null>(null);
  useEffect(() => {
    // fetching the rate categories and seasons which's needed for the update of the rate
    (async () => {
      setIsFetchingData(true);
      try {
        // categories
        const categories = await crud_get_all_rate_categories({
          page: 0,
          size: 100,
        });

        // tags
        const seasons = await crud_get_all_rate_seasons({
          page: 0,
          size: 100,
        });
        const taxes = await crud_get_all_taxes({
          page: 0,
          size: 100,
        });
        const services = await crud_get_all_roomExtraServices({
          page: 0,
          size: 100,
        });
       const rate = await crud_get_rate_by_id(params.id);
       if(rate){
        setOldRate(rate);
        
       }
        if (seasons && categories && taxes) {
          setFormData({
            seasons,
            rateCategories: categories,
            taxes,
            services,
          });
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
      }
      setIsFetchingData(false);
    })();
  }, [params.id]);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Update rate
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
                <BreadcrumbItem>Rate</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>rate details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>
        </PageLayoutHeader>
        {!isFetchingData && formData.seasons && formData.rateCategories && oldRate ? (
          <UpdateRateForm formData={formData} oldRate={oldRate} />
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
