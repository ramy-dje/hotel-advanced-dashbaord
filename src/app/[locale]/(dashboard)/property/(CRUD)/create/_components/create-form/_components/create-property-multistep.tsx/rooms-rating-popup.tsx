import { useState, useEffect } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RoomType, RoomRating } from "@/interfaces/property.interface";

interface Props {
  roomType: RoomType;
  onSave: (updatedType: RoomType) => void;
  ratings: RoomRating[];
}

export default function EditRoomTypePopup({ roomType, onSave, ratings }: Props) {
  const [open, setOpen] = useState(false);
  const [typeName, setTypeName] = useState(roomType.typeName);
  const [selectedStatus, setSelectedStatus] = useState(roomType.status);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Manually manage submitting state

  // Initialize form fields when dialog opens or roomType changes
  useEffect(() => {
    if (open) {
      setTypeName(roomType.typeName);
      setSelectedStatus(roomType.status);
      setError(""); // Clear any previous errors
    }
  }, [open, roomType]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setError("");

    // Basic validation (you can add more complex logic if needed)
    if (!typeName.trim()) {
      setError("Type name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!selectedStatus) {
      setError("Class level is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create updated type object
      const updatedType: RoomType = {
        ...roomType,
        typeName: typeName.trim(),
        status: selectedStatus,
      };
      
      onSave(updatedType); // Call the onSave prop with the updated room type
      toast.success("Room type updated successfully");
      setOpen(false); // Close the dialog on success
    } catch (err: any) {
      setError(err?.message || "Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HiOutlinePencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md w-full"
        onEscapeKeyDown={isSubmitting ? (e) => e.preventDefault() : undefined}
      >
        <form
          spellCheck={false}
          onSubmit={handleUpdate}
          className="h-full flex flex-col gap-6 justify-between"
        >
          <DialogHeader>
            <DialogTitle>Edit Room Type</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                disabled={isSubmitting}
                id="name"
                placeholder="Enter a type name"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
              {error && error.includes("Type name") && ( // Simple error display
                <InlineAlert type="error">{error}</InlineAlert>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Class Level</Label>
              <Select
                onValueChange={setSelectedStatus}
                value={selectedStatus}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class level" />
                </SelectTrigger>
                <SelectContent>
                  {ratings.map((rating) => (
                    <SelectItem key={rating.id} value={rating.id}>
                      <div className="flex items-center gap-2">
                        <span>{rating.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && error.includes("Class level") && ( // Simple error display
                <InlineAlert type="error">{error}</InlineAlert>
              )}
            </div>
            
            {error && !error.includes("Type name") && !error.includes("Class level") && (
              <InlineAlert type="error">{error}</InlineAlert>
            )}
          </div>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button
                className="w-[6em]"
                disabled={isSubmitting}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-[6em]"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}