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
import useFilteringFetch from "@/hooks/use-filtering-fetch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The seasons filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  repeatType: string;
  isActive: string;
}

export default function SeasonFiltering({ filters, setFilters }: Props) {
  const {
    isFiltered,
    filterValues,
    setFilterValue,
    handleClear,
    handleApplyFilters,
  } = useFiltering<FiltersType>({
    defaultValues: {
      name: "",
      repeatType: "",
      isActive: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // No need for fetching data for seasons filtering
  const { isFetching } = useFilteringFetch({}, false);

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
        title="Season Filters"
        description="Filter seasons by name, code, repeat type and status."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        {/* Season Name */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Season Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Search by season name"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        

        {/* Repeat Type */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="repeatType">Repeat Type</Label>
          <Select
            value={filterValues.repeatType || "all"}
            onValueChange={(e) =>
              setFilterValue("repeatType", e === "all" ? "" : e)
            }
          >
            <SelectTrigger id="repeatType" className="w-full">
              <SelectValue placeholder="Select a repeat type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Never">Never</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Is Active */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="isActive">Status</Label>
          <Select
            value={filterValues.isActive || "all"}
            onValueChange={(e) =>
              setFilterValue("isActive", e)
            }
          >
            <SelectTrigger id="isActive" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilteringSheet>
    </>
  );
}
