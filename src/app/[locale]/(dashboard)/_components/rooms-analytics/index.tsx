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
import { RoomAnalyticsInterface } from "@/interfaces/analytics";
import { crud_get_analytics_rooms } from "@/lib/curd/analytics";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineRefresh } from "react-icons/hi";
import { Skeleton } from "@/components/ui/skeleton";
import RoomsReservedAnalyticsChartCard from "./rooms-reserved.chart";
import RoomsNumberAnalyticsChartCard from "./rooms-number.chart";

// The Rooms Analytics Card Component

export default function RoomsAnalyticsCard() {
  //  fetching
  const { data, isFetching, error, refresh } =
    useAnalyticsFetch<RoomAnalyticsInterface>(
      "rooms",
      crud_get_analytics_rooms
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
      aria-label="Rooms Overview"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Rooms Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => refresh()}
                size="icon"
                disabled={!(!isFetching && data)}
                variant="outline"
                aria-label="Refresh rooms data"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh Rooms Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* most reserved rooms bars (with loading skelton) */}
      {!isFetching && data ? (
        <RoomsReservedAnalyticsChartCard
          key="rooms-reserved-chart-card"
          rooms_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[370px] rounded-md"
          key="rooms-reserved-chart-loading"
        />
      )}

      {/* rooms numbers chart (with loading skelton) */}
      {!isFetching && data ? (
        <RoomsNumberAnalyticsChartCard
          key="rooms-number-chart-card"
          rooms_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[370px] rounded-md"
          key="rooms-number-chart-loading"
        />
      )}
    </section>
  );
}
