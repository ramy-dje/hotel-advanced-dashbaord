"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAnalyticsFetch from "@/hooks/use-analytics-fetch";
import {
  BlogsAnalyticsInterface,
  DestinationsAnalyticsInterface,
} from "@/interfaces/analytics";
import {
  crud_get_analytics_blogs,
  crud_get_analytics_destinations,
} from "@/lib/curd/analytics";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { HiOutlineRefresh } from "react-icons/hi";
import BlogPeriodAnalyticsChartCard from "./blogs-period.chart";
import { Skeleton } from "@/components/ui/skeleton";
import DestinationsPeriodAnalyticsChartCard from "./destinations-period.chart";
import useAccess from "@/hooks/use-access";

// The Articles (blogs & destinations) Analytics Card Component

export default function ArticlesAnalyticsCard() {
  const { has } = useAccess();

  // blogs fetching
  const {
    data: blogs_data,
    isFetching: blogs_is_fetching,
    error: blogs_error,
    refresh: blogs_refresh,
  } = useAnalyticsFetch<BlogsAnalyticsInterface>(
    "blogs",
    has(["analytics_blogs:read"]) ? crud_get_analytics_blogs : async () => []
  );

  // destinations fetching
  const {
    data: destinations_data,
    isFetching: destinations_is_fetching,
    error: destinations_error,
    refresh: destinations_refresh,
  } = useAnalyticsFetch<DestinationsAnalyticsInterface>(
    "destinations",
    has(["analytics_destinations:read"])
      ? crud_get_analytics_destinations
      : async () => []
  );

  //  fetching status for both

  const isFetching = useMemo(
    () => blogs_is_fetching || destinations_is_fetching,
    [blogs_is_fetching, destinations_is_fetching]
  );

  // when error happened
  useEffect(() => {
    if (blogs_error || destinations_error) {
      // do something
      toast.error("Fetching Analytics Error");
    }
  }, [blogs_error, destinations_error]);

  return (
    <section
      aria-label="Posts & Destinations Overview"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Posts & Destinations Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  blogs_refresh();
                  destinations_refresh();
                }}
                size="icon"
                disabled={!(!isFetching && blogs_data && destinations_data)}
                variant="outline"
                aria-label="Refresh Articles Analytics"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh Articles Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* blogs period chart (with loading skelton) (With Permissions) */}
      {has(["analytics_blogs:read"]) ? (
        <>
          {!isFetching && blogs_data ? (
            <BlogPeriodAnalyticsChartCard
              key="blogs-period-chart-card"
              blogs_analytics_data={blogs_data}
            />
          ) : (
            <Skeleton
              className="col-span-1 h-[350px] rounded-md"
              key="blogs-period-chart-loading"
            />
          )}
        </>
      ) : null}

      {/* destinations period chart (with loading skelton) (with Permissions) */}
      {has(["analytics_destinations:read"]) ? (
        <>
          {!isFetching && destinations_data ? (
            <DestinationsPeriodAnalyticsChartCard
              key="destinations-period-chart-card"
              destinations_analytics_data={destinations_data}
            />
          ) : (
            <Skeleton
              className="col-span-1 h-[350px] rounded-md"
              key="destinations-period-chart-loading"
            />
          )}
        </>
      ) : null}
    </section>
  );
}
