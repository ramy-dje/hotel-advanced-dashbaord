import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CreatePropertyDirectoryValidationSchema,
  CreatePropertyDirectoryValidationSchemaType,
} from "./create-property-directory.schema";
import { crud_create_propertyDirectory } from "@/lib/curd/property-directory";
import toast from "react-hot-toast";
import { usePropertyDirectoriesStore } from "../../../../../store";

interface Props {
  onCreated: () => void; // callback to tell parent “refresh your list”
}

export default function CreatePropertyDirectoryPopup({ onCreated }: Props) {
  const add_directory = usePropertyDirectoriesStore((s) => s.add_directory);
  const directories = usePropertyDirectoriesStore((s) => s.directories);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePropertyDirectoryValidationSchemaType>({
    resolver: zodResolver(CreatePropertyDirectoryValidationSchema),
    defaultValues: {
      name: "",
      type: "top-level",
      parent_id: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  // Watch directory type to conditionally show parent selector
  const directoryType = watch("type");

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setError("");
    }
  }, [open, reset]);

  const handleCreate = async (
    data: CreatePropertyDirectoryValidationSchemaType
  ) => {
    try {
      setError("");
      const payload = {
        name: data.name,
        type: data.type,
        parent_id: data.type === "subdirectory" ? data.parent_id : undefined,
      };
      
      const res = await crud_create_propertyDirectory(payload);
      
      if (res) {
        add_directory(res);
        toast.success(
          `${
            data.type === "subdirectory" ? "Subdirectory" : "Directory"
          } created successfully`
        );
        setOpen(false);
        onCreated();
      }
    } catch (err: any) {
      if (err?.status === 409 || err === 409) {
        setError("This directory name is already in use, please choose another.");
      } else {
        setError(err?.message || "Something went wrong, please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Directory
        </Button>
      </DialogTrigger>

      <DialogContent
        preventOutsideClose={isSubmitting}
        closeButtonDisabled={isSubmitting}
        className="max-h-[80vh] w-[48rem] overflow-auto"
        onEscapeKeyDown={
          isSubmitting
            ? (e) => e.preventDefault()
            : undefined
        }
      >
        <form
          spellCheck={false}
          onSubmit={handleSubmit(handleCreate)}
          className="h-full flex flex-col gap-6 justify-between"
        >
          <DialogHeader>
            <DialogTitle>Create New Property Directory</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-4">
            {/* Directory Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Directory Name</Label>
              <Input
                disabled={isSubmitting}
                id="name"
                placeholder="Directory Name"
                {...register("name")}
              />
              {errors.name && (
                <InlineAlert type="error">{errors.name.message}</InlineAlert>
              )}
            </div>

            {/* Directory Type */}
            <div className="grid gap-2">
              <Label>Directory Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="top-level"
                    disabled={isSubmitting}
                    {...register("type")}
                    className="accent-primary"
                  />
                  Top-level Directory
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="subdirectory"
                    disabled={isSubmitting}
                    {...register("type")}
                    className="accent-primary"
                  />
                  Subdirectory
                </label>
              </div>
              {errors.type && (
                <InlineAlert type="error">{errors.type.message}</InlineAlert>
              )}
            </div>

            {/* Parent Directory Selector (Conditional) */}
            {directoryType === "subdirectory" && (
              <div className="grid gap-2">
                <Label htmlFor="parent_id">Parent Directory</Label>
                <Select
                  onValueChange={(value) => setValue("parent_id", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent directory" />
                  </SelectTrigger>
                  <SelectContent>
                    {directories
                      .filter((d) => !d.parent_id) // Only show top-level directories as parents
                      .map((directory) => (
                        <SelectItem key={directory.id} value={directory.id}>
                          {directory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.parent_id && (
                  <InlineAlert type="error">
                    {errors.parent_id.message}
                  </InlineAlert>
                )}
              </div>
            )}

            {error && <InlineAlert type="error">{error}</InlineAlert>}
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}