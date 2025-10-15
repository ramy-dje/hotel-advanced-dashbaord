"use client";
// The search bar component

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LiaBedSolid } from "react-icons/lia";
import { useRouter } from "@/i18n/routing";
import { useState, useEffect, useCallback } from "react";
import { FiCircle } from "react-icons/fi";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
  HiOutlineGlobe,
} from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";

export default function HeaderSearchBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // run command
  const runCommand = useCallback((command: () => any) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div>
      <Button
        variant="empty"
        onClick={() => setOpen(true)}
        className="group bg-background gap-2 border-0 xl:border border-border hover:border-foreground/40 inline-flex items-center justify-between active:translate-y-px xl:h-10 xl:w-[24rem] xl:max-w-sm xl:rounded-lg xl:py-2 xl:pe-2 xl:ps-3.5 xl:shadow-sm"
      >
        <span className="flex items-center gap-2">
          <HiOutlineSearch className="text-accent-foreground/80 size-5" />
          <span className="hidden text-sm font-normal text-accent-foreground/60 group-hover:text-foreground/70 transition-colors xl:inline-flex">
            Search your pages
          </span>
        </span>
        <span className="ms-auto hidden items-center text-sm text-accent-foreground lg:flex lg:rounded-md lg:bg-primary lg:px-1.5 lg:py-1 lg:text-xs lg:font-semibold lg:text-primary-foreground xl:justify-normal">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="1.3"
            viewBox="0 0 256 256"
            className="h-[15px] w-[15px]"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z"></path>
          </svg>
          K
        </span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search the page ..." />
        <CommandList className="z-[99999999] mt-px">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <HiOutlineHome className="mr-3 h-4 w-4" />
              Home
            </CommandItem>
          </CommandGroup>
          {/* Rooms */}
          <CommandGroup heading="Rooms">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/rooms"))}
            >
              <LiaBedSolid className="mr-3 h-4 w-4" />
              Rooms
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/rooms/create"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Room
            </CommandItem>
            {/* room details */}
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/floors"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Floors
            </CommandItem>

            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/room-categories"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Categories
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/room-beds"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Beds
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push("/room-details/room-extra-services")
                )
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Extra Services
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/room-features"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Features
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/room-types"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Types
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/room-details/room-includes"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4" />
              Room Includes
            </CommandItem>
          </CommandGroup>
          {/* Reservations */}
          <CommandGroup heading="Reservations">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/reservations/pending"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4 text-yellow-500" />
              Pending Reservations
            </CommandItem>

            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/reservations/approved"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4 text-green-500" />
              Approved Reservations
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/reservations/approved"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4 text-blue-500" />
              Completed Reservations
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/reservations/canceled"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4 text-gray-500" />
              Canceled Reservations
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/reservations/archived"))
              }
            >
              <FiCircle className="mr-3 h-4 w-4 text-red-500" />
              Archived Reservations
            </CommandItem>
          </CommandGroup>
          {/* Jobs */}
          <CommandGroup heading="Jobs">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/positions"))}
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Positions
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/jobs/submissions"))
              }
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Submissions
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/department"))}
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Departments
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/positions"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Position
            </CommandItem>
          </CommandGroup>
          {/* Food & Drink */}
          <CommandGroup heading="Food">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/food/menus"))}
            >
              <IoFastFoodOutline className="mr-3 h-4 w-4" />
              Menus
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/food/dishes"))}
            >
              <IoFastFoodOutline className="mr-3 h-4 w-4" />
              Dishes
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/food/ingredients"))
              }
            >
              <IoFastFoodOutline className="mr-3 h-4 w-4" />
              Ingredients
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/food/types"))}
            >
              <IoFastFoodOutline className="mr-3 h-4 w-4" />
              Types
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/food/dishes/create"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Dish
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/food/menus/create"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Menu
            </CommandItem>
          </CommandGroup>
          {/* blogs */}
          <CommandGroup heading="Blogs">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/blogs"))}
            >
              <HiOutlineNewspaper className="mr-3 h-4 w-4" />
              Posts
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/blogs/categories"))
              }
            >
              <HiOutlineNewspaper className="mr-3 h-4 w-4" />
              Categories
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/blogs/tags"))}
            >
              <HiOutlineNewspaper className="mr-3 h-4 w-4" />
              Tags
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/blogs/create"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Post
            </CommandItem>
          </CommandGroup>
          {/* destinations */}
          <CommandGroup heading="Destinations">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/destinations"))}
            >
              <HiOutlineGlobe className="mr-3 h-4 w-4" />
              Destinations
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/destinations/create"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Destination
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
