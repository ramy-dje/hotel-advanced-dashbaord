import { cn } from "@/lib/utils";
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
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";
import { HiChevronDown } from "react-icons/hi";

interface DataTableSelectFilterProps {
  valueKey: string;
  value?: string;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: ReactNode;
  }[];
  setFilterValue: (params: { key: string; value: string | undefined }) => void;
  className?: string;
}

export function DataTableSelectFilter({
  valueKey,
  value,
  title,
  options,
  className,
  setFilterValue,
}: DataTableSelectFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={value ? "default" : "outline"}
          className={cn("border", className)}
        >
          {title}
          <HiChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setFilterValue({
                          key: valueKey,
                          value: undefined,
                        });
                      } else {
                        setFilterValue({
                          key: valueKey,
                          value: option.value,
                        });
                      }
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
            {value && (
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
                    Clear filter
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
