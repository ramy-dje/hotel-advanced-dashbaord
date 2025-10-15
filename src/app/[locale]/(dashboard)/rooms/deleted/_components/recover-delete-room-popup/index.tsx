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
import { crud_recover_room } from "@/lib/curd/room";
import useRoomsStore from "../../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string | null;
}

export default function RecoverDeletedRoomPopup({ id, open, setOpen }: Props) {
  // rooms store hook
  const { remove_room } = useRoomsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecover = async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_recover_room(id);
      // remove the room from the store
      if (res) {
        remove_room(id);
      }
      setOpen(false);
      // adding a toast
      toast.success("Room Recovered Successfully");
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
            <DialogTitle className="mb-2">Recover Room</DialogTitle>
            <DialogDescription className="text-foreground">
              Once recovered, this room will be restored to the rooms list.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-3">
            {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
          </div>
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
              Recover
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
