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
import { crud_delete_blog_category } from "@/lib/curd/blog-category";
import toast from "react-hot-toast";
import useBlogCategoriesStore from "../../store";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string | null;
}

export default function DeleteBlogCategoryPopup({ id, open, setOpen }: Props) {
  const { remove_category } = useBlogCategoriesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_delete_blog_category(id);
      // delete the category in the store
      if (res) {
        remove_category(id);
      }
      setOpen(false);
      // adding a toast
      toast.success("Category Delete Successful");
    } catch (err) {
      if (err == 403) {
        setError("Category is used other by blog and can't be deleted");
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
            <DialogTitle className="mb-2">Delete Category</DialogTitle>
            <DialogDescription className="text-accent-foreground">
              Are you sure you want to delete this category? This action will
              also remove the category from all associated posts.
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
