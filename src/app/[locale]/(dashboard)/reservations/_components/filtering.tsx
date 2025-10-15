import { DebouncedInput } from "@/components/debounced-input";
import FilteringSheet from "@/components/filtering-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFiltering from "@/hooks/use-filtering";
import { ReservationStatusType } from "@/interfaces/reservations.interface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string; // person name
  status: ReservationStatusType | "";
  ref_id: string; // reservation id
}

export default function ReservationsPageFiltering({
  filters,
  setFilters,
}: Props) {
  const {
    isFiltered,
    filterValues,
    setFilterValue,
    handleClear,
    handleApplyFilters,
  } = useFiltering<FiltersType>({
    defaultValues: {
      name: "",
      status: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // sheet open state
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant={isFiltered ? "default" : "outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "gap-2 font-normal text-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="Reservations Filters"
        description="Filter reservations by the reserver name and status."
        open={open}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        {/* person name */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Person Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Name"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        {/* reservation id */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="ref">Reservation ID</Label>
          <DebouncedInput
            id="ref"
            placeholder="e.x HOTEL-23453-250129-250130-A1B2C3D4"
            value={filterValues.ref_id}
            onDebouncedValueChange={(e) =>
              setFilterValue("ref_id", e as string)
            }
          />
        </div>
        {/* status */}
        <div className="flex flex-col gap-2">
          <Label id="status">Reservation Status</Label>
          <Select
            value={filterValues.status || "all"}
            onValueChange={(e) => setFilterValue("status", e == "all" ? "" : e)}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {/* pending */}
              <SelectItem
                key={"pending"}
                value={"pending"}
                className="text-yellow-500"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <span className="size-3 block bg-yellow-500 rounded-full" />{" "}
                  Pending
                </div>
              </SelectItem>
              {/* approved */}
              <SelectItem
                key={"approved"}
                value={"approved"}
                className="text-green-500"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <span className="size-3 block bg-green-500 rounded-full" />{" "}
                  Approved
                </div>
              </SelectItem>
              {/* completed */}
              <SelectItem
                key={"completed"}
                value={"completed"}
                className="text-blue-500"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <span className="size-3 block bg-blue-500 rounded-full" />{" "}
                  Completed
                </div>
              </SelectItem>
              {/* canceled */}
              <SelectItem
                key={"canceled"}
                value={"canceled"}
                className="text-gray-500"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <span className="size-3 block bg-gray-500 rounded-full" />{" "}
                  Canceled
                </div>
              </SelectItem>
              {/* archived */}
              <SelectItem
                key={"archived"}
                value={"deleted"}
                className="text-red-500"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <span className="size-3 block bg-red-500 rounded-full" />{" "}
                  Archived
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilteringSheet>
    </>
  );
}
