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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FileType } from "@/components/file-upload/file-preview";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { FileManagerFilters } from "../page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useController, useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";

// Custom component to render icon and label side by side
const IconLabel = ({
  icon,
  label,
}: {
  icon: React.ReactElement;
  label: string;
}) => (
  <div className="flex items-center gap-2 w-[295px]">
    {icon}
    <span>{label}</span>
  </div>
);

const initialValues = {
  type: "all",
  range: { from: undefined, to: undefined },
};
// The filtering sheet component
interface Props {
  filters?: FileManagerFilters;
}

interface FiltersType {
  type: string;
  range: DateRange;
}
export default function FilesManagerPageFiltering({ filters }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { handleSubmit, control, setValue } = useForm<FiltersType>({
    defaultValues: {
      type:
        filters?.itemType === "folders"
          ? "folder"
          : filters?.fileType
          ? filters?.fileType
          : initialValues.type,
      range:
        filters?.startDate && filters?.endDate
          ? { from: new Date(filters.startDate), to: new Date(filters.endDate) }
          : initialValues.range,
    },
  });

  const setFilters = (filters: FiltersType) => {
    const params = new URLSearchParams(searchParams);
    if (filters.type !== "all") {
      if (filters.type === "folder") {
        params.set("itemType", "folders");
      } else {
        params.set("itemType", "files");
        params.set("fileType", filters.type);
      }
    } else {
      params.delete("itemType");
      params.delete("fileType");
    }
    if (filters.range.from && filters.range.to) {
      params.set("startDate", format(filters.range.from, "yyyy-MM-dd"));
      params.set("endDate", format(filters.range.to, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const isFiltered = ["itemType", "startDate", "endDate"].some(
    (key) => filters?.[key as keyof typeof filters] !== undefined
  );

  const type_controller = useController({
    control,
    name: "type",
  });

  // sheet open state
  const [open, setOpen] = useState(false);

  const handleOutsideSubmit = () => {
    handleSubmit(setFilters)();
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("itemType");
    params.delete("fileType");
    params.delete("startDate");
    params.delete("endDate");
    replace(`${pathname}?${params.toString()}`);
    setValue("range", initialValues.range);
    setValue("type", initialValues.type);
    setOpen(false);
  };

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
        title="File manager Filters"
        description="Filter files and folders by type."
        open={open}
        setOpen={setOpen}
        handelShowResults={handleOutsideSubmit}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <form onSubmit={handleSubmit(setFilters)}>
          <div className="flex flex-col gap-2 mb-3">
            <Label id="type">Files types</Label>
            <Select
              value={type_controller.field.value}
              onValueChange={type_controller.field.onChange}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hidden">
                  All types
                </SelectItem>
                {[
                  "folder",
                  "image",
                  "video",
                  "audio",
                  "text",
                  "pdf",
                  "spreadsheet",
                  "document",
                  "presentation",
                  "archive",
                ].map((fileType) => (
                  <SelectItem value={fileType} key={fileType}>
                    <IconLabel
                      icon={getFileIcon(fileType as FileType, "size-5")}
                      label={fileType}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <Label id="type">Period</Label>
            <DatePickerWithRange
              control={control}
              name="range"
              rangeIsRequired
            />
          </div>
        </form>
      </FilteringSheet>
    </>
  );
}
