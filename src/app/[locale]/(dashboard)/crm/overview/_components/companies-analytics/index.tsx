"use client";
import useAnalyticsFetch from "@/hooks/use-analytics-fetch";
import { CRMCompanyAnalyticsInterface } from "@/interfaces/analytics";
import { crud_get_analytics_crm_companies } from "@/lib/curd/analytics";
import { useEffect } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import CRMCompaniesPeriodAnalyticsChartCard from "./companies-period.chart";
import { Skeleton } from "@/components/ui/skeleton";
import TopCRMCompaniesCountriesAnalyticsChartCard from "./companies-top-countries.chart";
import TopCRMCompaniesRegionsAnalyticsChartCard from "./companies-top-regions.chart";
import TopCRMCompaniesIndustriesAnalyticsChartCard from "./companies-top-industry.chart";
import TopCRMCompaniesCategoriesAnalyticsChartCard from "./companies-top-category.chart";
import TopCRMCompaniesSizesAnalyticsChartCard from "./companies-top-sizes.chart";

// The CRM companies Analytics Card Component

export default function CRMCompaniesAnalyticsCard() {
  const { data, isFetching, error, refresh } =
    useAnalyticsFetch<CRMCompanyAnalyticsInterface>(
      "crm_companies",
      crud_get_analytics_crm_companies
    );

  // when error happened
  useEffect(() => {
    if (error) {
      // do something
      toast.error("Fetching Analytics Error");
    }
  }, [error]);

  return (
    <section
      aria-label="CRM Companies Overview"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Companies Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={refresh}
                size="icon"
                disabled={!(!isFetching && data)}
                variant="outline"
                aria-label="Refresh CRM Companies Analytics"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh CRM Companies Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* companies period chart (with loading skelton) */}
      {!isFetching && data ? (
        <CRMCompaniesPeriodAnalyticsChartCard
          key="crm-companies-period-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-chart-loading"
        />
      )}

      {/* top companies industries period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMCompaniesIndustriesAnalyticsChartCard
          key="crm-companies-top-industries-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-top-industries-chart-loading"
        />
      )}

      {/* top companies categories period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMCompaniesCategoriesAnalyticsChartCard
          key="crm-companies-top-categories-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-top-categories-chart-loading"
        />
      )}

      {/* top companies sizes period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMCompaniesSizesAnalyticsChartCard
          key="crm-companies-top-sizes-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-top-sizes-chart-loading"
        />
      )}

      {/* top companies countries period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMCompaniesCountriesAnalyticsChartCard
          key="crm-companies-top-countries-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-top-countries-chart-loading"
        />
      )}

      {/* top contacts regions period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMCompaniesRegionsAnalyticsChartCard
          key="crm-companies-top-regions-chart-card"
          crm_companies_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-companies-top-regions-chart-loading"
        />
      )}
    </section>
  );
}
