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
import { crud_get_all_rate_categories } from "@/lib/curd/rate-category";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The rate filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name?: string;
  code?: string;
  category?: string;
  rateType?: string;
  isActive?: string;
  mealPlanCode?: string;
  season?: string;
  sortBy?: 'rateName';
  sortOrder?: 'asc' | 'desc';
}

export default function RateOverviewFiltering({ filters, setFilters }: Props) {
  const {
    isFiltered,
    filterValues,
    setFilterValue,
    handleClear,
    handleApplyFilters,
  } = useFiltering<FiltersType>({
    defaultValues: {
      name: "",
      category: "",
      rateType: "",
      isActive: "",
      mealPlanCode: "",
      season: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // method to fetch the categories data
      categories: async () =>
        await crud_get_all_rate_categories({ page: 0, size: 100 }),
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
          "gap-2 font-normal text-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="Rate Filters"
        description="Filter rates by name, category, type and status."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Rate Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Search by rate name"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        
        {/* Rate Category */}
        {data.categories ? (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="category">Rate Category</Label>
            <Select
              value={filterValues.category || "all"}
              onValueChange={(e) =>
                setFilterValue("category", e === "all" ? "" : e)
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {data?.categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {/* Rate Type */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="rateType">Rate Type</Label>
          <Select
            value={filterValues.rateType || "all"}
            onValueChange={(e) =>
              setFilterValue("rateType", e === "all" ? "" : e)
            }
          >
            <SelectTrigger id="rateType" className="w-full">
              <SelectValue placeholder="Select a rate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Negotiated">Negotiated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Plan */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="mealPlanCode">Meal Plan</Label>
          <Select
            value={filterValues.mealPlanCode || "all"}
            onValueChange={(e) =>
              setFilterValue("mealPlanCode", e === "all" ? "" : e)
            }
          >
            <SelectTrigger id="mealPlanCode" className="w-full">
              <SelectValue placeholder="Select a meal plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All meal plans</SelectItem>
              <SelectItem value="RO">Room Only (RO)</SelectItem>
              <SelectItem value="BB">Bed & Breakfast (BB)</SelectItem>
              <SelectItem value="HB">Half Board (HB)</SelectItem>
              <SelectItem value="FB">Full Board (FB)</SelectItem>
              <SelectItem value="AI">All Inclusive (AI)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Is Active */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="isActive">Status</Label>
          <Select
            value={filterValues.isActive || "all"}
            onValueChange={(e) =>
              setFilterValue("isActive", e === "all" ? "" : e)
            }
          >
            <SelectTrigger id="isActive" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* price */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="price">Price</Label>
          <div className="flex gap-2">
            <DebouncedInput
              id="price"
              placeholder="Min price"
              //value={filterValues.price}
              //onDebouncedValueChange={(e) => setFilterValue("price", e as string)}
            />
            <DebouncedInput
              id="price"
              placeholder="Max price"
              //value={filterValues.price}
              //onDebouncedValueChange={(e) => setFilterValue("price", e as string)}
            />
          </div>
        </div>
        {/*properties*/}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="properties">Properties</Label>
          <Select
            
          >
            <SelectTrigger id="properties" className="w-full">
              <SelectValue placeholder="Select properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All properties</SelectItem>
              <SelectItem value="property">property</SelectItem>
              <SelectItem value="property">property</SelectItem>
              <SelectItem value="property">property</SelectItem>
              <SelectItem value="property">property</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilteringSheet>
    </>
  );
}
