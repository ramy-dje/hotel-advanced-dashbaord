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
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { FaGift, FaBox } from "react-icons/fa";
import { useRouter } from "@/i18n/routing";
import { AiFillProduct } from "react-icons/ai";
import { FaMoneyCheck } from "react-icons/fa6";

export default function DiscountTypePopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const options = [
    {
      icon: <AiFillProduct className="text-primary text-xl" />,
      title: "Amount of Products",
      description: "Set rules based on number of room types or services.",
      type: "amountOfProducts",
    },
    {
      icon: <FaMoneyCheck className="text-primary text-xl" />,
      title: "Total Order Amount",
      description: "Create discounts based on total stay cost.",
      type: "amountOfOrder",
    },
    {
      icon: <FaGift className="text-primary text-xl" />,
      title: "Buy X Get Y",
      description: "Offer free nights or services for specific bookings.",
      type: "buyXGetY",
    },
    {
      icon: <FaBox className="text-primary text-xl" />,
      title: "Package Offer",
      description: "Bundle rooms and services into a single package.",
      type: "package",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" />
          Create Offer
        </Button>
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="rounded-xl border border-primary shadow-lg"
      >
        <div className="w-full flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold ">
              Select Offer Type
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose how you want to configure this offer: by quantity, amount,
              free items, or package.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border border-muted hover:border-primary hover:scale-[1.02] hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out"                onClick={() => {
                  setOpen(false);
                  router.push(`/rate/offers/create?offerType=${option.type}`);
                }}
              >
                <div className="bg-primary/10 p-3 rounded-md">
                  {option.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {option.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="w-full flex-col gap-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
