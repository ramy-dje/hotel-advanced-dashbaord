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

const SearchServicesPopup = forwardRef(
  (
    { selectedServices, setSelectedServices }: any,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const [open, setOpen] = useState(false);
    const [services] = useState([
      { name: "Service 1" },
      { name: "Service 2" },
      { name: "Service 3" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredServices, setFilteredServices] = useState(services);

    // Debounced search
    useEffect(() => {
      const timeout = setTimeout(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
          setFilteredServices(services);
        } else {
          setFilteredServices(
            services.filter((s) => s.name.toLowerCase().includes(term)),
          );
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }, [searchTerm, services]);

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
            <HiOutlineSearch className="size-4" /> Search services
          </Button>
        </DialogTrigger>

        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-lg"
        >
          <DialogHeader>
            <DialogTitle>Search services</DialogTitle>
            <DialogDescription>
              <div className="relative mt-3 mb-4">
                <Input
                  type="text"
                  placeholder="Search services..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 size-5" />
              </div>

              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedServices.map((service: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full gap-2 text-sm font-normal"
                    >
                      {service.name}
                      <button
                        onClick={() =>
                          setSelectedServices((prev: any[]) =>
                            prev.filter((item) => item !== service),
                          )
                        }
                        className="ml-1 text-black hover:text-red-600"
                      >
                        <HiOutlineX className="size-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* List of services */}
          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {filteredServices.map((service, index) => {
              const isSelected = selectedServices.includes(service);
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition cursor-pointer ${
                    isSelected ? "bg-white border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices((prev: any[]) =>
                        prev.filter((item) => item !== service),
                      );
                    } else {
                      setSelectedServices((prev: any[]) => [...prev, service]);
                    }
                  }}
                >
                  <span className="text-sm font-medium text-gray-800">
                    {service.name}
                  </span>
                  <Checkbox
                    checked={isSelected}
                    className="w-4 h-4"
                  />
                </div>
              );
            })}
          </div>

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

export default SearchServicesPopup;
