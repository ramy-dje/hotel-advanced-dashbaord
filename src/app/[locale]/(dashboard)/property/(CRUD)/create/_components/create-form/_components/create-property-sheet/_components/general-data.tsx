import { Control, useWatch } from "react-hook-form";
import { CreateReservationValidationSchemaType } from "./create-form.schema";
import RoomInterface from "@/interfaces/room.interface";
import { useMemo } from "react";
import {
  ExtraServicePriceCalculator,
  RoomsPriceCalculator,
} from "@/lib/reservations";

interface Props {
  control: Control<CreateReservationValidationSchemaType>;
  room: RoomInterface | null;
}


export default function CreateFloorsGeneralData(
  // { control, room }: Props
){
  // extra services watcher
  // const extraServices = useWatch({
  //   control,
  //   name: "extra_services",
  // });

  // // rooms number watcher
  // const roomsNumber = useWatch({
  //   control,
  //   name: "rooms_number",
  // });

  // // check in watcher
  // const checkIn = useWatch({
  //   control,
  //   name: "check_in",
  // });

  // // check out watcher
  // const checkOut = useWatch({
  //   control,
  //   name: "check_out",
  // });

  // // total price

  // // total extra services
  // const total_extra_services = useMemo(() => {
  //   // if the room doesn't exist extra services are empty or  doesn't exist or even the check in and out
  //   if (!room || !room.extra_services.length || !extraServices.length) {
  //     return 0;
  //   }
  //   // calc the extra services
  //   return ExtraServicePriceCalculator(
  //     extraServices.map((e) => ({ guests: e.guests, service: e.id })),
  //     room.extra_services
  //   );
  // }, [extraServices, room, checkIn, checkOut]);

  // // total rooms
  // const total_rooms = useMemo(() => {
  //   // if the room doesn't exist or the check in and out are not valid
  //   if (!room || !checkIn || !checkOut || !roomsNumber) {
  //     return 0;
  //   }
  //   // calc the rooms
  //   return RoomsPriceCalculator(
  //     {
  //       in: checkIn,
  //       out: checkOut,
  //     },
  //     room.price,
  //     roomsNumber,
  //     room.default_price
  //   );
  // }, [roomsNumber, room, checkIn, checkOut]);

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col">
        <span className="text-xs text-foreground">
          Total Floors: 0
        </span>
        <span className="text-xs text-foreground">Total Rooms: 0</span>
      </div>
      {/* <h3 className="text-2xl font-bold text-foreground/80">
        {0 + 0}DA
      </h3> */}
    </div>
  );
}
