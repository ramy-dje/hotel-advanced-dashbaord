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
  changeStatus?: boolean; // whether to change the status of the reservation or remove it from the store
}

export default function CancelAllPendingSelectedReservationsPopup({
  selectedIds,
  unSelectedAll,
  changeStatus = false,
}: Props) {
  // reservations store hook
  const { remove_many_reservations, change_many_reservations_status } =
    useReservationsStore();
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
        "canceled"
      );
      // update all selected pending reservations to canceled status
      if (res) {
        // if change the status
        if (changeStatus) {
          // change the status of the reservations in store
          change_many_reservations_status(selectedIds, "canceled");
        } else {
          // delete all the reservations from the store
          remove_many_reservations(selectedIds);
        }
        // unselect all checked items
        unSelectedAll();
      }
      setOpen(false);
      // adding a toast
      toast.success("Selected Reservations Where Canceled Successfully");
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
          variant="destructive"
          className="gap-2 font-normal bg-transparent hover:bg-destructive/20 disabled:opacity-30 text-destructive border-destructive border"
        >
          <HiOutlineTrash className="size-4" /> Cancel all {selectedIds.length}{" "}
          selected
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
              Cancel All {selectedIds.length} Selected Pending Reservations
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please confirm that you want to cancel all {selectedIds.length}{" "}
              selected pending reservations. You can recover them later if
              needed.
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
              className="w-full bg-red-500 hover:bg-red-400"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleDelete}
              type="button"
            >
              Cancel all
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
