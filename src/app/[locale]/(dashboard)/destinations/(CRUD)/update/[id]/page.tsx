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
import { Link, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DestinationInterface from "@/interfaces/destination.interface";
import { crud_get_destination_by_id } from "@/lib/curd/destination";
import UpdateDestinationFrom from "./_components/update-form";

export default function UpdateDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  // selected destination
  const [oldDestination, setOldDestination] =
    useState<DestinationInterface | null>(null);
  // router
  const router = useRouter();

  useEffect(() => {
    // if there no selected id
    if (!params?.id) {
      router.replace("/destinations");
      return;
    }
    // fetching the destination
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the blog
        const destination = await crud_get_destination_by_id(params.id);

        if (destination) {
          // setting the destination
          setOldDestination(destination);
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        router.replace("/destinations");
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
              Update Destination
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
                <BreadcrumbItem>Destinations</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Destination</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && oldDestination ? (
          <UpdateDestinationFrom oldDestination={oldDestination} />
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
