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
import { RiSparkling2Fill } from "react-icons/ri";
// Create reservation sheet
type CreateReservationSheetProps= {
  blockIndex: number;
  hasRooms?: boolean;
  hasFacilities?: boolean;
}

const CreateReservationSheet: React.FC<CreateReservationSheetProps> = ({ blockIndex, hasRooms, hasFacilities }) => {
  const [createReservationOpen, setCreateReservationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={createReservationOpen} onOpenChange={setCreateReservationOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto" variant={"outline"}>
          {/* <HiOutlinePlus className="size-4" /> New Floors */}
          <RiSparkling2Fill /> New Floors
        </Button>
      </SheetTrigger>
      <SheetContent
        preventOutsideClose
        closeButtonDisabled={isLoading}
        side="right_big"
        className="!w-[82vw]"
        bigCloseSizes
      >
        <SheetHeader>
          <SheetTitle>New Floor</SheetTitle>
          <SheetDescription>
            Create new floor by filling the form
          </SheetDescription>
        </SheetHeader>
        <CreateReservationPage
          blockIndex={blockIndex}
          open={createReservationOpen}
          setIsLoading={setIsLoading}
          setOpen={setCreateReservationOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
export default CreateReservationSheet;