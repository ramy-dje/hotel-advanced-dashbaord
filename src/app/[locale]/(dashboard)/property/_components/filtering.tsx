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
import { crud_get_all_propertyTypes } from "@/lib/curd/property-types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  country: string;
  type: string;
}

export default function PropertiesPageFiltering({ filters, setFilters }: Props) {
  const {
    isFiltered,
    filterValues,
    setFilterValue,
    handleClear,
    handleApplyFilters,
  } = useFiltering<FiltersType>({
    defaultValues: {
      name: "",
      country: "",
      type: "",
    },
    filters,
    setFilters,
  });

  // fetch property types and countries
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      types: async () =>
        await crud_get_all_propertyTypes({ page: 0, size: 100 }),
      // countries: async () =>
      //   await crud_get_all_countries({ page: 0, size: 250 }),
    },
    false
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

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

      <FilteringSheet
        title="Property Filters"
        description="Filter properties by name, country, and type."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Property name</Label>
          <DebouncedInput
            id="name"
            placeholder="Name"
            value={filterValues.name}
            onDebouncedValueChange={(val) =>
              setFilterValue("name", val as string)
            }
          />
        </div>
        {data.types && (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="type">Property type</Label>
            <Select
              value={filterValues.type || "all"}
              onValueChange={(val) =>
                setFilterValue("type", val === "all" ? "" : val)
              }
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              
            </Select>
          </div>
        )}
      </FilteringSheet>
    </>
  );
}
