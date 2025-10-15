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
} from "@/components/ui/dialog";
import { useState } from "react";
import InlineAlert from "@/components/ui/inline-alert";
import toast from "react-hot-toast";
import { crud_delete_roomFeature } from "@/lib/curd/room-features";
import useRoomFeaturesStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string | null;
}

export default function DeleteRoomFeaturePopup({ id, open, setOpen }: Props) {
  // room features store hook
  const { remove_feature } = useRoomFeaturesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_delete_roomFeature(id);
      // delete the feature from the store
      if (res) {
        remove_feature(id);
      }
      setOpen(false);
      // adding a toast
      toast.success("Feature Deleted Successful");
    } catch (err) {
      setError("Something went wrong ,please try again");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <DialogTitle className="mb-2">Delete Room Feature</DialogTitle>
            <DialogDescription className="text-foreground">
              Please be shure before you delete this feature because this action
              can not be undone
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
              Delete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
