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
import { crud_update_all_canceled_reservations_statuses_to_deleted } from "@/lib/curd/reservations";
import useReservationsStore from "../../../store";

interface Props {
  disabled: boolean;
}

export default function DeleteAllCanceledReservationsPopup({
  disabled,
}: Props) {
  // reservations store hook
  const { remove_all_reservations } = useReservationsStore();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res =
        await crud_update_all_canceled_reservations_statuses_to_deleted();
      // change all canceled reservations to deleted status
      if (res) {
        // remove all reservations from the store
        remove_all_reservations();
      }
      setOpen(false);
      // adding a toast
      toast.success("Reservations Archived Successfully");
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
          disabled={disabled}
          variant="outline"
          className="gap-2 font-normal disabled:opacity-50 border-destructive hover:bg-transparent bg-transparent hover:text-destructive text-destructive"
        >
          <HiOutlineTrash className="size-4" /> Archive all
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
            <DialogTitle className="mb-2">Move All To Trash</DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please before you move all the reservations to trash, be shure
              because this action can't be undone
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
              Archive all
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
