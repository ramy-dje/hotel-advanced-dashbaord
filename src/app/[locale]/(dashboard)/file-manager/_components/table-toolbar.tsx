"use client";

import { Button } from "@/components/ui/button";
import { HiTrash } from "react-icons/hi";
import { FileType } from "@/components/file-upload/file-preview";
import { FileManagerFilters } from "../page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DebouncedSearchInput } from "@/components/debounced-input";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import { DataTableMultiSelectFilter } from "@/components/data-table/data-table-multi-select-filter";

interface DataTableToolbarProps {
  filters?: FileManagerFilters;
}
const types = [
  "folder",
  "image",
  "video",
  "audio",
  "pdf",
  "spreadsheet",
  "document",
  "presentation",
  "archive",
].map((fileType) => ({
  label: fileType,
  value: fileType,
  icon: getFileIcon(fileType as FileType, "size-5 mr-2"),
}));
export function DataTableToolbar({ filters }: DataTableToolbarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Parse file types from URL query
  const fileTypes = filters?.fileTypes ? filters.fileTypes.split(",") : [];

  const tableFilters = {
    type:
      filters?.itemType === "folders"
        ? ["folder"]
        : filters?.itemType === "all"
        ? ["folder", ...fileTypes]
        : fileTypes,
    range:
      filters?.startDate && filters?.endDate
        ? {
            from: new Date(filters.startDate),
            to: new Date(filters.endDate),
          }
        : { from: undefined, to: undefined },
  };
  const setFilters = ({
    key,
    value,
  }:
    | { key: "type" | "search"; value?: string[] | string }
    | { key: "range"; value?: DateRange }) => {
    const params = new URLSearchParams(searchParams);
    if (key === "type") {
      const typeValues = value as string[] | undefined;

      if (typeValues && typeValues.length > 0) {
        // Handle folder type separately
        const hasFolder = typeValues.includes("folder");
        const nonFolderTypes = typeValues.filter((type) => type !== "folder");

        // Set itemType based on selection
        if (hasFolder && nonFolderTypes.length === 0) {
          // Only folders selected
          params.set("itemType", "folders");
          params.delete("fileTypes");
        } else if (hasFolder && nonFolderTypes.length > 0) {
          // Both folders and files selected
          params.set("itemType", "all");
          params.set("fileTypes", nonFolderTypes.join(","));
        } else {
          // Only files selected
          params.set("itemType", "files");
          params.set("fileTypes", nonFolderTypes.join(","));
        }
      } else {
        // No types selected, clear filters
        params.delete("itemType");
        params.delete("fileTypes");
      }
    } else if (key === "range")
      if (value?.from && value?.to) {
        params.set("startDate", format(value.from, "yyyy-MM-dd"));
        params.set("endDate", format(value.to, "yyyy-MM-dd"));
      } else {
        params.delete("startDate");
        params.delete("endDate");
      }
    else if (key === "search") {
      if (value) {
        params.set("search", value as string);
      } else {
        params.delete("search");
      }
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const isFiltered = ["search", "itemType", "startDate", "endDate"].some(
    (key) => filters?.[key as keyof typeof filters] !== undefined
  );

  return (
    <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center flex-wrap">
      <div className="w-full lg:w-[22em]">
        {/* searching */}
        <DebouncedSearchInput
          key={filters?.search ?? "empty"}
          className="w-full hover:border hover:border-primary"
          onDebouncedValueChange={(e) => {
            setFilters({ key: "search", value: e as string });
          }}
          placeholder="Search by name..."
          defaultValue={filters?.search}
        />
      </div>
      <DataTableMultiSelectFilter
        title="File types"
        valueKey={"type"}
        value={tableFilters.type}
        options={types}
        setFilterValue={setFilters as any}
        className="w-full lg:w-auto"
      />
      <DatePickerWithRange
        placeholder="Created at"
        value={tableFilters.range}
        onChange={(value) => setFilters({ key: "range", value })}
        className="w-full lg:w-[16em]"
        rangeIsRequired
      />

      {isFiltered && (
        <Button
          variant="secondary"
          onClick={() => {
            const params = new URLSearchParams();
            if (filters?.folderId) params.set("folderId", filters?.folderId);
            replace(`${pathname}?${params.toString()}`, { scroll: false });
          }}
          className="px-2 lg:px-3 w-full lg:w-auto"
        >
          Reset
          <HiTrash className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}
