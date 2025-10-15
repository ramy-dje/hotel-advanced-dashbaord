import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { DebouncedSearchInput } from "../debounced-input";
import { DatePickerWithRange } from "../date-picker-with-range";
import { FileType } from "../file-upload/file-preview";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getFileIcon } from "./file-icon";
import { FileTypeCategory } from "./helper";
import { DataTableMultiSelectFilter } from "../data-table/data-table-multi-select-filter";

type searchFilters = {
  search?: string;
  itemType?: string;
  fileTypes?: string;
  startDate?: string;
  endDate?: string;
};
interface SearchInputProps {
  onChange: Dispatch<SetStateAction<searchFilters>>;
  onClear: () => void;
  filters: searchFilters;
  allowedFileTypes: FileTypeCategory[];
}

export const SearchInput = ({
  onChange,
  onClear,
  filters,
  allowedFileTypes,
}: SearchInputProps) => {
  // Store the search input value separately to avoid the infinite loop
  const [searchInputValue, setSearchInputValue] = useState(
    filters?.search || ""
  );

  const types = [
    "folder",
    ...[
      "image",
      "video",
      "audio",
      "pdf",
      "spreadsheet",
      "document",
      "presentation",
      "archive",
    ].filter((type) => allowedFileTypes.includes(type as FileTypeCategory)),
  ].map((fileType) => ({
    label: fileType,
    value: fileType,
    icon: getFileIcon(fileType as FileType, "size-5 mr-2"),
  }));

  const isFiltered = ["search", "itemType", "startDate", "endDate"].some(
    (key) => filters?.[key as keyof typeof filters] !== undefined
  );
  // Parse file types from URL query
  const fileTypes = filters?.fileTypes ? filters.fileTypes.split(",") : [];
  console.log(fileTypes);
  const setFilters = ({
    key,
    value,
  }:
    | { key: "search"; value?: string }
    | { key: "type"; value?: string[] }
    | { key: "range"; value?: DateRange }) => {
    if (key === "type") {
      if (value && value.length > 0) {
        // Handle folder type separately
        const hasFolder = value.includes("folder");
        const nonFolderTypes = value.filter((type) => type !== "folder");

        // Set itemType based on selection
        if (hasFolder && nonFolderTypes.length === 0) {
          // Only folders selected
          onChange((prev) => ({
            ...prev,
            itemType: "folders",
            fileTypes: undefined,
          }));
        } else if (hasFolder && nonFolderTypes.length > 0) {
          // Both folders and files selected
          onChange((prev) => ({
            ...prev,
            itemType: "all",
            fileTypes: nonFolderTypes.join(","),
          }));
        } else {
          // Only files selected
          onChange((prev) => ({
            ...prev,
            itemType: "files",
            fileTypes: nonFolderTypes.join(","),
          }));
        }
      } else {
        // No types selected, clear filters
        onChange((prev) => ({
          ...prev,
          itemType: undefined,
          fileTypes: undefined,
        }));
      }
    } else if (key === "range") {
      if (value?.from && value?.to) {
        onChange((prev) => ({
          ...prev,
          startDate: format(value.from!, "yyyy-MM-dd"),
          endDate: format(value.to!, "yyyy-MM-dd"),
        }));
      } else {
        onChange((prev) => ({
          ...prev,
          startDate: undefined,
          endDate: undefined,
        }));
      }
    } else if (key === "search") {
      if (value) {
        onChange((prev) => ({
          ...prev,
          search: value,
        }));
      } else {
        onChange((prev) => ({
          ...prev,
          search: undefined,
        }));
      }
    }
  };

  useEffect(() => {
    if (filters?.search !== searchInputValue) {
      setFilters({ key: "search", value: searchInputValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInputValue]);

  // Clear the search input when filters are cleared
  useEffect(() => {
    if (!isFiltered) {
      setSearchInputValue("");
    }
  }, [isFiltered]);

  return (
    <>
      <DebouncedSearchInput
        className="md:w-[28rem]"
        onDebouncedValueChange={(e) => {
          const value = e as string;
          setSearchInputValue(value); // Update local state
        }}
        value={searchInputValue} // Use controlled component pattern
        placeholder="Search by name..."
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
        {isFiltered ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              setSearchInputValue(""); // Also clear the local search input value
            }}
            className="text-muted-foreground hover:text-accent-foreground  p-1"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <div className="relative bg-background">
          <Popover>
            <PopoverTrigger asChild>
              <SlidersHorizontal className="cursor-pointer size-5" />
            </PopoverTrigger>
            <PopoverContent
              sideOffset={12}
              align="end"
              className="min-w-lg p-4 flex flex-col"
            >
              {" "}
              <div className="flex flex-col gap-4 py-2">
                <DataTableMultiSelectFilter
                  title="File types"
                  valueKey={"type"}
                  value={
                    filters?.itemType === "folders"
                      ? ["folder"]
                      : filters?.itemType === "all"
                      ? ["folder", ...fileTypes]
                      : fileTypes
                  }
                  options={types}
                  setFilterValue={setFilters as any}
                  className="w-full"
                />

                <DatePickerWithRange
                  placeholder="Create at"
                  value={
                    filters?.startDate && filters?.endDate
                      ? {
                          from: new Date(filters.startDate),
                          to: new Date(filters.endDate),
                        }
                      : { from: undefined, to: undefined }
                  }
                  onChange={(value) => setFilters({ key: "range", value })}
                  className="w-full"
                  rangeIsRequired
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};
