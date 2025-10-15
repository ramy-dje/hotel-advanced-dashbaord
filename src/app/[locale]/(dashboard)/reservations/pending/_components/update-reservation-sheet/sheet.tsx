"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import CreateReservationPage from ".";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keep?: boolean; // to keep the reservation (don't remove from the store) and just change its status
}

// Update reservation sheet

export default function UpdateReservationSheet({
  open,
  setOpen,
  keep = false,
}: Props) {
  // is loading
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        preventOutsideClose
        closeButtonDisabled={isLoading}
        side="right_big"
        bigCloseSizes
      >
        <SheetHeader>
          <SheetTitle>Review Reservation</SheetTitle>
          <SheetDescription>
            Review reservation by approving it
          </SheetDescription>
        </SheetHeader>
        <CreateReservationPage
          open={open}
          setIsLoading={setIsLoading}
          setOpen={setOpen}
          keep={keep}
        />
      </SheetContent>
    </Sheet>
  );
}
