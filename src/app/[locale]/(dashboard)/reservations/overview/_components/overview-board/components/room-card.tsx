import LimitedText from "@/components/limited-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReservableRoomInterface } from "@/interfaces/room.interface";
import { HiCalendar, HiOutlineExternalLink } from "react-icons/hi";
import Image from "next/image";
import { Link } from "@/i18n/routing";

// the reservation overview room card component

export default function RoomCard({ room }: { room: ReservableRoomInterface }) {
  return (
    <Card className="w-full md:w-[20em] lg:w-[22em] xl:w-[23em] 2xl:w-[20em] h-max max-h-[35em] rounded-xl p-4 transition-all duration-300 hover:bg-muted/30 hover:shadow-lg hover:scale-[1.01]">
      {/* image container */}
      <div className="relative w-full h-[13em] select-none overflow-hidden rounded-lg mb-4">
        <Image
          width={220}
          height={170}
          loading="lazy"
          placeholder="blur"
          alt={room.title}
          src={room.images_main}
          blurDataURL={room.images_main}
          className="w-full h-full rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* content container */}

      <div className="w-full space-y-2 mb-4">
        {/* room name */}
        <div className="flex items-start justify-between">
          <Link href={`/reservations/overview/${room.id}`}>
            <h3 className="text-xl font-semibold text-foreground leading-tight transition-colors hover:text-primary">
              <LimitedText limit={40}>{room.title}</LimitedText>
            </h3>
          </Link>
        </div>

        {/* reservations count */}
        <div className="flex items-center gap-2 text-foreground/90 mt-2">
          <HiCalendar className="w-5 h-5 text-primary" />
          <span className="font-medium">Total Reservations:</span>
          <Badge className="py-0.5 px-3 rounded-full text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/10">
            {room.reservations}
          </Badge>
        </div>

        {/* floors section */}
        <div className="py-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Floors
          </p>
          <div className="flex gap-2 flex-wrap max-h-[4.5rem] overflow-hidden relative">
            {room.floors.slice(0, 2).map((floor) => (
              <Badge
                variant="outline"
                key={floor.id}
                className="gap-1 py-1 px-3 text-xs font-medium rounded-full"
              >
                <span className="text-primary">{floor.name}</span>{" "}
                {floor.range_start}-{floor.range_end}
              </Badge>
            ))}
            {room.floors.length > 2 && (
              <Badge
                variant="outline"
                className="gap-1 py-1 px-3 text-xs font-medium rounded-full"
              >
                +{room.floors.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* button */}
      <Button
        asChild
        size="sm"
        variant="secondary"
        className="w-full gap-2 border"
      >
        <Link href={`/reservations/overview/${room.id}`}>
          View Room Reservations
          <HiOutlineExternalLink className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
