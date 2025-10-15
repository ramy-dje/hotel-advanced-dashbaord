import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InView } from "react-intersection-observer";
import { useGetRoles } from "../api-hooks";
import { LIMIT } from "@/components/select-images-dialog/file-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@mantine/hooks";
import { Badge } from "@/components/ui/badge";
import { SharedWithRoles } from "@/interfaces/file-manager";
import RoleInterface from "@/interfaces/role.interface";

interface Props {
  selectedRoles?: RoleInterface[];
  onRoleSelect: (selectedRole: RoleInterface[]) => void;
  placeholder: string;
  name: string;
  sharedWithRoles?: SharedWithRoles[];
}

export default function RolesComboboxFormItem({
  selectedRoles = [],
  onRoleSelect,
  name,
  placeholder,
  sharedWithRoles = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  //search
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue<typeof search>(search, 500);
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetRoles(LIMIT, debounced);

  const roles = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        sharedWithRoles.length > 0
          ? page.data.filter(
              (role) => !sharedWithRoles.some((r) => r.roleId === role.id)
            )
          : page.data
      ) || [],
    [data, sharedWithRoles]
  );
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (inputRef.current) {
      // Force blur after component mounts
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
          setOpen(false);
        }
      }, 0);
    }
  }, []);

  return (
    <Command
      ref={dropdownRef}
      className={cn("h-auto overflow-visible bg-transparent")}
      shouldFilter={false}
    >
      <div
        className={cn(
          "flex flex-col min-h-10 rounded-md border border-input text-sm",
          {
            "px-3 py-2": selectedRoles.length !== 0,
            "cursor-text": selectedRoles.length !== 0,
          },
          selectedRoles.length !== 0 && "gap-2"
        )}
      >
        <div className="relative flex">
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            autoFocus={false}
            onFocus={() => {
              setOpen(true);
            }}
            placeholder={placeholder}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-muted-foreground w-full",
              {
                "px-3 py-2": selectedRoles.length === 0,
                "ml-1": selectedRoles.length !== 0,
              }
            )}
            value={search} // Bind input value to search state
            onValueChange={setSearch} // Update search state on input
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              onRoleSelect([]);
              setOpen(false);
            }}
            className={cn(
              "absolute right-0 top-0.5 h-4 w-4 p-0",
              selectedRoles.length === 0 && "hidden"
            )}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="relative flex flex-wrap gap-1">
          {selectedRoles.map((role) => {
            return (
              <Badge
                key={`selected-role-${role.id}`}
                className={cn(
                  "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                  "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  "gap-1 select-none rounded-full"
                )}
              >
                {role.name}
                <button
                  className={cn(
                    "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRoleSelect(
                        selectedRoles.filter((item) => item.id !== role.id)
                      );
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() =>
                    onRoleSelect(
                      selectedRoles.filter((item) => item.id !== role.id)
                    )
                  }
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </Badge>
            );
          })}
        </div>
      </div>
      <div className="relative">
        {open && (
          <div
            className="absolute top-1 z-[99999] w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CommandList className="max-h-60">
              {isLoading ? (
                <CommandGroup>
                  {[...Array(4)].map((_, index) => (
                    <CommandItem
                      className="flex items-center space-x-4"
                      key={`role-loading-${index}`}
                    >
                      <Skeleton className="size-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="size-4 w-[250px]" />
                        <Skeleton className="size-4 w-[200px]" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <>
                  <CommandEmpty>No {name} found.</CommandEmpty>
                  <CommandGroup>
                    {roles.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={(roleId) => {
                          const selectedRole = selectedRoles.find(
                            (role) => role.id === roleId
                          );
                          // Check if the selectedRole is already in the array
                          const newValue = selectedRole
                            ? selectedRoles.filter((item) => item.id !== roleId) // Remove it if it exists
                            : [
                                ...selectedRoles,
                                roles.find((role) => role.id === roleId)!,
                              ]; // Add it if it doesn't exist

                          // Update the field with the new array value
                          onRoleSelect(newValue);
                        }}
                      >
                        <div
                          style={{
                            borderColor: `${item.color}`,
                          }}
                          className="border-l-[3px] rounded-l-none px-2"
                        >
                          <p>{item.name}</p>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto size-4 shrink-0",
                            selectedRoles.find((role) => role.id === item.id)
                              ? "opacity-100"
                              : "opacity-0"
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
          </div>
        )}
      </div>
    </Command>
  );
}
