"use client";
import useAnalyticsFetch from "@/hooks/use-analytics-fetch";
import { ReservationsAnalyticsInterface } from "@/interfaces/analytics";
import { crud_get_analytics_reservations } from "@/lib/curd/analytics";
import { useEffect } from "react";
import ReservationsNumberAnalyticsChartCard from "./reservations-numbers.chart";
import { Skeleton } from "@/components/ui/skeleton";
import { CardTitle } from "@/components/ui/card";
import ReservationsMonthlyAnalyticsChartCard from "./reservations-monthly.chart";
import ReservationsPeriodAnalyticsChartCard from "./reservations-period.chart";
import { Button } from "@/components/ui/button";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

// The Reservations Analytics Card Component

export default function ReservationsAnalyticsCard() {
  const { data, isFetching, error, refresh } =
    useAnalyticsFetch<ReservationsAnalyticsInterface>(
      "reservations",
      crud_get_analytics_reservations
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
      aria-label="Reservations Analytics Dashboard"
      className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Hotel Reservations Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={refresh}
                size="icon"
                disabled={!(!isFetching && data)}
                variant="outline"
                aria-label="Refresh Reservations Analytics"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh Reservations Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* reservations monthly chart (with loading skelton) */}
      {!isFetching && data ? (
        <ReservationsMonthlyAnalyticsChartCard
          key="reservations-monthly-chart-card"
          reservations_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-2 h-[350px] rounded-md"
          key="reservations-monthly-monthly-chart-loading"
        />
      )}

      {/* reservations period chart (with loading skelton) */}
      {!isFetching && data ? (
        <ReservationsPeriodAnalyticsChartCard
          key="reservations-period-chart-card"
          reservations_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-2 h-[350px] rounded-md"
          key="reservations-period-chart-loading"
        />
      )}

      {/* reservations numbers chart (with loading skelton) */}
      {!isFetching && data ? (
        <ReservationsNumberAnalyticsChartCard
          key="reservations-number-chart-card"
          reservations_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[350px] rounded-md"
          key="reservations-number-chart-loading"
        />
      )}
    </section>
  );
}
