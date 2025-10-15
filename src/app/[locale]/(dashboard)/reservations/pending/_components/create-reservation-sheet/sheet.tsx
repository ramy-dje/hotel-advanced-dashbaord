"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import CreateReservationPage from ".";

// Create reservation sheet

export default function CreateReservationSheet() {
  // create reservation popup
  const [createReservationOpen, setCreateReservationOpen] = useState(false);
  // is loading
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={createReservationOpen} onOpenChange={setCreateReservationOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Floor
        </Button>
      </SheetTrigger>
      <SheetContent
        preventOutsideClose
        closeButtonDisabled={isLoading}
        side="right_big"
        bigCloseSizes
      >
        <SheetHeader>
          <SheetTitle>New Floor</SheetTitle>
          <SheetDescription>
            Create new Floor by filling the form
          </SheetDescription>
        </SheetHeader>
        <CreateReservationPage
          open={createReservationOpen}
          setIsLoading={setIsLoading}
          setOpen={setCreateReservationOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
