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
import { crud_get_all_blog_categories } from "@/lib/curd/blog-category";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The blogs filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  code: string;
  category: string;
}

export default function BlogsPageFiltering({ filters, setFilters }: Props) {
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
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // method to fetch the categories data
      categories: async () =>
        await crud_get_all_blog_categories({ page: 0, size: 100 }),

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
          "gap-2 font-normal text-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="Blogs Filters"
        description="Filter blogs by title and categories."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <div className="flex flex-col gap-2 mb-3">
          <Label id="title">Blog Title</Label>
          <DebouncedInput
            id="title"
            placeholder="Title"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        {/* is the needed data isn't fetched or it equals 'null' don't render the component */}
        {data.categories ? (
          <div className="flex flex-col gap-2">
            <Label id="category">Blog Category</Label>
            <Select
              value={filterValues.category || "all"}
              onValueChange={(e) =>
                setFilterValue("category", e == "all" ? "" : e)
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {data?.categories.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
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
