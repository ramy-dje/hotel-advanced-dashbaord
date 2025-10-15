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
import { JobsAnalyticsInterface } from "@/interfaces/analytics";
import { crud_get_analytics_jobs } from "@/lib/curd/analytics";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineRefresh } from "react-icons/hi";
import { Skeleton } from "@/components/ui/skeleton";
import JobSubmissionsPeriodAnalyticsChartCard from "./job-submissions-period.chart";
import JobSubmissionsNumberAnalyticsChartCard from "./job-submissions-number.chart";

// The Jos Submissions Analytics Card Component

export default function JobsAnalyticsCard() {
  //  fetching
  const { data, isFetching, error, refresh } =
    useAnalyticsFetch<JobsAnalyticsInterface>("jobs", crud_get_analytics_jobs);

  // when error happened
  useEffect(() => {
    if (error) {
      // do something
      toast.error("Fetching Analytics Error");
    }
  }, [error]);
  return (
    <section
      aria-label="Job Submissions Overview"
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* title */}
      <div className="w-full flex items-center justify-between col-span-full mb-2">
        <CardTitle>Job Submissions Overview</CardTitle>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => refresh()}
                size="icon"
                disabled={!(!isFetching && data)}
                variant="outline"
                aria-label="Refresh Job Submissions Analytics"
                className="size-8"
              >
                <HiOutlineRefresh className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              Refresh Job Submissions Analytics
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* job submissions period chart (with loading skelton) */}
      {!isFetching && data ? (
        <JobSubmissionsPeriodAnalyticsChartCard
          key="jobs-period-chart-card"
          job_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[370px] rounded-md"
          key="jobs-period-chart-loading"
        />
      )}

      {/* job submissions numbers chart (with loading skelton) */}
      {!isFetching && data ? (
        <JobSubmissionsNumberAnalyticsChartCard
          key="jobs-number-chart-card"
          job_analytics_data={data}
        />
      ) : (
        <Skeleton
          className="col-span-1 h-[370px] rounded-md"
          key="jobs-number-chart-loading"
        />
      )}
    </section>
  );
}
