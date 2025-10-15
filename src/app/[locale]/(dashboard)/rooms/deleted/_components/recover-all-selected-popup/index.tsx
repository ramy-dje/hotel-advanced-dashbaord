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
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import { HiOutlineRefresh } from "react-icons/hi";

import { crud_multiple_recover_rooms } from "@/lib/curd/room";
import useRoomsStore from "../../../store";

interface Props {
  selectedIds: string[];
  unSelectedAll: () => void;
}

export default function RecoverAllSelectedDeletedRoomsPopup({
  selectedIds,
  unSelectedAll,
}: Props) {
  // rooms store
  const { remove_many_rooms } = useRoomsStore();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecover = async () => {
    if (selectedIds.length == 0) return;
    setIsLoading(true);
    setError("");
    try {
      // recover many rooms
      const res = await crud_multiple_recover_rooms(selectedIds);
      // remove the rooms from the store
      if (res) {
        remove_many_rooms(selectedIds);
      }
      // unSelect (to remove selection form the  table)
      unSelectedAll();
      // close the popup
      setOpen(false);
      // adding a toast
      toast.success("All Selected Rooms Where Recovered Successfully");
    } catch (err) {
      setError("Something went wrong ,please try again");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={selectedIds.length == 0}
          variant="outline"
          className="gap-2 font-normal disabled:opacity-50 border-primary hover:bg-transparent bg-transparent hover:text-primary text-primary"
        >
          <HiOutlineRefresh className="size-4" /> recover all{" "}
          {selectedIds.length} selected
        </Button>
      </DialogTrigger>
      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="max-h-[15em]"
        onEscapeKeyDown={
          isLoading
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
      >
        {" "}
        <div className="w-full h-full flex flex-col gap-4 justify-between">
          <DialogHeader>
            <DialogTitle className="mb-2">
              Recover All {selectedIds.length} Selected Rooms
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Once recovered, these rooms will be restored to the rooms list.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-3">
            {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
          </div>
          {/* the footer */}
          <DialogFooter className="w-full flex-col gap-2">
            <DialogClose asChild>
              <Button
                className="w-full"
                disabled={isLoading}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleRecover}
              type="button"
            >
              Recover all
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
