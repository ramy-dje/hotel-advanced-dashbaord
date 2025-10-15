"use client";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { CompleteApprovedReservationValidationSchemaType } from "./update-form.schema";
import RoomInterface, {
  LightweightRoomInterface,
} from "@/interfaces/room.interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiExclamation, HiOutlineCalendar, HiOutlineX } from "react-icons/hi";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { startHoursArray } from "@/lib/data";

interface Props {
  lightweightRooms: LightweightRoomInterface[] | null;
  room: RoomInterface | null;
}

// Complete reservation form
export default function CompleteApprovedReservationForm({
  lightweightRooms,
  room,
}: Props) {
  const {
    formState: { disabled, errors },
    register,
    setValue,
    getValues,
    control,
  } = useFormContext<CompleteApprovedReservationValidationSchemaType>();

  // watch the rooms number
  const rooms_number = useWatch({
    control,
    defaultValue: 1,
    name: "rooms_number",
  });

  // check in and out state
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // gender controller
  const genderController = useController({
    control,
    name: "gender",
    defaultValue: "male",
  });

  // start hour controller
  const hourController = useController({
    control,
    name: "start_hour",
    defaultValue: "12:00PM",
  });

  // old check watcher
  const old_check = useWatch({
    control,
    name: "old_check",
  });

  //  room controller
  const roomController = useController({
    control,
    name: "room_id",
  });

  // extra services data
  const extraServicesController = useController({
    control,
    name: "extra_services",
  });

  // checked_rooms data
  const checked_rooms_controller = useController({
    control,
    name: "checked_rooms",
  });

  // max room capacity info
  const room_capacity = useMemo(() => {
    if (!room || !room.capacity) return { children: 0, adults: 0 };
    return {
      children: room.capacity.children * (rooms_number || 1),
      adults: room.capacity.adults * (rooms_number || 1),
    };
  }, [room, rooms_number]);

  // extra service select
  const [extraServiceSelect, setExtraServiceSelect] = useState<string>("");
  // extra service guests input ref
  const extraServiceGuestsInputRef = useRef<HTMLInputElement>(null);

  // update the check in & check out when the date state gets changed
  useEffect(() => {
    setValue("check_in", date?.from as any);
    setValue("check_out", date?.to as any);
  }, [date]);

  // set the old check in and check out
  useEffect(() => {
    if (old_check?.in && old_check?.out) {
      setDate({
        from: old_check.in,
        to: old_check.out,
      });
    }
  }, [old_check]);

  // handles the capacity changes
  useEffect(() => {
    if (!room) return;
    // check if the user has change the room with different room
    // adults
    if (room.capacity.adults < Number(getValues("capacity_adults") || 1)) {
      setValue("capacity_adults", 1);
    }
    //  children
    if (room.capacity.children < Number(getValues("capacity_children") || 0)) {
      setValue("capacity_children", 0);
    }
  }, [room, rooms_number]);

  // Methods

  // handle add service
  const handleAddService = () => {
    if (!room?.extra_services) return;
    if (
      extraServiceGuestsInputRef.current?.value &&
      Number(extraServiceGuestsInputRef.current?.value) &&
      extraServiceSelect &&
      Number(extraServiceGuestsInputRef.current?.value) >= 1
    ) {
      const guests = Number(extraServiceGuestsInputRef.current?.value);
      const selectedService = room.extra_services.find(
        (e) => e.id == extraServiceSelect
      )!;
      extraServicesController.field.onChange([
        ...extraServicesController.field.value,
        {
          id: selectedService.id,
          price: selectedService.price,
          name: selectedService.name,
          guests: guests,
        },
      ]);
      // resetting the
      extraServiceGuestsInputRef.current.value = 0 as any;
      setExtraServiceSelect("");
    }
  };

  // handle remove service
  const handleRemoveService = (id: string) => {
    extraServicesController.field.onChange(
      extraServicesController.field.value.filter((n) => n.id !== id)
    );
  };

  // handle remove selected room
  const handleRemoveSelectedRoom = (floor_and_number: string) => {
    checked_rooms_controller.field.onChange(
      checked_rooms_controller.field.value.filter(
        (s) => s.floor + s.room_number != floor_and_number
      )
    );
  };

  return (
    <div className="w-full divide-y divide-dashed divide-border">
      {/* Sections */}

      {/* Person info */}
      <div className="grid mb-5 gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full ">
          <h4 className="text-base font-semibold leading-5">
            Personal information
          </h4>
        </div>
        {/* full name */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            type="text"
            disabled={disabled}
            placeholder="Full name"
            {...register("person_fullName", { required: true })}
          />
          {errors?.person_fullName ? (
            <InlineAlert type="error">
              {errors.person_fullName.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* gender selector */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(e) => genderController.field.onChange(e)}
            value={genderController.field.value}
          >
            <SelectTrigger disabled={disabled} id="gender" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors?.gender ? (
            <InlineAlert type="error">{errors.gender.message}</InlineAlert>
          ) : null}
        </div>
        {/* email */}
        <div className="flex flex-col col-span-full gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            disabled={disabled}
            placeholder="Email"
            {...register("person_email", { required: true })}
          />
          {errors?.person_email ? (
            <InlineAlert type="error">
              {errors.person_email.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* locations */}
        {/* country */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            disabled={disabled}
            placeholder="Country"
            {...register("country", { required: true })}
          />
          {errors?.country ? (
            <InlineAlert type="error">{errors.country.message}</InlineAlert>
          ) : null}
        </div>
        {/* state */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            disabled={disabled}
            placeholder="State"
            {...register("state", { required: true })}
          />
          {errors?.state ? (
            <InlineAlert type="error">{errors.state.message}</InlineAlert>
          ) : null}
        </div>
        {/* city */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            disabled={disabled}
            placeholder="City"
            {...register("city", { required: true })}
          />
          {errors?.city ? (
            <InlineAlert type="error">{errors.city.message}</InlineAlert>
          ) : null}
        </div>
        {/* zipcode */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="zipcode">ZipCode</Label>
          <Input
            id="zipcode"
            type="text"
            disabled={disabled}
            placeholder="Zipcode"
            {...register("zipcode", { required: true })}
          />
          {errors?.zipcode ? (
            <InlineAlert type="error">{errors.zipcode.message}</InlineAlert>
          ) : null}
        </div>
        {/* phone Number */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="phone">Phone 1</Label>
          <Input
            id="phone"
            type="text"
            disabled={disabled}
            placeholder="0123456789"
            {...register("person_phoneNumber", { required: true })}
          />
          {errors?.person_phoneNumber ? (
            <InlineAlert type="error">
              {errors.person_phoneNumber.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* phone Number */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="phone2">Phone 2</Label>
          <Input
            id="phone2"
            type="text"
            disabled={disabled}
            placeholder="0123456789"
            {...register("person_phoneNumber2", { required: false })}
          />
          {errors?.person_phoneNumber2 ? (
            <InlineAlert type="error">
              {errors.person_phoneNumber2.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* note */}
        <div className="flex flex-col col-span-full gap-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            disabled={disabled}
            className="resize-none h-12"
            placeholder="Note"
            {...register("note", { required: true })}
          />
          {errors?.note ? (
            <InlineAlert type="error">{errors.note.message}</InlineAlert>
          ) : null}
        </div>
      </div>

      {/* Room Info */}
      <div className="grid mb-5 pt-4 gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full">
          <h4 className="text-base font-semibold leading-5">
            Room Information
          </h4>
        </div>
        {/* rooms */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="room">Room</Label>
          <Select
            onValueChange={(e) => roomController.field.onChange(e)}
            value={roomController.field.value}
          >
            <SelectTrigger
              disabled={disabled}
              id="room"
              className="w-full flex gap-2 items-center"
            >
              <SelectValue placeholder="Choose Room" />
            </SelectTrigger>
            <SelectContent>
              {lightweightRooms
                ? lightweightRooms.map((room, idx, { length }) => (
                    <SelectItem
                      value={room.id}
                      key={room.id}
                      className={cn(
                        "flex gap-1 items-center",
                        room.deleted && "bg-red-500/5",
                        idx != length - 1 && "mb-1"
                      )}
                    >
                      {room.title}{" "}
                      {room.deleted ? (
                        <span className="text-xs ml-1 text-red-500 font-semibold">
                          Deleted
                        </span>
                      ) : null}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
          {errors?.room_id ? (
            <InlineAlert type="error">{errors.room_id.message}</InlineAlert>
          ) : null}
        </div>
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="roomsnumber">Rooms Number</Label>
          <Input
            disabled={disabled}
            id="roomsnumber"
            type="number"
            placeholder="Number"
            min={1}
            {...register("rooms_number", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors?.rooms_number ? (
            <InlineAlert type="error">
              {errors.rooms_number.message}
            </InlineAlert>
          ) : null}
        </div>
        {/* if the room is deleted warning */}
        {room && room.deleted ? (
          <div className="col-span-full">
            <InlineAlert type="warning" className="flex gap-2 items-start">
              <HiExclamation className="min-w-5 size-5 mr-1" />
              Please be aware, this room is marked as deleted and is currently
              in the trash. If it gets permanently deleted, this reservation and
              all related reservations will also be removed.
            </InlineAlert>
          </div>
        ) : null}
        {/* selected rooms tags */}
        <div className="w-full flex flex-wrap items-center col-span-full gap-2">
          {checked_rooms_controller.field.value.map((room) => (
            <Badge
              key={room.floor + room.room_number}
              variant="outline"
              className="rounded-full gap-2 text-sm font-normal"
            >
              {room.name} {room.room_number}
              <button
                onClick={() =>
                  handleRemoveSelectedRoom(room.floor + room.room_number)
                }
                type="button"
                disabled={disabled}
                className="text-foreground/60 hover:text-foreground/100"
              >
                <HiOutlineX className="size-4" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Reservation Info */}
      <div className="grid mb-5 pt-4 gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full">
          <h4 className="text-base font-semibold leading-5">
            Reservation Information
          </h4>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 col-span-full gap-4">
          {/* start hour selector */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="hour">Hour</Label>
            <Select
              onValueChange={(e) => hourController.field.onChange(e)}
              value={hourController.field.value}
            >
              <SelectTrigger disabled={disabled} id="hour" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {startHoursArray.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.start_hour ? (
              <InlineAlert type="error">
                {errors.start_hour.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* check in , check out */}
          <div className="flex flex-col gap-2 col-span-2 lg:col-span-3">
            <Label htmlFor="check-piker">Check in & check out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start gap-2 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <HiOutlineCalendar className="size-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[99999]" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors?.check_in || errors?.check_out ? (
              <InlineAlert type="error">
                {errors.check_in?.message} {errors.check_out?.message}
              </InlineAlert>
            ) : null}
          </div>
        </div>

        {/* capacity */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="adults">Adults</Label>
          <Input
            id="adults"
            min={1}
            type="number"
            defaultValue={1}
            max={room_capacity.adults}
            disabled={disabled || !room}
            placeholder="Adults number"
            {...register("capacity_adults", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors?.capacity_adults ? (
            <InlineAlert type="error">
              {errors.capacity_adults.message}
            </InlineAlert>
          ) : null}
        </div>

        {/* room capacity children */}
        <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="children">Children</Label>
          <Input
            id="children"
            min={0}
            defaultValue={0}
            type="number"
            max={room_capacity.children}
            disabled={disabled || !room}
            placeholder="Children number"
            {...register("capacity_children", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors?.capacity_children ? (
            <InlineAlert type="error">
              {errors.capacity_children.message}
            </InlineAlert>
          ) : null}
        </div>

        {room ? (
          <div className="block w-full text-sm col-span-full text-primary font-semibold">
            Maximum capacity for selected room(s):{" "}
            <span className="text-blue-800 dark:text-blue-300">
              {room_capacity.adults} Adults
            </span>
            ,{" "}
            <span className="text-blue-800 dark:text-blue-300">
              {room_capacity.children} Children
            </span>
          </div>
        ) : null}

        {/* Extra Services */}
        <div className="w-full flex flex-col lg:flex-row items-start col-span-full gap-4">
          <div className="w-full lg:w-5/5 flex flex-col gap-2">
            <Label htmlFor="extra-services">Extra Services</Label>
            <Select
              value={extraServiceSelect}
              onValueChange={(e) => setExtraServiceSelect(e)}
            >
              <SelectTrigger
                disabled={disabled || !room?.extra_services}
                id="extra-services"
                className="w-full"
              >
                <SelectValue placeholder="Choose service" />
              </SelectTrigger>
              <SelectContent>
                {room?.extra_services
                  ? room?.extra_services.map((service) => (
                      <SelectItem
                        disabled={(() => {
                          return extraServicesController.field.value
                            .map((e) => e.id)
                            .includes(service.id);
                        })()}
                        key={service.id}
                        value={service.id}
                      >
                        {service.name} {service.price}DA
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-2/5 flex flex-col gap-2">
            <Label htmlFor="guests">Guests</Label>
            <Input
              id="guests"
              min={1}
              defaultValue={1}
              ref={extraServiceGuestsInputRef}
              type="number"
              disabled={disabled || !room?.extra_services}
              placeholder="Guests"
            />
          </div>

          <Button
            onClick={handleAddService}
            disabled={disabled || !room?.extra_services}
            className="w-full lg:w-2/5 mt-auto"
          >
            Add Service
          </Button>
        </div>
        {/* extra services tags */}
        <div className="w-full flex flex-wrap items-center col-span-full gap-2">
          {extraServicesController.field.value.map((service) => (
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
              <button
                onClick={() => handleRemoveService(service.id)}
                type="button"
                disabled={disabled}
                className="text-foreground/60 hover:text-foreground/100"
              >
                <HiOutlineX className="size-4" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
