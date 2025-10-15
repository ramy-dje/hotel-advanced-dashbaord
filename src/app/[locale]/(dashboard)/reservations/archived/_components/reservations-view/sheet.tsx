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
}

// View Trashed reservation sheet

export default function ViewTrashedReservationSheet({ open, setOpen }: Props) {
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
          <SheetTitle>View Archived Reservation</SheetTitle>
          <SheetDescription>View archived reservation</SheetDescription>
        </SheetHeader>
        <CreateReservationPage
          open={open}
          setIsLoading={setIsLoading}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
