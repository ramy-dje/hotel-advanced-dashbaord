import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";
import { HiChevronDown } from "react-icons/hi";

interface DataTableMultiSelectFilterProps {
  valueKey: string;
  value?: string[];
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: ReactNode;
  }[];
  setFilterValue: (params: {
    key: string;
    value: string[] | undefined;
  }) => void;
  className?: string;
}

export function DataTableMultiSelectFilter({
  valueKey,
  value,
  title,
  options,
  setFilterValue,
  className,
}: DataTableMultiSelectFilterProps) {
  const selectedValues = new Set(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"filter"}
          className={cn("flex justify-between border", className)}
        >
          {title}
          <div className="flex items-center">
            {selectedValues?.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 rounded-sm flex items-center justify-center px-0 size-5 font-normal"
                >
                  {selectedValues.size}
                </Badge>
              </>
            )}
            <HiChevronDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      setFilterValue({
                        key: valueKey,
                        value: filterValues.length ? filterValues : undefined,
                      });
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && option.icon}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      setFilterValue({
                        key: valueKey,
                        value: undefined,
                      })
                    }
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
