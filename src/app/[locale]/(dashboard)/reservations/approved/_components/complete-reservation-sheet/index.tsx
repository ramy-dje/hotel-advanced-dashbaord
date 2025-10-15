"use client";

import { Button } from "@/components/ui/button";
import RoomInterface, {
  LightweightRoomInterface,
} from "@/interfaces/room.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  CompleteApprovedReservationValidationSchema,
  CompleteApprovedReservationValidationSchemaType,
} from "./_components/update-form.schema";
import ReservationsInterface, {
  ReservedFloorsRoomsInterface,
} from "@/interfaces/reservations.interface";

import { Skeleton } from "@/components/ui/skeleton";
import {
  crud_get_all_lightweight_rooms,
  crud_get_room_by_id,
} from "@/lib/curd/room";
import toast from "react-hot-toast";
import {
  crud_get_all_to_reserve_floors_rooms,
  crud_get_reservation_by_id,
  crud_update_reservation,
  crud_update_reservation_check_data,
  crud_update_reservation_status,
} from "@/lib/curd/reservations";

import CompleteApprovedReservationFloorsBoard from "./_components/floors-board";
import CompletedApprovedReservationPricing from "./_components/pricing";
import CompleteApprovedReservationForm from "./_components/update-form";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../../../store";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// Complete approved reservation sheet

export default function CompleteApprovedReservationPage({
  setOpen,
  setIsLoading,
}: Props) {
  // access info
  const { has } = useAccess();
  // reservations store hook
  // selected Reservation Id from the store
  const {
    update_reservation,
    change_many_reservations_status,
    selected_id: selectedReservationId,
  } = useReservationsStore();
  // state
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationsInterface | null>(null);
  // fetching and loading
  const [firstDataFetchLoading, setFirstDataFetchLoading] = useState(true);
  const [fetchingRoomData, setFetchingRoomData] = useState(false);
  // complete & saving loading states
  const [save_loading, setSave_loading] = useState(false);
  const [complete_loading, setComplete_loading] = useState(false);

  // form
  const methods = useForm<CompleteApprovedReservationValidationSchemaType>({
    resolver: zodResolver(CompleteApprovedReservationValidationSchema),
    // default values
    defaultValues: {
      rooms_number: 1,
      capacity_adults: 1,
      capacity_children: 0,
      checked_rooms: [],
      country: "Algeria",
      state: "",
      zipcode: "",
      city: "",
      extra_services: [],
    },
    //
    shouldUnregister: false,
  });
  // data
  const [lightweightRooms, setLightweightRooms] = useState<
    LightweightRoomInterface[] | null
  >(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomInterface | null>(null);
  const [floorsRooms, setFloorsRooms] =
    useState<ReservedFloorsRoomsInterface | null>(null);

  // pricing

  // room controller
  const roomId = useWatch({
    control: methods.control,
    name: "room_id",
  });

  // checked data watcher
  const checked_data = useWatch({
    control: methods.control,
    name: "checked_rooms",
  });
  // handle save
  const handleComplete = async (type: "complete" | "save") => {
    if (!selectedReservation) return;
    // clear the errors
    methods.clearErrors();
    // manual checking & trigger
    const check = await methods.trigger();
    if (!check) {
      return;
    }
    // set the loading as the type of the creation
    if (type == "complete") {
      setComplete_loading(true);
    } else if (type == "save") {
      setSave_loading(true);
    }

    // complete or saving logic
    const data: CompleteApprovedReservationValidationSchemaType =
      methods.getValues();

    // in the save type check if the checked data has been added
    if (type == "save") {
      if (data.checked_rooms.length != data.rooms_number) {
        methods.setError("room_id", {
          message:
            "Select the rooms as the rooms number to complete the approvement",
        });
        setSave_loading(false);
        return;
      }
    }

    try {
      // approve the reservation if the create type is approve
      if (type == "complete") {
        // change the status to completed
        await crud_update_reservation_status(
          selectedReservation.id,
          "completed"
        );
        // change the status
        change_many_reservations_status([selectedReservation.id], "completed");
      } else if (type == "save") {
        // updating the reservation
        const reservation = await crud_update_reservation(
          selectedReservation?.id,
          {
            person: {
              email: data.person_email,
              fullName: data.person_fullName,
              country: data.country || "",
              gender: data.gender,
              state: data.state || "",
              city: data.city,
              note: data.note || "",
              zipcode: data.zipcode,
              phoneNumber: [
                data.person_phoneNumber,
                ...(data.person_phoneNumber2 ? [data.person_phoneNumber2] : []),
              ],
            },
            check_in: data.check_in,
            check_out: data.check_out,
            start_hour: data.start_hour,
            capacity: {
              adults: data.capacity_adults || 1,
              children: data.capacity_children || 0,
            },
            room_id: data.room_id,
            rooms_number: data.rooms_number,
            extra_services: data.extra_services.map((e) => ({
              guests: e.guests,
              service: e.id,
            })),
          }
        );
        // update the checked data
        await crud_update_reservation_check_data(reservation.id, {
          rooms: data.checked_rooms.map((e) => ({
            floor: e.floor,
            room_number: e.room_number,
          })),
        });
        // update the reservation in the store
        update_reservation(reservation.id, reservation);
      }

      // remove the loading
      if (type == "complete") {
        setComplete_loading(false);
        toast.success("Reservation Marked As Completed Successfully");
      } else if (type == "save") {
        setSave_loading(false);
        toast.success("Reservation changes saved successfully");
      }
      setOpen(false);
      return;
    } catch (err) {
      console.log("Err when updating the reservations");
      toast.error("Something went wrong when updating the reservation");
    }

    // remove the loading
    if (type == "complete") {
      setComplete_loading(false);
    } else if (type == "save") {
      setSave_loading(false);
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
        // fetch the rooms
        const lightweightRooms = await crud_get_all_lightweight_rooms({
          page: 0,
          size: 9999,
        });
        // fetch the selected room
        const room = await crud_get_room_by_id(
          reservation_res.reserve.room.id,
          true
        );

        // fetch the room floors of this room
        const floors = await crud_get_all_to_reserve_floors_rooms(
          reservation_res.reserve.room.id
        );

        if (lightweightRooms && reservation_res && room && floors) {
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
          // setting the lightweight rooms
          setLightweightRooms(lightweightRooms);
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

  // fetch the room when the selected Room gets changed
  useEffect(() => {
    // see if the old id is still selected
    if (selectedRoom && roomId == selectedRoom.id) return;
    if (roomId) {
      // fetching the selected room
      (async () => {
        setFetchingRoomData(true);
        try {
          // fetch the selected room
          const room = await crud_get_room_by_id(roomId, true);

          // fetch the room floors of this room
          const floors = await crud_get_all_to_reserve_floors_rooms(roomId);

          if (room && floors) {
            // setting the selected room
            setSelectedRoom(room);
            // setting the floors
            // check if the reserved room is belongs to this reservation to remove the reserved
            // setting the floors
            if (checked_data) {
              setFloorsRooms({
                room: floors.room,
                floors: floors.floors.map((floor) => {
                  return {
                    ...floor,
                    rooms: floor.rooms.map((room) => {
                      const checked = checked_data?.find(
                        (e) =>
                          e.floor == floor.id && e.room_number == room.number
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
            // set the room number
          }
        } catch (err) {
          toast.error("Something went wrong when fetching the data");
        }
        setFetchingRoomData(false);
      })();
      // reset the room checked and services
      methods.setValue("extra_services", []);
      methods.setValue("checked_rooms", []);
    }
  }, [roomId]);

  // update the form old data when the reservation has been fetched
  useEffect(() => {
    if (setOldData) {
      setOldData();
    }
  }, [selectedReservation]);

  // set the disabled
  useEffect(() => {
    setIsLoading(save_loading || complete_loading || fetchingRoomData);
    // set the disable form state manuel
    methods.control._disableForm(
      fetchingRoomData || save_loading || complete_loading
    );
  }, [save_loading, fetchingRoomData, complete_loading]);

  // set the old data
  const setOldData = useCallback(() => {
    if (selectedReservation && selectedRoom) {
      // person data
      methods.setValue("person_email", selectedReservation.person.email);
      methods.setValue("person_fullName", selectedReservation.person.fullName);
      methods.setValue("country", selectedReservation.person.country);
      methods.setValue("state", selectedReservation.person?.state);
      methods.setValue("city", selectedReservation.person?.city);
      methods.setValue("gender", selectedReservation.person.gender || "male");
      methods.setValue("note", selectedReservation.person?.note);
      methods.setValue("zipcode", selectedReservation.person?.zipcode);
      // hour
      methods.setValue(
        "start_hour",
        selectedReservation.reserve.start_hour || "12:00PM"
      );
      methods.setValue(
        "person_phoneNumber",
        selectedReservation.person.phoneNumber[0]
      );
      methods.setValue(
        "person_phoneNumber2",
        selectedReservation.person.phoneNumber[1] || ""
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
        selectedReservation.reserve.rooms_number || 1
      );
      // room
      methods.setValue("room_id", selectedReservation.reserve.room.id);
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
      // check in and out
      methods.setValue("old_check", {
        in: new Date(selectedReservation.reserve.check_in),
        out: new Date(selectedReservation.reserve.check_out),
      });
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

  return (
    <div className="w-full h-full grid grid-rows-12 py-4 pb-10 gap-4">
      {/* section 1 */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-12 rounded-xl" />
      ) : (
        <div className="w-full overflow-hidden overflow-y-auto lg:overflow-y-hidden row-span-12 flex flex-col lg:flex-row justify-between gap-4">
          {/* from */}
          <div className="w-full lg:w-[50%] p-1 lg:h-full border rounded-lg">
            <div className="w-full p-3 h-auto lg:h-full lg:overflow-hidden lg:overflow-y-scroll lg:sm-scrollbar">
              <FormProvider {...methods}>
                <CompleteApprovedReservationForm
                  room={selectedRoom}
                  lightweightRooms={lightweightRooms}
                />
              </FormProvider>
            </div>
          </div>
          {/* calendar */}
          <div className="w-full lg:w-[50%] p-1 rounded-xl bg-muted/20 border-border border">
            {!fetchingRoomData && !selectedRoom ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="text-base text-foreground select-none">
                  Select a room
                </span>
              </div>
            ) : (
              <></>
            )}
            {fetchingRoomData ? (
              <div className="w-full h-full flex justify-center items-center">
                <div className="size-8 border-4 border-primary/20 duration-700 ease-in-out border-t-primary rounded-full animate-spin mt-4" />
              </div>
            ) : (
              <CompleteApprovedReservationFloorsBoard
                floorsRooms={floorsRooms}
                control={methods.control}
              />
            )}
          </div>
        </div>
      )}
      {/* action bar */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-5 rounded-xl px-4 py-2 md:px-5 lg:px-6 3xl:px-8 4xl:px-10" />
      ) : (
        <div className="w-full flex row-span-1 items-center justify-between gap-2 bg-background pt-4 lg:py-2 border-t lg:border-none">
          <CompletedApprovedReservationPricing
            room={selectedRoom}
            control={methods.control}
          />
          <div className="flex items-center gap-2">
            <Button
              disabled={methods.formState.disabled}
              onClick={() => setOldData()}
              type="button"
              variant="outline"
              size="sm"
            >
              {/* reset */}
              Reset
            </Button>
            {/* the buttons are rendered with the needed permissions */}

            <Button
              disabled={methods.formState.disabled}
              isLoading={save_loading}
              onClick={() => handleComplete("save")}
              type="button"
              variant="outline"
              size="sm"
            >
              Save
            </Button>

            {has(["reservation-status:update"]) ? (
              <Button
                onClick={() => handleComplete("complete")}
                disabled={methods.formState.disabled || !checked_data.length}
                type="button"
                isLoading={complete_loading}
                size="sm"
              >
                Complete
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
