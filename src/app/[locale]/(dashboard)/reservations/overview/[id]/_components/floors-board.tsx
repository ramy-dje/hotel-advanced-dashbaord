import {
  ReserveFloorBoard,
  ReserveFloorBoardFloor,
  ReserveFloorBoardFloorDoorStatic,
} from "@/components/reserve-floors-board";
import { ReservedFloorsRoomsInterface } from "@/interfaces/reservations.interface";

// The reservations room overview floors board

interface Props {
  floors: ReservedFloorsRoomsInterface<true>["floors"];
}

export default function RoomOverviewFloorsBoard({ floors }: Props) {
  return (
    <section className="">
      <ReserveFloorBoard className="h-full w-full p-1 flex flex-col gap-4">
        {floors.map((floor) => (
          <ReserveFloorBoardFloor
            key={floor.id}
            variant="modern"
            rooms_range_start={floor.room_range.start}
            rooms_range_end={floor.room_range.end}
            floors_range_start={floor.range_start}
            floors_range_end={floor.range_end}
            floorName={floor.title}
            responsive_door
            levelNumber={floor.level}
          >
            {floor.rooms.map((room) => (
              <ReserveFloorBoardFloorDoorStatic
                className="h-[10em]"
                key={room.number + floor.id}
                number={room.number}
                reserved={room.reserved}
                reservation_id={room.reservation_id}
                start_date={room.check?.in || undefined}
                end_date={room.check?.out || undefined}
              />
            ))}
          </ReserveFloorBoardFloor>
        ))}
      </ReserveFloorBoard>
    </section>
  );
}
