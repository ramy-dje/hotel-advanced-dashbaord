"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useRouter } from "@/i18n/routing";
import { crud_get_all_to_reserve_floors_rooms } from "@/lib/curd/reservations";
import useFetch from "@/hooks/use-filtering-fetch";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RoomOverviewFloorsBoard from "./_components/floors-board";
import Image from "next/image";

// The Reservation Room Overview Page

export default function ReservationRoomOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  // fetch the room's floors data
  const { data, isFetching, refetch, error } = useFetch(
    {
      room_floors: async () =>
        await crud_get_all_to_reserve_floors_rooms<true>(params.id || "", true),
    },
    false // to trigger the fetching manually
  );

  // router
  const router = useRouter();

  //
  useEffect(() => {
    // if there no id
    if (!params?.id) {
      router.replace("/reservations/overview");
      return;
    }
    // trigger the fetching
    refetch();
  }, []);

  // if error happened
  useEffect(() => {
    if (error) {
      // redirect to the overview page
      router.replace("/reservations/overview");
    }
  }, [error]);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <div className="flex items-start gap-3">
              {/* room image */}
              {!isFetching && data.room_floors?.details.title ? (
                <Image
                  alt={data.room_floors?.details.title || ""}
                  src={data.room_floors?.details.images_main || ""}
                  width={200}
                  height={100}
                  loading="lazy"
                  className="size-14 min-h-14 min-w-14 object-cover object-left rounded-md bg-muted select-none"
                />
              ) : (
                <Skeleton className="size-14 min-h-14 min-w-14 rounded-md" />
              )}
              <div className="flex flex-col gap-1">
                <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
                  {!isFetching && data.room_floors?.details.title ? (
                    <>{data.room_floors?.details.title} Overview</>
                  ) : (
                    <Skeleton className="h-7 w-[8em] rounded-none" />
                  )}
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
                    <BreadcrumbItem>Reservations</BreadcrumbItem>
                    <BreadcrumbSeparator
                      children={
                        <span className="size-1 block rounded-full bg-muted-foreground/50" />
                      }
                    />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/reservations/overview">Overview</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator
                        children={
                          <span className="size-1 block rounded-full bg-muted-foreground/50" />
                        }
                      />
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {!isFetching && data.room_floors?.details.title ? (
                          <>{data.room_floors?.details.title} Overview</>
                        ) : (
                          <Skeleton className="h-3 w-[8em] rounded-none" />
                        )}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </PageLayoutHeaderNameAndBreadcrumbs>
          {/* action here if needed */}
        </PageLayoutHeader>
        {/* page content */}
        {!isFetching && data.room_floors ? (
          <RoomOverviewFloorsBoard floors={data.room_floors.floors} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3.5em] rounded-lg" />
            <Skeleton className="w-[3.8em] h-[1.5em] rounded-full" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
              {Array.from({ length: 20 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-[10em] rounded-xl" />
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </>
  );
}
