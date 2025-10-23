"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { forwardRef, useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const SearchCustomersSegmentsPopup = forwardRef(
  (
    { selectedCustomersSegments, setSelectedCustomersSegments }: any,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const [open, setOpen] = useState(false);
    const [customersSegments] = useState([
      { name: "Segment 1" },
      { name: "Segment 2" },
      { name: "Segment 3" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSegments, setFilteredSegments] = useState(customersSegments);
    useEffect(() => {
      const timeout = setTimeout(() => {
        const term = searchTerm.toLowerCase().trim();
        if (term === "") {
          setFilteredSegments(customersSegments);
        } else {
          setFilteredSegments(
            customersSegments.filter((segment) =>
              segment.name.toLowerCase().includes(term),
            ),
          );
        }
      }, 2000); // 2-second debounce

      return () => clearTimeout(timeout); // cancel previous timeout on change
    }, [searchTerm, customersSegments]);

    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button
            className="gap-2 font-normal w-1/2 md:w-auto"
            variant="default"
            ref={ref}
          >
            <HiOutlineSearch className="size-4" />
            Search customer segments
          </Button>
        </DialogTrigger>

        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-lg"
        >
          <DialogHeader>
            <DialogTitle>Search segments</DialogTitle>
            <DialogDescription>
              <div className="relative mt-3 mb-2">
                <Input
                  type="text"
                  placeholder="Search segments..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 size-5" />
              </div>
              {/* Selected Chips */}
              {selectedCustomersSegments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCustomersSegments.map(
                    (segment: any, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-full gap-2 text-sm font-normal "
                      >
                        {segment.name}
                        <button
                          onClick={() =>
                            setSelectedCustomersSegments((prev: any[]) =>
                              prev.filter((item) => item !== segment),
                            )
                          }
                          className="ml-1 text-black hover:text-red-600 text-base leading-none"
                        >
                          <HiOutlineX className="size-4" />
                        </button>
                      </Badge>
                    ),
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Segment Selection */}
          <div className="flex flex-col gap-4">
            {/* Segment List */}
            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              {filteredSegments.map((segment, index) => {
                const isSelected = selectedCustomersSegments.includes(segment);
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-primary-lighter border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCustomersSegments((prev:any) =>
                          prev.filter((item:any) => item !== segment),
                        );
                      } else {
                        setSelectedCustomersSegments((prev:any ) => [
                          ...prev,
                          segment,
                        ]);
                      }
                    }}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {segment.name}
                    </span>
                    <Checkbox
                      checked={isSelected}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default SearchCustomersSegmentsPopup;
