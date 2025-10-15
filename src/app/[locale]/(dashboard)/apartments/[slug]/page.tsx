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
import { crud_get_room_by_id } from "@/lib/curd/room";
import RoomInterface from "@/interfaces/room.interface";
import RoomShow from "./_components/room-details";

interface Props {
  params: {
    slug: string;
  };
}
export default function FloorsPage({ params: { slug } }: Props) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [room, setRoom] = useState<RoomInterface | null>(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFetchingData(true);
    // if the slug isn't valid
    if (!slug) {
      router.replace("/rooms");
    } else {
      // fetching the room data
      (async () => {
        try {
          // fetching room
          const room = await crud_get_room_by_id(slug, true);

          if (room) {
            // setting the room
            setRoom(room);
          }
        } catch (err) {
          if (err == 404) {
            setNotFound(true);
            toast.error("Room Not Found");
          }
          toast.error("Something went wrong when fetching the data");
          router.replace("/rooms");
        }
        setIsFetchingData(false);
      })();
    }
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
              {!isFetchingData && room?.title ? (
                room.title
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
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/rooms">Rooms</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {/* <BreadcrumbPage>Create Room</BreadcrumbPage> */}
                  <BreadcrumbPage>
                    {!isFetchingData && room?.title ? (
                      room.title
                    ) : (
                      <Skeleton className="h-3 w-[8em] rounded-none" />
                    )}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && room ? (
          <RoomShow room={room} />
        ) : !room && notFound ? (
          <div className="w-full flex flex-col justify-center items-center text-center ">
            <h4 className="text-[5em] font-bold text-primary">404</h4>
            <span className="text-sm text-foreground">ROOM NOT FOUND</span>
          </div>
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
