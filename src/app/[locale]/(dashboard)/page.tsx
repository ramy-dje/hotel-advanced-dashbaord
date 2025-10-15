"use client";

import useAccess from "@/hooks/use-access";
import ArticlesAnalyticsCard from "./_components/articles-analytics";
import JobsAnalyticsCard from "./_components/job-submissions.analytics";
import ReservationsAnalyticsCard from "./_components/reservations-analytics";
import RoomsAnalyticsCard from "./_components/rooms-analytics";

export default function Home() {
  const { has } = useAccess();

  return (
    <div className="w-full flex flex-col gap-8">
      {/* reservations analytics part (With Permissions) */}
      {has(["analytics_reservations:read"]) ? (
        <ReservationsAnalyticsCard />
      ) : null}
      {/* rooms analytics part (With Permissions) */}
      {has(["analytics_rooms:read"]) ? <RoomsAnalyticsCard /> : null}
      {/* Jobs analytics part (With Permissions) */}
      {has(["analytics_jobs:read"]) ? <JobsAnalyticsCard /> : null}
      {/* blogs & destinations analytics part (With Permissions) */}
      {has(["analytics_blogs:read"]) || has(["analytics_destinations:read"]) ? (
        <ArticlesAnalyticsCard />
      ) : null}
    </div>
  );
}
