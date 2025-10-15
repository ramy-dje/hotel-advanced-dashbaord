"use client";

import { Button } from "@/components/ui/button";
import RoomInterface from "@/interfaces/room.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ViewReservationValidationSchema,
  ViewReservationValidationSchemaType,
} from "./_components/view-form.schema";
import ReservationsInterface, {
  ReservedFloorsRoomsInterface,
} from "@/interfaces/reservations.interface";

import { Skeleton } from "@/components/ui/skeleton";
import { crud_get_room_by_id } from "@/lib/curd/room";
import toast from "react-hot-toast";
import {
  crud_delete_reservation,
  crud_get_all_to_reserve_floors_rooms,
  crud_get_reservation_by_id,
} from "@/lib/curd/reservations";

import ViewReservationForm from "./_components/view-form";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../../../store";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// Completed reservation sheet

export default function ViewCompletedReservationPage({
  setOpen,
  setIsLoading,
}: Props) {
  // access info
  const { has } = useAccess();
  // reservations store hook
  const { remove_reservation, selected_id: selectedReservationId } =
    useReservationsStore();
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationsInterface | null>(null);
  // fetching and loading
  const [firstDataFetchLoading, setFirstDataFetchLoading] = useState(true);
  // trash loading
  const [trash_loading, setTrash_loading] = useState(false);

  // form
  const methods = useForm<ViewReservationValidationSchemaType>({
    resolver: zodResolver(ViewReservationValidationSchema),
    // default values
    defaultValues: {
      rooms_number: 1,
      checked_rooms: [],
      extra_services: [],
    },
    //
    shouldUnregister: false,
  });
  // data
  const [selectedRoom, setSelectedRoom] = useState<RoomInterface | null>(null);
  const [floorsRooms, setFloorsRooms] =
    useState<ReservedFloorsRoomsInterface | null>(null);

  // pricing

  // handle save
  const handleMoveToTrash = async () => {
    if (!selectedReservation) return;
    try {
      // change the status
      setTrash_loading(true);
      await crud_delete_reservation(selectedReservation.id);

      // remove the reservations from the store
      remove_reservation(selectedReservation.id);
      // success
      toast.success("Reservations Was Deleted Successfully");
      setTrash_loading(false);
      setOpen(false);
      return;
    } catch (err) {
      console.log("Err when deleting the reservations");
      toast.error("Something went wrong when deleting the reservation");
    }
  };

  // effects the first data
  useEffect(() => {
    // check the id
    if (!selectedReservationId) {
      // close the sheet
      setOpen(false);
      return;
    }
    // fetch all the needed data
    (async () => {
      setFirstDataFetchLoading(true);
      try {
        // fetch the reservation
        const reservation_res = await crud_get_reservation_by_id(
          selectedReservationId
        );
        // fetch the selected room
        const room = await crud_get_room_by_id(
          reservation_res.reserve.room.id,
          true
        );

        // fetch the room floors of this room
        const floors = await crud_get_all_to_reserve_floors_rooms(
          reservation_res.reserve.room.id
        );

        if (reservation_res && room && floors) {
          // setting the selected room
          setSelectedRoom(room);
          // setting the floors
          if (reservation_res?.checked_data) {
            setFloorsRooms({
              room: floors.room,
              floors: floors.floors.map((floor) => {
                return {
                  ...floor,
                  rooms: floor.rooms.map((room) => {
                    const checked = reservation_res.checked_data?.rooms.find(
                      (e) =>
                        e.floor.id == floor.id && e.room_number == room.number
                    );
                    if (checked)
                      return { number: room.number, reserved: false };
                    else return room;
                  }),
                };
              }) as any,
            });
          } else {
            // setting the floors
            setFloorsRooms(floors);
          }
          // set the reservation
          setSelectedReservation(reservation_res);
        } else {
          throw "Reservation Not Found";
        }
      } catch (err) {
        setOpen(false);
        toast.error("Something went wrong when fetching the data");
      }
      setFirstDataFetchLoading(false);
    })();
  }, []);

  // update the form old data when the reservation has been fetched
  useEffect(() => {
    if (selectedReservation && selectedRoom) {
      // person data
      methods.setValue("person_email", selectedReservation.person.email);
      methods.setValue("person_fullName", selectedReservation.person.fullName);
      methods.setValue("person_country", selectedReservation.person.country);
      methods.setValue("person_state", selectedReservation.person?.state);
      methods.setValue("person_city", selectedReservation.person?.city || "");
      methods.setValue(
        "person_gender",
        selectedReservation.person.gender || "male"
      );
      methods.setValue("person_note", selectedReservation.person?.note);
      methods.setValue(
        "person_zipcode",
        selectedReservation.person?.zipcode || ""
      );
      methods.setValue(
        "person_phoneNumber",
        selectedReservation.person.phoneNumber[0]
      );
      methods.setValue(
        "person_phoneNumber2",
        selectedReservation.person.phoneNumber[1] || ""
      );
      // hour
      methods.setValue(
        "start_hour",
        selectedReservation.reserve.start_hour || "12:00PM"
      );
      // capacity
      methods.setValue(
        "capacity_adults",
        selectedReservation.reserve.capacity.adults
      );
      methods.setValue(
        "capacity_children",
        selectedReservation.reserve.capacity.children
      );
      // extra services
      methods.setValue(
        "extra_services",
        selectedReservation.reserve.extra_services
          .map((serve) => {
            const full = selectedRoom.extra_services.find(
              (e) => e.id == serve.service
            )!;
            if (!full) return null;
            return {
              guests: serve.guests,
              id: full.id,
              name: full.name,
              price: full.price,
            };
          })
          .filter((e) => e !== null) as {
          guests: number;
          id: string;
          name: string;
          price: number;
        }[]
      );

      // rooms number
      methods.setValue(
        "rooms_number",
        selectedReservation.reserve.rooms_number
      );
      // setting the check in and out
      methods.setValue("check_in", selectedReservation.reserve.check_in);
      methods.setValue("check_out", selectedReservation.reserve.check_out);
      // room
      // methods.setValue("room_id",);
      // checked_rooms
      if (selectedReservation?.checked_data) {
        methods.setValue(
          "checked_rooms",
          selectedReservation.checked_data.rooms.map((room) => {
            const full = floorsRooms?.floors.find(
              (f) => f.id == room.floor.id
            )!;
            return {
              floor: room.floor.id,
              name: full.title,
              room_number: room.room_number,
            };
          })
        );
      }
      // set the checked data
      // setting the floors
      if (selectedReservation?.checked_data && floorsRooms) {
        setFloorsRooms({
          room: floorsRooms.room,
          floors: floorsRooms.floors.map((floor) => {
            return {
              ...floor,
              rooms: floor.rooms.map((room) => {
                const checked = selectedReservation.checked_data?.rooms.find(
                  (e) => e.floor.id == floor.id && e.room_number == room.number
                );
                if (checked) return { number: room.number, reserved: false };
                else return room;
              }),
            };
          }) as any,
        });
      } else {
        // setting the floors
        setFloorsRooms(floorsRooms);
      }
    }
  }, [selectedReservation]);

  // set the disabled
  useEffect(() => {
    setIsLoading(trash_loading);
    // set the disable form state manuel
    methods.control._disableForm(trash_loading);
  }, [trash_loading]);

  return (
    <div className="w-full h-full grid grid-rows-12 py-4 pb-10 gap-4">
      {/* section 1 */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-12 rounded-xl" />
      ) : (
        <div className="w-full row-span-12 flex justify-between gap-4">
          {/* from */}
          <div className="w-[100%] p-1 h-full border rounded-lg">
            <div className="w-full p-3 h-full overflow-hidden overflow-y-scroll sm-scrollbar">
              <FormProvider {...methods}>
                <ViewReservationForm room={selectedRoom as any} />
              </FormProvider>
            </div>
          </div>
        </div>
      )}
      {/* action bar */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-5 rounded-xl px-4 py-2 md:px-5 lg:px-6 3xl:px-8 4xl:px-10" />
      ) : (
        <div className="w-full flex row-span-1 items-center justify-between gap-2 bg-background py-2">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <span className="text-xs text-foreground">
                Extra Services: {selectedReservation?.pricing.extra_services}DA
              </span>
              <span className="text-xs text-foreground">
                Rooms: {selectedReservation?.pricing.rooms}DA
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground/80">
              {selectedReservation?.pricing.total}DA
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Rendered with the permission */}
            {has(["reservation-status:update"]) ? (
              <Button
                disabled={methods.formState.disabled}
                isLoading={trash_loading}
                onClick={() => handleMoveToTrash()}
                type="button"
                variant="outline"
                className="gap-2 font-normal disabled:opacity-50 border-destructive hover:bg-transparent bg-transparent hover:text-destructive text-destructive"
                size="sm"
              >
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
