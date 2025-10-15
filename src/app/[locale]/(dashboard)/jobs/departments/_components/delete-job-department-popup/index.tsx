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
import { crud_delete_job_department } from "@/lib/curd/job-department";
import toast from "react-hot-toast";
import useJobDepartmentsStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string | null;
}

export default function DeleteJobDepartmentPopup({ id, open, setOpen }: Props) {
  // store hook
  const { remove_department } = useJobDepartmentsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_delete_job_department(id);
      // delete the department in the current list
      if (res) {
        // remove the department from the store
        remove_department(id);
      }
      setOpen(false);
      // adding a toast
      toast.success("Department Delete Successful");
    } catch (err) {
      if (err == 403) {
        setError("Department is used by jobs and can't be deleted");
      } else {
        setError("Something went wrong ,please try again");
      }
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
            <DialogTitle className="mb-2">Delete Department</DialogTitle>
            <DialogDescription className="text-accent-foreground">
              Please before you delete this department ,change all other jobs
              that use this department to other one
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
