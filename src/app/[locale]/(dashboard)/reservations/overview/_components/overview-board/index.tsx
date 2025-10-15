import { ReservableRoomInterface } from "@/interfaces/room.interface";
import RoomCard from "./components/room-card";

// The Overview page's board

interface Props {
  rooms: ReservableRoomInterface[];
}

// overview board components
export default function OverviewBoard({ rooms }: Props) {
  return (
    <ul className="w-full flex flex-wrap items-baseline gap-4">
      {/* wrapping the rooms */}
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </ul>
  );
}
