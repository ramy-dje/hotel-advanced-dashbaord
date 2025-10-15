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

// View canceled reservation sheet

export default function ViewCanceledReservationSheet({
  open,
  setOpen,
  keep = false,
}: Props) {
  // is loading
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        side="right_mid"
        className=""
        bigCloseSizes
      >
        <SheetHeader>
          <SheetTitle>View Canceled Reservation</SheetTitle>
          <SheetDescription>View canceled reservation</SheetDescription>
        </SheetHeader>
        <CreateReservationPage
          open={open}
          setIsLoading={setIsLoading}
          keep={keep}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
