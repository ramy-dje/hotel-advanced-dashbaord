"use client";

import { Button } from "@/components/ui/button";
import RoomInterface, {
  LightweightRoomInterface,
} from "@/interfaces/room.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  FormProvider,
  useController,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  CreateReservationValidationSchema,
  CreateReservationValidationSchemaType,
} from "./_components/create-form.schema";
import { ReservedFloorsRoomsInterface } from "@/interfaces/reservations.interface";

import { Skeleton } from "@/components/ui/skeleton";
import {
  crud_get_all_lightweight_rooms,
  crud_get_room_by_id,
} from "@/lib/curd/room";
import toast from "react-hot-toast";
import {
  crud_create_reservation,
  crud_get_all_to_reserve_floors_rooms,
  crud_update_reservation_check_data,
  crud_update_reservation_status,
} from "@/lib/curd/reservations";
import CreateReservationFloorsBoard from "./_components/floors-board";
import CreateReservationPricing from "./_components/pricing";
import CreateReservationForm from "./_components/create-form";
import useAccess from "@/hooks/use-access";
import useReservationsStore from "../../../store";

interface Props {
  open: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// create reservation sheet

export default function CreateReservationPage({
  setOpen,
  setIsLoading,
}: Props) {
  // access info
  const { has } = useAccess();
  // reservations store hook
  const { add_reservation } = useReservationsStore();
  // fetching and loading
  const [firstDataFetchLoading, setFirstDataFetchLoading] = useState(true);
  const [fetchingRoomData, setFetchingRoomData] = useState(false);
  // creating & saving loading states
  const [save_and_approve_loading, setSave_and_approve_loading] =
    useState(false);
  const [save_loading, setSave_loading] = useState(false);
  // form
  const methods = useForm<CreateReservationValidationSchemaType>({
    resolver: zodResolver(CreateReservationValidationSchema),
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
  const roomController = useController({
    control: methods.control,
    name: "room_id",
  });

  // checked data watcher
  const checked_data = useWatch({
    control: methods.control,
    name: "checked_rooms",
  });

  // handle save
  const handleCreate = async (type: "approve" | "save") => {
    // clear the errors
    methods.clearErrors();

    // manual checking & trigger
    const check = await methods.trigger();
    if (!check) {
      return;
    }
    // set the loading as the type of the creation
    if (type == "approve") {
      setSave_and_approve_loading(true);
    } else if (type == "save") {
      setSave_loading(true);
    }

    // create logic
    const data: CreateReservationValidationSchemaType = methods.getValues();

    // in the approve type check if the checked data has been added
    if (type == "approve") {
      if (data.checked_rooms.length != data.rooms_number) {
        methods.setError("room_id", {
          message:
            "Select the rooms as the rooms number to complete the approvement",
        });
        setSave_and_approve_loading(false);
        return;
      }
    }

    try {
      // creating the reservation
      const new_reservations = await crud_create_reservation({
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
      });

      // approve the reservation if the create type is approve
      if (type == "approve") {
        // update the reservations check object
        const check = await crud_update_reservation_check_data(
          new_reservations.id,
          {
            rooms: data.checked_rooms.map((e) => ({
              floor: e.floor,
              room_number: e.room_number,
            })),
          }
        );
        // change the status
        await crud_update_reservation_status(new_reservations.id, "approved");
        // add the created reservations store reservations with approved status
        add_reservation({
          ...new_reservations,
          process: { ...new_reservations.process, status: "approved" },
        });
      } else {
        // add the created reservations store reservations
        add_reservation(new_reservations);
      }

      // remove the loading
      if (type == "approve") {
        setSave_and_approve_loading(false);
      } else if (type == "save") {
        setSave_loading(false);
      }
      setOpen(false);
      toast.success("Reservation created successfully");
      return;
    } catch (err) {
      console.log("Err when creating the reservations");
      toast.error("Something went wrong when creating the reservation");
    }

    // remove the loading
    if (type == "approve") {
      setSave_and_approve_loading(false);
    } else if (type == "save") {
      setSave_loading(false);
    }
  };

  // effects the first data
  useEffect(() => {
    // fetching the lightweight rooms
    (async () => {
      setFirstDataFetchLoading(true);
      try {
        const lightweightRooms = await crud_get_all_lightweight_rooms({
          page: 0,
          size: 9999,
        });

        if (lightweightRooms) {
          // setting the lightweight rooms
          setLightweightRooms(lightweightRooms);
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
      }
      setFirstDataFetchLoading(false);
    })();
  }, []);

  // fetch the room when the selected Room gets changed
  useEffect(() => {
    if (roomController.field.value) {
      // fetching the selected room
      (async () => {
        setFetchingRoomData(true);
        try {
          // fetch the selected room
          const room = await crud_get_room_by_id(
            roomController.field.value,
            true
          );

          // fetch the room floors of this room
          const floors = await crud_get_all_to_reserve_floors_rooms(
            roomController.field.value
          );

          if (room && floors) {
            // setting the selected room
            setSelectedRoom(room);
            // setting the floors
            setFloorsRooms(floors);
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
  }, [roomController.field.value]);

  // set the disabled
  useEffect(() => {
    setIsLoading(save_loading || save_and_approve_loading);
    methods.control._disableForm(
      fetchingRoomData || save_loading || save_and_approve_loading
    );
  }, [fetchingRoomData, save_and_approve_loading, save_loading]);

  return (
    <div className="w-full h-full grid grid-rows-12 py-4 pb-10 gap-4">
      {/* section 1 */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-12 rounded-xl" />
      ) : (
        <div className="w-full overflow-hidden overflow-y-auto lg:overflow-y-hidden row-span-12 flex flex-col lg:flex-row justify-between gap-4">
          {/* from */}
          <div className="w-full lg:min-w-[50%] lg:w-[100%] p-1 lg:h-full border rounded-lg">
            <div className="w-full p-3 h-auto lg:h-full lg:overflow-hidden lg:overflow-y-scroll lg:sm-scrollbar">
              <FormProvider {...methods}>
                <CreateReservationForm
                  room={selectedRoom}
                  lightweightRooms={lightweightRooms}
                />
              </FormProvider>
            </div>
          </div>
          {/* calendar */}
          {has(["reservation-status:update"]) ? (
            <div className="w-full lg:min-w-max p-1 rounded-xl bg-muted/20 border-border border">
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
                <CreateReservationFloorsBoard
                  floorsRooms={floorsRooms}
                  control={methods.control}
                />
              )}
            </div>
          ) : null}
        </div>
      )}
      {/* action bar */}
      {firstDataFetchLoading ? (
        <Skeleton className="w-full row-span-5 rounded-xl px-4 py-2 md:px-5 lg:px-6 3xl:px-8 4xl:px-10" />
      ) : (
        <div className="w-full flex row-span-1 items-center justify-between gap-2 bg-background pt-4 lg:py-2 border-t lg:border-none">
          <CreateReservationPricing
            room={selectedRoom}
            control={methods.control}
          />
          <div className="flex items-center gap-2">
            <Button
              disabled={methods.formState.disabled}
              isLoading={save_loading}
              onClick={() => handleCreate("save")}
              type="button"
              variant="outline"
              size="sm"
            >
              {/* Save as draft */}
              Save
            </Button>
            {/* approving reservation button needs permissions */}
            {has(["reservation-status:update"]) ? (
              <Button
                onClick={() => handleCreate("approve")}
                disabled={methods.formState.disabled || !checked_data.length}
                type="button"
                isLoading={save_and_approve_loading}
                size="sm"
              >
                Approve & Save
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
