import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { cn, getAvatarName } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InView } from "react-intersection-observer";
import { useUsersSlim } from "../api-hooks";
import { LIMIT } from "@/components/select-images-dialog/file-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebouncedValue } from "@mantine/hooks";
import { Badge } from "@/components/ui/badge";
import { SharedWith, UsersSlimResponse } from "@/interfaces/file-manager";

interface Props {
  selectedUsers?: UsersSlimResponse["data"];
  onUserSelect: (selectedUser: UsersSlimResponse["data"]) => void;
  placeholder: string;
  name: string;
  sharedWith?: SharedWith[];
}

export default function UsersComboboxFormItem({
  selectedUsers = [],
  onUserSelect,
  name,
  placeholder,
  sharedWith = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  //search
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue<typeof search>(search, 500);
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useUsersSlim(LIMIT, debounced);

  const users = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        sharedWith.length > 0
          ? page.data.filter(
              (user) => !sharedWith.some((u) => u.id === user.id)
            )
          : page.data
      ) || [],
    [data, sharedWith]
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
            "px-3 py-2": selectedUsers.length !== 0,
            "cursor-text": selectedUsers.length !== 0,
          },
          selectedUsers.length !== 0 && "gap-2"
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
                "px-3 py-2": selectedUsers.length === 0,
                "ml-1": selectedUsers.length !== 0,
              }
            )}
            value={search} // Bind input value to search state
            onValueChange={setSearch} // Update search state on input
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              onUserSelect([]);
              setOpen(false);
            }}
            className={cn(
              "absolute right-0 top-0.5 h-4 w-4 p-0",
              selectedUsers.length === 0 && "hidden"
            )}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="relative flex flex-wrap gap-1">
          {selectedUsers.map((user) => {
            return (
              <Badge
                key={`selected-user-${user.id}`}
                className={cn(
                  "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                  "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  "gap-1 select-none rounded-full"
                )}
              >
                {user.profileInfo.email}
                <button
                  className={cn(
                    "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUserSelect(
                        selectedUsers.filter((item) => item.id !== user.id)
                      );
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() =>
                    onUserSelect(
                      selectedUsers.filter((item) => item.id !== user.id)
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
                      key={`user-loading-${index}`}
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
                    {users.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={(userId) => {
                          const selectedUser = selectedUsers.find(
                            (user) => user.id === userId
                          );
                          // Check if the selectedUser is already in the array
                          const newValue = selectedUser
                            ? selectedUsers.filter((item) => item.id !== userId) // Remove it if it exists
                            : [
                                ...selectedUsers,
                                users.find((user) => user.id === userId)!,
                              ]; // Add it if it doesn't exist

                          // Update the field with the new array value
                          onUserSelect(newValue);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={item.profileInfo.pic} />
                            <AvatarFallback>
                              {getAvatarName(item.profileInfo.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <p>{item.profileInfo.fullName}</p>
                            <p className="text-secondary-foreground">
                              {item.profileInfo.email}
                            </p>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto size-4 shrink-0",
                            selectedUsers.find((user) => user.id === item.id)
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
