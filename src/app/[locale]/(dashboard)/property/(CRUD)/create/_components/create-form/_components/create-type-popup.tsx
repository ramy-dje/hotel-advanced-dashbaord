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
  CreatePropertyTypeValidationSchema,
  CreatePropertyTypeValidationSchemaType,
} from "./create-property-type.schema";
import toast from "react-hot-toast";
import { usePropertyTypesStore } from "../../../../../store";
import { crud_create_propertyType } from "@/lib/curd/property-type";

interface Props {
  onCreated: () => void;
}

export default function CreatePropertyTypePopup({ onCreated }: Props) {
  const add_type = usePropertyTypesStore((s) => s.add_type);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePropertyTypeValidationSchemaType>({
    resolver: zodResolver(CreatePropertyTypeValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      reset();
      setError("");
    }
  }, [open, reset]);

  const handleCreate = async (data: CreatePropertyTypeValidationSchemaType) => {
    try {
      setError("");
      const res = await crud_create_propertyType({ name: data.name });

      if (res) {
        add_type(res);
        toast.success("Property type created successfully");
        setOpen(false);
        onCreated();
      }
    } catch (err: any) {
      if (err?.status === 409 || err === 409) {
        setError("This type name is already in use, please choose another.");
      } else {
        setError(err?.message || "Something went wrong, please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-normal w-1/2 md:w-auto">
          <HiOutlinePlus className="size-4" /> New Type
        </Button>
      </DialogTrigger>

      <DialogContent
        preventOutsideClose={isSubmitting}
        closeButtonDisabled={isSubmitting}
        className="max-h-[80vh] overflow-auto"
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
            <DialogTitle>Create New Property Type</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                disabled={isSubmitting}
                id="name"
                placeholder="Enter a type name"
                {...register("name")}
              />
              {errors.name && (
                <InlineAlert type="error">{errors.name.message}</InlineAlert>
              )}
              {error && (
                <InlineAlert type="error">{error}</InlineAlert>
              )}
            </div>
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
