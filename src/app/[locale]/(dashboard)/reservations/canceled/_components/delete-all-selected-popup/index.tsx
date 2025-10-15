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

export default function DeleteAllSelectedReservationsPopup({
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
        "deleted"
      );
      // update all selected canceled reservations to deleted status
      if (res) {
        // if change the status
        if (changeStatus) {
          change_many_reservations_status(selectedIds, "deleted");
        } else {
          // delete all items from the store
          remove_many_reservations(selectedIds);
        }
        // unselect all checked items
        unSelectedAll();
      }
      setOpen(false);
      // adding a toast
      toast.success("Selected Reservations Archived Successfully");
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
          className="gap-2 font-normal disabled:opacity-50 border-destructive hover:bg-transparent bg-transparent hover:text-destructive text-destructive"
        >
          <HiOutlineTrash className="size-4" /> Archive all {selectedIds.length}{" "}
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
              Move All {selectedIds.length} Selected To Trash
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please before you move all {selectedIds.length} selected
              reservations to trash, be shure because this action can't be
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
              className="w-full bg-red-500 hover:bg-red-400"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleDelete}
              type="button"
            >
              Move all to trash
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
