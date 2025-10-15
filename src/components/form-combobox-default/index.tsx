import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InView } from "react-intersection-observer";

interface Props {
  control: Control<any>;
  control_name: string;
  list: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  name: string;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  handleLoadMore: () => void;
}

// The combobox form item component is a combobox that uses the react-hook-from library to add a searchable combobox with selecting value and retuning the input text if list doesn't have the match item
export default function ComboboxFormItem({
  control,
  list,
  control_name,
  name,
  placeholder,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  handleLoadMore,
}: Props) {
  const [open, setOpen] = useState(false);
  //search
  const [search, setSearch] = useState("");
  // value controller
  const value_controller = useController({
    name: control_name,
    control,
  });
  const value = value_controller.field.value as string;
  const filteredItems = list.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        type="button"
      >
        <p className="truncate">
          {value
            ? list.find((item) => item.value === value)?.label
            : placeholder}
        </p>
        <ChevronsUpDown className="ml-2 size-4 opacity-50 flex-shrink-0" />
      </Button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${name}...`}
              className="h-9"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isFetching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="mr-2 size-4 animate-spin text-primary" />
                  Loading...
                </div>
              ) : (
                <>
                  <CommandEmpty>No {name} found.</CommandEmpty>
                  <CommandGroup>
                    {filteredItems.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          value_controller.field.onChange(
                            currentValue === value ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <p className="truncate">{item.label}</p>
                        <Check
                          className={cn(
                            "ml-auto size-4 shrink-0",
                            value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {hasNextPage && (
                    <InView
                      as="div"
                      onChange={(inView) => {
                        if (inView) handleLoadMore();
                      }}
                      className="flex justify-center items-center py-4"
                    >
                      {isFetchingNextPage && (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin text-primary" />
                          Loading...
                        </>
                      )}
                    </InView>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
