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
import { crud_get_all_food_types } from "@/lib/curd/food-type";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The food dishes filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  type: string;
  price: number;
}

export default function FoodDishesPageFiltering({
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
      price: 0,
      type: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // method to fetch the food types data
      types: async () => await crud_get_all_food_types({ page: 0, size: 100 }),

      // put here all the methods to fetch the needed data
    },
    false // fetch at first to 'false'
  );

  // sheet open state
  const [open, setOpen] = useState(false);

  // re-fetching if needed
  useEffect(() => {
    // if open is 'true'
    if (!open) return;
    refetch();
  }, [open]);

  return (
    <>
      <Button
        size="sm"
        variant={isFiltered ? "default" : "outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "gap-2 font-normal tex t-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="Food Dishes Filters"
        description="Filter dishes by name ,type and price."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Name of the dish"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <Label id="price">Price</Label>
          <DebouncedInput
            id="price"
            type="number"
            min={0}
            defaultValue={0}
            placeholder="Price of the dish"
            value={Number(filterValues.price)}
            onDebouncedValueChange={(e) => setFilterValue("price", e as string)}
          />
        </div>

        {/* is the needed data isn't fetched or it equals 'null' don't render the component */}
        {data.types ? (
          <div className="flex flex-col gap-2">
            <Label id="type">Type</Label>
            <Select
              value={filterValues.type || "all"}
              onValueChange={(e) => setFilterValue("type", e == "all" ? "" : e)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {data.types.map((type) => (
                  <SelectItem value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </FilteringSheet>
    </>
  );
}
