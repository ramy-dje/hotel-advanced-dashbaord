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

const SearchCustomersPopup = forwardRef(
  ({ selectedCustomers, setSelectedCustomers }: any, ref: React.Ref<HTMLButtonElement>) => {
    const [open, setOpen] = useState(false);
    const [customers] = useState([
      { name: "Customer 1" },
      { name: "Customer 2" },
      { name: "Customer 3" },
      { name: "Alice Johnson" },
      { name: "Bob Smith" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);

    // Debounce search
    useEffect(() => {
      const timeout = setTimeout(() => {
        const term = searchTerm.toLowerCase().trim();
        if (term === "") {
          setFilteredCustomers(customers);
        } else {
          setFilteredCustomers(
            customers.filter((customer) =>
              customer.name.toLowerCase().includes(term)
            )
          );
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }, [searchTerm, customers]);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 font-normal w-1/2 md:w-auto" variant="default" ref={ref}>
            <HiOutlineSearch className="size-4" /> Search customers
          </Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search customers</DialogTitle>
            <DialogDescription>
              <div className="relative mt-3 mb-2">
                <Input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 size-5" />
              </div>

              {/* Selected customers badges */}
              {selectedCustomers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCustomers.map((customer: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full gap-2 text-sm font-normal"
                    >
                      {customer.name}
                      <button
                        onClick={() =>
                          setSelectedCustomers((prev: any[]) =>
                            prev.filter((item) => item !== customer)
                          )
                        }
                        className="ml-1 text-black hover:text-red-600 text-base leading-none"
                      >
                        <HiOutlineX className="size-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Customer list */}
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => {
                const isSelected = selectedCustomers.includes(customer);
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected ? "bg-white border-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCustomers((prev: any[]) =>
                          prev.filter((item) => item !== customer)
                        );
                      } else {
                        setSelectedCustomers((prev: any[]) => [...prev, customer]);
                      }
                    }}
                  >
                    <span className="text-sm font-medium text-gray-800">{customer.name}</span>
                    <Checkbox checked={isSelected} />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 px-2">No customers found.</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export default SearchCustomersPopup;
