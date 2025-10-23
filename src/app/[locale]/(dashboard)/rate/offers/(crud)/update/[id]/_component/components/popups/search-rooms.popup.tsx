"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { forwardRef, useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa6";

// Define Room and Rate types for better type safety and readability
interface Room {
  name: string;
  isOpen: boolean;
  rates: string[];
}

const initialRooms: Room[] = [
  {
    name: "Room 1",
    isOpen: false,
    rates: ["Rate A", "Rate B"],
  },
  {
    name: "Room 2",
    isOpen: false,
    rates: ["Rate C"],
  },
  {
    name: "Deluxe Suite",
    isOpen: false,
    rates: ["Rate D", "Rate E"],
  },
];

const SearchRoomsPopup = forwardRef(
  (
    { selectedRooms, setSelectedRooms }: any, // Consider defining a more specific type for selectedRooms
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>(initialRooms); // Use initialRooms for the initial state
    const [searchTerm, setSearchTerm] = useState("");

    // Use useMemo for filteredRooms to prevent re-calculation on every render
    const filteredRooms = useMemo(() => {
      const term = searchTerm.toLowerCase().trim();
      if (term === "") {
        return rooms;
      }
      return rooms.filter((room) => room.name.toLowerCase().includes(term));
    }, [searchTerm, rooms]); // Depend on searchTerm and rooms

    // Debounce logic for search term (already good, but keeping it for completeness)
    useEffect(() => {
      const timeout = setTimeout(() => {
        // The filtering logic is now inside useMemo, so no need to set filteredRooms state here
        // This useEffect is now primarily for API calls if you were fetching rooms.
      }, 2000);
      return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Memoize these functions to prevent unnecessary re-renders of child components
    const isRoomSelected = useCallback(
      (roomName: string) => {
        return selectedRooms.some((r: any) => r.name === roomName);
      },
      [selectedRooms],
    );

    const isRateSelected = useCallback(
      (roomName: string, rate: string) => {
        const room = selectedRooms.find((r: any) => r.name === roomName);
        return room ? room.rates.includes(rate) : false;
      },
      [selectedRooms],
    );

    const handleSelectRoom = useCallback(
      (room: Room) => {
        setSelectedRooms((prev: any) => {
          if (isRoomSelected(room.name)) {
            return prev.filter((r: any) => r.name !== room.name);
          } else {
            return [...prev, { name: room.name, rates: [...room.rates] }];
          }
        });
      },
      [isRoomSelected, setSelectedRooms],
    );

    const handleSelectRate = useCallback(
      (roomName: string, rate: string) => {
        setSelectedRooms((prev: any) => {
          const room = prev.find((r: any) => r.name === roomName);
          if (room) {
            const updatedRates = room.rates.includes(rate)
              ? room.rates.filter((r: any) => r !== rate)
              : [...room.rates, rate];

            if (updatedRates.length === 0) {
              return prev.filter((r: any) => r.name !== roomName);
            }

            return prev.map((r: any) =>
              r.name === roomName ? { ...r, rates: updatedRates } : r,
            );
          } else {
            return [...prev, { name: roomName, rates: [rate] }];
          }
        });
      },
      [setSelectedRooms],
    );

    const handleRemoveChip = useCallback(
      (roomName: string, rate?: string) => {
        if (rate) {
          handleSelectRate(roomName, rate);
        } else {
          handleSelectRoom({ name: roomName, isOpen: false, rates: [] }); // isOpen added for type consistency
        }
      },
      [handleSelectRate, handleSelectRoom],
    );

    // Optimized handleToggleRoom to only update the specific room's isOpen status
    const handleToggleRoom = useCallback((index: number) => {
      setRooms((prevRooms) =>
        prevRooms.map((room, i) =>
          i === index ? { ...room, isOpen: !room.isOpen } : room,
        ),
      );
    }, []);

    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button
            className="gap-2 font-normal w-1/2 md:w-auto"
            variant="default"
            ref={ref}
          >
            <HiOutlineSearch className="size-4" />
            Search rooms
          </Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>Search rooms</DialogTitle>
            <DialogDescription>
              <div className="relative mt-3 mb-4">
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 size-5" />
              </div>

              {/* Selected Chips */}
              <div className="flex flex-wrap gap-2">
                {selectedRooms.map((room: any, i: number) =>
                  room.rates.map((rate: string, j: number) => (
                    <Badge
                      key={`${i}-${j}`}
                      variant="outline"
                      className="rounded-full gap-2 text-sm font-normal"
                    >
                      {room.name} – {rate}
                      <button
                        onClick={() => handleRemoveChip(room.name, rate)}
                        className="ml-1 text-black hover:text-red-600"
                      >
                        <HiOutlineX className="size-4" />
                      </button>
                    </Badge>
                  )),
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Rooms List */}
          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {filteredRooms.map((room, index) => (
              <div
                key={room.name} // Use a stable key like room.name if unique, or a unique ID from your data
                className={`border p-3 rounded-lg transition-all cursor-pointer ${
                  isRoomSelected(room.name)
                    ? "bg-white border-primary"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Room Name & Select Checkbox */}
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleSelectRoom(room)}
                  >
                    <Checkbox checked={isRoomSelected(room.name)} />
                    <p className="font-medium text-sm text-gray-800">
                      {room.name}
                    </p>
                  </div>

                  {/* Rate Toggle Icon (Expand/Collapse) */}
                  <FaAngleDown
                    className={`size-4 text-muted-foreground cursor-pointer transition-transform ${
                      room.isOpen ? "rotate-180" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      handleToggleRoom(index); // Use the optimized handler
                    }}
                  />
                </div>

                {room.isOpen && (
                  <div className="pl-6 pt-3 flex flex-col gap-2">
                    {room.rates.map((rate, i) => (
                      <div
                        key={rate} // Use rate as key if unique within a room, otherwise roomName-rate
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={isRateSelected(room.name, rate)}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() =>
                            handleSelectRate(room.name, rate)
                          }
                        />
                        <p className="text-sm">{rate}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="default"
                className="w-full sm:w-1/2"
              >
                Create
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-1/2"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default SearchRoomsPopup;
