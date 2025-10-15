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
import { crud_update_many_reservations_statuses } from "@/lib/curd/reservations";
import useReservationsStore from "../../../store";

interface Props {
  selectedIds: string[];
  unSelectedAll: () => void;
  changeStatus?: boolean; // whether to change the status of the reservation or remove it from the store
}

export default function RecoverAllSelectedReservationsPopup({
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

  const handleRecover = async () => {
    if (selectedIds.length == 0) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_many_reservations_statuses(
        selectedIds,
        "pending"
      );
      // update all selected canceled reservations to pending status
      if (res) {
        // if change the status
        if (changeStatus) {
          change_many_reservations_status(selectedIds, "pending");
        } else {
          // delete all items from the store
          remove_many_reservations(selectedIds);
        }
        // unselect all checked items
        unSelectedAll();
      }
      setOpen(false);
      // adding a toast
      toast.success("Selected Reservations Where Recovered Successfully");
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
          <HiOutlineRefresh className="size-4" /> Recover all{" "}
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
              Recover All {selectedIds.length} Selected Canceled Reservations
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please confirm that you want to recover all {selectedIds.length}{" "}
              selected reservations. Once recovered, all selected reservations
              will be marked as pending.
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
