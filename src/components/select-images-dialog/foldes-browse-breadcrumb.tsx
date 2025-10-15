import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HiHome } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { BreadcrumbData } from "@/interfaces/file-manager";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function FoldersBrowseBreadcrumb({
  currentPath = [],
  handleNavigate,
  isLoading,
  isError,
  error,
}: {
  currentPath?: BreadcrumbData[];
  handleNavigate: (folderId?: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
}) {
  if (isError)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as any).response?.data?.message ??
            "Failed to load breadcrumbs. Please try again."}
        </AlertDescription>
      </Alert>
    );

  if (isLoading)
    return (
      <Breadcrumb className="px-4 mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Skeleton className="h-5 w-24" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-5 w-24" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-5 w-24" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

  // Determine which items to show directly and which to put in the dropdown
  const showDropdown = currentPath.length > 3;
  const visibleItems = showDropdown
    ? currentPath.slice(-2) // Show only last 2 items
    : currentPath;
  const dropdownItems = showDropdown
    ? currentPath.slice(0, currentPath.length - 2) // All items except the last 2
    : [];

  return currentPath.length > 0 ? (
    <Breadcrumb className="px-4 mb-4">
      <BreadcrumbList>
        <BreadcrumbItem
          className={cn(currentPath.length > 0 ? "cursor-pointer" : "")}
          onClick={() => currentPath.length > 0 && handleNavigate()}
        >
          <HiHome className="size-5" />
        </BreadcrumbItem>
        {currentPath.length > 0 && <BreadcrumbSeparator />}
        {/* Dropdown for hidden items */}
        {showDropdown && (
          <>
            <BreadcrumbItem>
              <Menu>
                <MenuButton className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom start"
                  className="w-auto min-w-32 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
                >
                  {dropdownItems.map((item) => (
                    <MenuItem key={item.id}>
                      <button
                        className="w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent"
                        onClick={() => {
                          handleNavigate(item.id);
                        }}
                      >
                        {item.name}
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Visible breadcrumb items */}
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          return (
            <Fragment key={item.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item.id);
                    }}
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  ) : null;
}
