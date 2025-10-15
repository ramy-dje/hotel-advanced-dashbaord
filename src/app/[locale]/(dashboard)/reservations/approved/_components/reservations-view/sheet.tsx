"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import ViewReservationPage from ".";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keep?: boolean; // to keep the reservation (don't remove from the store) and just change its status
}

// View Completed reservation sheet

export default function ViewCompletedReservationSheet({
  open,
  setOpen,
  keep = false
}: Props) {
  // is loading
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        side="right_mid"
        bigCloseSizes
      >
        <SheetHeader>
          <SheetTitle>View Reservation</SheetTitle>
          <SheetDescription>
            View approved or completed reservation
          </SheetDescription>
        </SheetHeader>
        <ViewReservationPage
          open={open}
          keep={keep}
          setIsLoading={setIsLoading}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
