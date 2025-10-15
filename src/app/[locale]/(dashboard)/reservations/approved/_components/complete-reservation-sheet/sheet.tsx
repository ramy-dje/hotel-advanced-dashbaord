"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import CreateReservationPage from ".";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Complete approved reservation sheet

export default function CompleteApprovedReservationSheet({
  open,
  setOpen,
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
          <SheetTitle>Complete Reservation</SheetTitle>
          <SheetDescription>Complete or edit the reservation</SheetDescription>
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
