"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { ViewReservationValidationSchemaType } from "./view-form.schema";
import RoomInterface from "@/interfaces/room.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { startHoursArray } from "@/lib/data";

interface Props {
  room: RoomInterface;
}

// View reservation form
export default function ViewReservationForm({ room }: Props) {
  const { getValues, control } =
    useFormContext<ViewReservationValidationSchemaType>();

  const check_in = useWatch({
    control,
    name: "check_in",
  });

  const check_out = useWatch({
    control,
    name: "check_out",
  });

  // extra services data
  const extraServices = useWatch({
    control,
    name: "extra_services",
  });

  // checked_rooms data
  const checked_rooms = useWatch({
    control,
    name: "checked_rooms",
  });

  return (
    <div className="w-full divide-y divide-dashed divide-border">
      {/* Sections */}

      {/* Person info */}
      <div className="grid mb-5 gap-2 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full ">
          <h4 className="text-base font-semibold text-primary leading-5">
            Personal information
          </h4>
        </div>
        {/* full name */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Full Name :{" "}
            <span
              title={getValues("person_fullName")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_fullName")}
            </span>
          </div>
        </div>
        {/* gender */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Gender :{" "}
            <span
              title={getValues("person_gender")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_gender") == "male" ? "Male" : "Female"}
            </span>
          </div>
        </div>
        {/* Country */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Country :{" "}
            <span
              title={getValues("person_country")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_country")}
            </span>
          </div>
        </div>
        {/* State */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            State :{" "}
            <span
              title={getValues("person_state")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_state")}
            </span>
          </div>
        </div>
        {/* City */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            City :{" "}
            <span
              title={getValues("person_city")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_city") || "/"}
            </span>
          </div>
        </div>
        {/* Zip code */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            ZipCode :{" "}
            <span
              title={getValues("person_zipcode")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_zipcode") || "/"}
            </span>
          </div>
        </div>
        {/* email */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Email :{" "}
            <span
              title={getValues("person_email")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_email")}
            </span>
          </div>
        </div>
        {/* phone Number */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Phone 1 :{" "}
            <span
              title={getValues("person_phoneNumber")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_phoneNumber")}
            </span>
          </div>
        </div>
        {/* phone Number */}
        <div className="flex col-span-full">
          <div className="font-normal flex gap-2">
            Phone 2 :{" "}
            <span
              title={getValues("person_phoneNumber2")}
              className="font-semibold line-clamp-3"
            >
              {getValues("person_phoneNumber2") || "/"}
            </span>
          </div>
        </div>
        {/* Note */}
        <div className="flex col-span-full">
          <div className="font-normal gap-2">
            Note :{" "}
            <span title={getValues("person_note")} className="font-semibold">
              {getValues("person_note") || "/"}
            </span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="grid mb-5 pt-4 gap-2 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full">
          <h4 className="text-base font-semibold text-primary leading-5">
            Room Information
          </h4>
        </div>
        {/* rooms */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Room :{" "}
            <span title={room?.title} className="font-semibold line-clamp-3">
              {room?.title}
            </span>
          </div>
        </div>

        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Rooms Number :{" "}
            <span
              title={getValues("rooms_number") + ""}
              className="font-semibold line-clamp-3"
            >
              {getValues("rooms_number")}
            </span>
          </div>
        </div>
        {/* selected rooms tags */}
        {checked_rooms.length > 0 ? (
          <>
            <div className="col-span-full">
              <p className="font-normal">Rooms :</p>
            </div>
            <div className="w-full flex flex-wrap items-center col-span-full gap-2">
              {checked_rooms.map((room) => (
                <Badge
                  key={room.floor + room.room_number}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {room.name} {room.room_number}
                </Badge>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Reservation Info */}
      <div className="grid mb-5 pt-4 gap-2 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full">
          <h4 className="text-base font-semibold text-primary leading-5">
            Reservation Information
          </h4>
        </div>
        {/* capacity */}

        {/* check in , check out */}
        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Check In :{" "}
            <span
              title={format(new Date(check_in || 0), "LLL dd, y")}
              className="font-semibold line-clamp-3"
            >
              {format(new Date(check_in || 0), "LLL dd, y")}
            </span>
          </div>
        </div>

        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Check Out :{" "}
            <span
              title={format(new Date(check_out || 0), "LLL dd, y")}
              className="font-semibold line-clamp-3"
            >
              {format(new Date(check_out || 0), "LLL dd, y")}
            </span>
          </div>
        </div>

        {/* Start Hour */}
        <div className="flex col-span-full">
          <div className="font-normal flex gap-2">
            Start Hour :{" "}
            <span
              title={getValues("start_hour")}
              className="font-semibold line-clamp-3"
            >
              {
                startHoursArray.find((e) => e.value == getValues("start_hour"))!
                  ?.title
              }
            </span>
          </div>
        </div>

        {/* room capacity adults & children */}

        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Adults :{" "}
            <span
              title={getValues("capacity_adults") + ""}
              className="font-semibold line-clamp-3"
            >
              {getValues("capacity_adults")}
            </span>
          </div>
        </div>

        <div className="flex col-span-full">
          <div className="font-normal flex items-center gap-2">
            Children :{" "}
            <span
              title={getValues("capacity_children") + ""}
              className="font-semibold line-clamp-3"
            >
              {getValues("capacity_children")}
            </span>
          </div>
        </div>

        {/* Extra Services */}
        {extraServices.length > 0 ? (
          <>
            <div className="w-full flex flex-col lg:flex-row items-start col-span-full gap-4">
              <div className="w-full flex flex-col col-span-full gap-2">
                <p className="font-normal">Extra Services :</p>
              </div>
              {/* extra services tags */}
            </div>
            <div className="w-full flex flex-wrap items-center col-span-full gap-2">
              {extraServices.map((service) => (
                <Badge
                  key={service.id}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {service.name}
                  {" ("}
                  {service.price}
                  {" X "}
                  {service.guests}
                  {")"}
                </Badge>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
