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
import { crud_get_all_job_departments } from "@/lib/curd/job-department";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The job positions filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  type: string;
  level: string;
  department: string;
}

export default function JobPositionsPageFiltering({
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
      department: "",
      level: "",
      type: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // method to fetch the departments data
      departments: async () =>
        await crud_get_all_job_departments({ page: 0, size: 100 }),

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
        title="Job Positions Filters"
        description="Filter positions by title,department level and type."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Title</Label>
          <DebouncedInput
            id="name"
            placeholder="Title of a position"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <Label id="type">Type</Label>
          <DebouncedInput
            id="type"
            placeholder="Type of the position"
            value={filterValues.type}
            onDebouncedValueChange={(e) => setFilterValue("type", e as string)}
          />
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <Label id="level">Level</Label>
          <DebouncedInput
            id="level"
            placeholder="Level of the position"
            value={filterValues.level}
            onDebouncedValueChange={(e) => setFilterValue("level", e as string)}
          />
        </div>

        {/* is the needed data isn't fetched or it equals 'null' don't render the component */}
        {data.departments ? (
          <div className="flex flex-col gap-2">
            <Label id="role">Department</Label>
            <Select
              value={filterValues.department || "all"}
              onValueChange={(e) =>
                setFilterValue("department", e == "all" ? "" : e)
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {data.departments.map((department) => (
                  <SelectItem value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </FilteringSheet>
    </>
  );
}
