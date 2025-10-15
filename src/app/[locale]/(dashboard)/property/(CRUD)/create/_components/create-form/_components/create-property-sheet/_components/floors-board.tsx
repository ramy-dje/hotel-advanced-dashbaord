"use client";
import { Control, useController, useWatch } from "react-hook-form";
import { CreateReservationValidationSchemaType } from "./create-form.schema";
import { ReservedFloorsRoomsInterface } from "@/interfaces/reservations.interface";
import {
  ReserveFloorBoard,
  ReserveFloorBoardFloor,
  ReserveFloorBoardFloorDoor,
} from "@/components/reserve-floors-board";
import { useEffect } from "react";

interface Props {
  control: Control<CreateReservationValidationSchemaType>;
  floorsRooms: ReservedFloorsRoomsInterface | null;
}

// The create reservation floors board

export default function CreateReservationFloorsBoard({
  control,
  floorsRooms,
}: Props) {
  // checked_rooms data
  const rooms_number = useWatch({
    control,
    name: "rooms_number",
  });

  // checked_rooms data
  const checked_rooms_controller = useController({
    control,
    name: "checked_rooms",
  });

  // when the room-number gets changed
  useEffect(() => {
    if (!checked_rooms_controller.field.value || !rooms_number) return;

    const res: number =
      checked_rooms_controller.field.value.length - rooms_number;
    // remove the selected rooms as the number
    if (Math.floor(res) >= 1) {
      const clone = checked_rooms_controller.field.value;
      Array.from({ length: Math.floor(res) }).forEach(() => {
        clone.pop();
      });
      checked_rooms_controller.field.onChange(clone);
    }
  }, [rooms_number]);

  // handle check
  const handleCheckDoor = (floor: string, number: number) => {
    const isSelected = checked_rooms_controller.field.value.find(
      (e) => e.room_number == number && e.floor == floor
    );
    // unselect it if it's selected
    if (isSelected) {
      checked_rooms_controller.field.onChange(
        checked_rooms_controller.field.value.filter(
          (s) => s.floor + s.room_number != floor + number
        )
      );
      return;
    }
    const doors = checked_rooms_controller.field.value.length;
    const selectedFloor = floorsRooms?.floors.find((e) => e.id == floor)!;
    if (!selectedFloor) return;
    if (doors < rooms_number) {
      checked_rooms_controller.field.onChange([
        ...checked_rooms_controller.field.value,
        {
          room_number: number,
          floor: floor,
          name: selectedFloor.title,
        },
      ]);
    }
  };

  return (
    <>
      <ReserveFloorBoard className="h-full p-1 sm-scrollbar overflow-hidden overflow-y-auto flex flex-col gap-4">
        {floorsRooms
          ? floorsRooms.floors.map((floor) => (
              <ReserveFloorBoardFloor
                key={floor.id}
                floorName={floor.title}
                levelNumber={floor.level}
              >
                {floor.rooms
                  .filter((e) => !e.reserved)
                  .map((room) => (
                    <ReserveFloorBoardFloorDoor
                      selected={(() => {
                        return !!checked_rooms_controller.field.value.find(
                          (e) =>
                            e.room_number == room.number && e.floor == floor.id
                        );
                      })()}
                      onClick={() => handleCheckDoor(floor.id, room.number)}
                      key={room.number + floor.id}
                      selectable={
                        !(
                          rooms_number ==
                          checked_rooms_controller.field.value.length
                        )
                      }
                      number={room.number}
                      reserved={room.reserved}
                    />
                  ))}
              </ReserveFloorBoardFloor>
            ))
          : null}
      </ReserveFloorBoard>
    </>
  );
}
