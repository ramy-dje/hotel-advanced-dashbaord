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
import useUsersStore from "../../store";
import { crud_update_user_activation_status } from "@/lib/curd/user";
import { cn } from "@/lib/utils";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  user: { name: string; id: string; active: boolean } | null;
}

export default function ActiveUserPopup({ user, open, setOpen }: Props) {
  // roles store hook
  const { update_user_active_status } = useUsersStore();

  // status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActive = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_update_user_activation_status(
        user.id,
        !user.active
      );
      if (res) {
        // change the user active status in the store
        update_user_active_status(user.id, !user.active);
      }
      setOpen(false);
      // adding a toast
      toast.success(
        `User Account Was ${
          user.active ? "Deactivated" : "Activated"
        } Successful`
      );
    } catch (err) {
      console.log("ERROR ", err);
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
            <DialogTitle className="mb-2">
              Activating & Deactivating User
            </DialogTitle>
            <DialogDescription className="text-foreground">
              {user?.active ? "Deactivating" : "Activating"}{" "}
              <span className="text-primary">{user?.name}</span>'s account will{" "}
              {user?.active
                ? "prevent him from accessing and using the dashboard."
                : "allow him to access and use the dashboard."}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-3">
            {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
          </div>
          <DialogFooter className="w-full flex !flex-col-reverse gap-2">
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
              className={cn(
                "w-full !ml-0 border",
                user?.active
                  ? "bg-red-500/30 text-red-700 hover:bg-red-500/40 border-red-500/60"
                  : "bg-green-500/30 text-green-700 hover:bg-green-500/40 border-green-500/60",
                isLoading && "opacity-60"
              )}
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleActive}
              type="button"
            >
              {user?.active ? "Deactivate Account" : "Activate Account"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
