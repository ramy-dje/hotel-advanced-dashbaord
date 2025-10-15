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
import FloorInterface from "@/interfaces/floor.interface";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import RoomIncludesInterface from "@/interfaces/room-includes.interface";
import RoomTypeInterface from "@/interfaces/room-type.interface";
import { crud_get_all_floors } from "@/lib/curd/floors";
import { crud_get_all_roomBeds } from "@/lib/curd/room-beds";
import { crud_get_all_roomCategory } from "@/lib/curd/room-categories";
import { crud_get_all_roomFeatures } from "@/lib/curd/room-features";
import { crud_get_all_roomIncludes } from "@/lib/curd/room-includes";
import { crud_get_all_roomTypes } from "@/lib/curd/room-types";
import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import CreateRoomFrom from "./_components/create-form";
import { crud_get_all_roomExtraServices } from "@/lib/curd/room-extra-services";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";

export default function FloorsPage() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [roomFeaturesFormData, setRoomFeaturesFormData] = useState<{
    features: RoomFeatureInterface[];
    includes: RoomIncludesInterface[];
    types: RoomTypeInterface[];
    extra_services: RoomExtraServiceInterface[];
    categories: RoomCategoryInterface[];
    beds: RoomBedInterface[];
    floors: FloorInterface[];
  }>({
    features: [],
    beds: [],
    categories: [],
    floors: [],
    includes: [],
    extra_services: [],
    types: [],
  });

  useEffect(() => {
    // fetching the room features which're needed for the creation room
    (async () => {
      setIsFetchingData(true);
      try {
        const room_categories = await crud_get_all_roomCategory({
          page: 0,
          size: 100,
        });
        const room_features = await crud_get_all_roomFeatures({
          page: 0,
          size: 100,
        });
        const room_beds = await crud_get_all_roomBeds({
          page: 0,
          size: 100,
        });
        const room_types = await crud_get_all_roomTypes({
          page: 0,
          size: 100,
        });
        const floors = await crud_get_all_floors({
          page: 0,
          size: 100,
        });
        const includes = await crud_get_all_roomIncludes({
          page: 0,
          size: 100,
        });
        const extra_services = await crud_get_all_roomExtraServices({
          page: 0,
          size: 100,
        });

        if (
          room_categories &&
          room_features &&
          room_beds &&
          room_types &&
          floors &&
          extra_services &&
          includes
        ) {
          setRoomFeaturesFormData({
            beds: room_beds,
            categories: room_categories,
            features: room_features,
            floors: floors,
            includes: includes,
            extra_services: extra_services,
            types: room_types,
          });
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
              Create Room
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
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/rooms">Rooms</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Room</BreadcrumbPage>
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
          <CreateRoomFrom formSelectData={roomFeaturesFormData} />
        )}
      </PageLayout>
    </>
  );
}
