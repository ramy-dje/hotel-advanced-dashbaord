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
import { HiOutlineTrash } from "react-icons/hi";
import { crud_update_many_reservations_statuses } from "@/lib/curd/reservations";
import useReservationsStore from "../../../store";

interface Props {
  selectedIds: string[];
  unSelectedAll: () => void;
}

export default function CompleteAllSelectedApprovedReservationsPopup({
  selectedIds,
  unSelectedAll,
}: Props) {
  // reservations store hook
  const { change_many_reservations_status } = useReservationsStore();
  // open state
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (selectedIds.length == 0) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_many_reservations_statuses(
        selectedIds,
        "completed"
      );
      // update all selected approved reservations to completed status
      if (res) {
        // change all items from approved to completed in the store
        change_many_reservations_status(selectedIds, "completed");
        // unselect all checked items
        unSelectedAll();
      }
      setOpen(false);
      // adding a toast
      toast.success(
        "All Selected Reservations Marked As Completed Successfully"
      );
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
          <HiOutlineTrash className="size-4" /> Mark all {selectedIds.length} as
          completed
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
              Complete All {selectedIds.length} Selected Reservations
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please before you bark all {selectedIds.length} selected
              reservations as completed, be shure because this action can't be
              undone
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
              disabled={isLoading}
              className="w-full"
              isLoading={isLoading}
              onClick={handleDelete}
              type="button"
            >
              Mark as completed
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
