"use client";
import useAnalyticsFetch from "@/hooks/use-analytics-fetch";
import { CRMContactAnalyticsInterface } from "@/interfaces/analytics";
import { crud_get_analytics_crm_contacts } from "@/lib/curd/analytics";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import CRMContactsPeriodAnalyticsChartCard from "./contacts-period.chart";
import TopCRMContactsIndustriesAnalyticsChartCard from "./contacts-top-industry.chart";
import TopCRMContactsOccupationsAnalyticsChartCard from "./contacts-top-occupations.chart";
import TopCRMContactsCountriesAnalyticsChartCard from "./contacts-top-countries.chart";
import CRMContactsNumberAnalyticsChartCard from "./contacts-number.chart";

// The CRM contacts Analytics Card Component

export default function CRMContactsAnalyticsCard() {
  const { data, isFetching, error, refresh } =
    useAnalyticsFetch<CRMContactAnalyticsInterface>(
      "crm_contacts",
      crud_get_analytics_crm_contacts
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
      aria-label="CRM Contacts Overview"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Contacts Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={refresh}
                size="icon"
                disabled={!(!isFetching && data)}
                variant="outline"
                aria-label="Refresh CRM Contacts Analytics"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh CRM Contacts Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* contacts period chart (with loading skelton) */}
      {!isFetching && data ? (
        <CRMContactsPeriodAnalyticsChartCard
          key="crm-contacts-period-chart-card"
          crm_contacts_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="blogs-period-chart-loading"
        />
      )}

      {/* top contacts industries period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMContactsIndustriesAnalyticsChartCard
          key="crm-contacts-top-industries-chart-card"
          crm_contacts_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-contacts-top-industries-chart-loading"
        />
      )}

      {/* top contacts occupations period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMContactsOccupationsAnalyticsChartCard
          key="crm-contacts-top-occupations-chart-card"
          crm_contacts_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-contacts-top-occupations-chart-loading"
        />
      )}

      {/* top contacts countries period chart (with loading skelton) */}
      {!isFetching && data ? (
        <TopCRMContactsCountriesAnalyticsChartCard
          key="crm-contacts-top-countries-chart-card"
          crm_contacts_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="crm-contacts-top-countries-chart-loading"
        />
      )}

      {/* contacts numbers chart (with loading skelton) */}
      {!isFetching && data ? (
        <CRMContactsNumberAnalyticsChartCard
          key="crm-contacts-number-chart-card"
          crm_contacts_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[370px] rounded-md"
          key="crm-contacts-number-chart-loading"
        />
      )}
    </section>
  );
}
