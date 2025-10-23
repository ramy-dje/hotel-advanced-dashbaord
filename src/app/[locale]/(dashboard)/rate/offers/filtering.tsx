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
import { typeConverter } from "./_components/columns";

// The rate filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name?: string;
  type?: string;
  isActive?: string;
  method?: string;
  requirementsType?: string;
  combinations?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "name";
  sortOrder?: "asc" | "desc";
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
      type: "",
      isActive: "",
      method: "",
      requirementsType: "",
      combinations: "",
      startDate: "",
      endDate: "",
      sortBy: "name",
      sortOrder: "asc",
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
    false, // fetch at first to 'false'
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
          isFiltered && "text-white",
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
          <Label id="name">Offer Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Search by offer name"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>

        {/* Offer Type */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="category">Offer Type</Label>
          <Select
            value={filterValues.type || "all"}
            onValueChange={(e) => setFilterValue("type", e === "all" ? "" : e)}
          >
            <SelectTrigger
              id="type"
              className="w-full"
            >
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {["amountOfProducts", "package", "amountOfOrder", "buyXGetY"].map(
                (type) => (
                  <SelectItem
                    key={type}
                    value={type}
                  >
                    {typeConverter(type)}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Method */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="method">Method</Label>
          <Select
            value={filterValues.method || "all"}
            onValueChange={(e) =>
              setFilterValue("method", e === "all" ? "" : e)
            }
          >
            <SelectTrigger
              id="method"
              className="w-full"
            >
              <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">auto</SelectItem>
              <SelectItem value="code">code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requirements type */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="requirementsType">requirements type</Label>
          <Select
            value={filterValues.requirementsType || "all"}
            onValueChange={(e) =>
              setFilterValue("requirementsType", e === "all" ? "" : e)
            }
          >
            <SelectTrigger
              id="requirementsType"
              className="w-full"
            >
              <SelectValue placeholder="Select a requirements type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_requirements">no requirements</SelectItem>
              <SelectItem value="purchase_amount">purchase amount</SelectItem>
              <SelectItem value="quantity_amount">quantity amount</SelectItem>
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
            <SelectTrigger
              id="isActive"
              className="w-full"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* validity date */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="price">Validity date start from</Label>
          <DebouncedInput
            type="date"
            id="startDate"
            placeholder="Date start from"
            value={filterValues.startDate}
            onDebouncedValueChange={(e: any) =>
              setFilterValue(
                "startDate",
                e ? new Date(e).toISOString().split("T")[0] : "",
              )
            }
          />
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <Label id="price">Validity date end to</Label>
          <DebouncedInput
            type="date"
            id="endDate"
            placeholder="Date end to"
            value={filterValues.endDate}
            onDebouncedValueChange={(e:any) =>
              setFilterValue(
                "endDate",
                e ? new Date(e).toISOString().split("T")[0] : "",
              )
            }
          />
        </div>
      </FilteringSheet>
    </>
  );
}
