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
import useCRMContactsStore from "../../store";
import { crud_delete_many_crm_contacts } from "@/lib/curd/crm-contact";

interface Props {
  selectedIds: string[];
  unSelectedAll: () => void;
}

export default function DeleteAllSelectedCRMContactsPopup({
  selectedIds,
  unSelectedAll,
}: Props) {
  // crm contacts
  const { remove_many_contacts } = useCRMContactsStore();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (selectedIds.length == 0) return;
    setIsLoading(true);
    setError("");
    try {
      // delete many contacts
      const res = await crud_delete_many_crm_contacts(selectedIds);
      // remove the roles from the store
      if (res) {
        remove_many_contacts(selectedIds);
      }
      // unSelect (to remove selection form the  table)
      unSelectedAll();
      // close the popup
      setOpen(false);
      // adding a toast
      toast.success("All Selected Contacts Where Deleted Successfully");
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
          <HiOutlineTrash className="size-4" /> delete all {selectedIds.length}{" "}
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
              Delete All {selectedIds.length} Selected Contacts
            </DialogTitle>
            <DialogDescription className="text-card-foreground">
              Please be shure before you delete these contacts because this
              action can not be undone.
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
              Delete all
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
