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
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
// import CreateRoomFrom from "./_components/create-form";
import { crud_get_all_roomExtraServices } from "@/lib/curd/room-extra-services";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";
import JobDepartmentInterface from "@/interfaces/job-department.interface";
import { crud_get_all_job_departments } from "@/lib/curd/job-department";
import CreateJobFrom from "./_components/create-form";

export default function CreateJobPage() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [departmentData, setDepartmentData] = useState<
    JobDepartmentInterface[]
  >([]);

  useEffect(() => {
    // fetching the job departments which's needed for the creation of the job
    (async () => {
      setIsFetchingData(true);
      try {
        const job_departments = await crud_get_all_job_departments({
          page: 0,
          size: 100,
        });

        if (job_departments) {
          setDepartmentData(job_departments);
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
      }
      setIsFetchingData(false);
    })();
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
              Create Position
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
                <BreadcrumbItem>Jobs</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Position</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {isFetchingData ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        ) : (
          <CreateJobFrom formSelectData={{ departmentData }} />
        )}
      </PageLayout>
    </>
  );
}
