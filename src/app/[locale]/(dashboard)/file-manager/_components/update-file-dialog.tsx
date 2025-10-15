"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useUpdateFile } from "../api-hooks";
import { useToast } from "@/hooks/use-toast";
import { FileInterface } from "@/interfaces/file-manager";
import {
  UpdateFileValidationSchema,
  UpdateFileValidationSchemaType,
} from "../validation/edit-file-validation.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InlineAlert from "@/components/ui/inline-alert";
import { useEffect } from "react";
import useFileManagerStore from "../store";

interface UpdateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileInterface | null;
}

export default function UpdateFileDialog({
  isOpen,
  onClose,
  file,
}: UpdateFileDialogProps) {
  const { current_folder_id } = useFileManagerStore();
  const { toast } = useToast();
  const updateFileMutation = useUpdateFile();
  // Helper function to split file name into name and extension
  const splitFileName = (fileName: string) => {
    const match = fileName.match(/^(.+)\.([a-zA-Z0-9]+)$/);
    if (match) {
      return {
        name: match[1], // Base name
        extension: match[2], // File extension
      };
    }
    return {
      name: fileName, // If no extension, treat the whole string as the name
      extension: "",
    };
  };

  const { name: initialName, extension } = splitFileName(
    file?.originalname || ""
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<UpdateFileValidationSchemaType>({
    resolver: zodResolver(UpdateFileValidationSchema),
    defaultValues: {
      originalname: initialName, // Set initial value for originalname
    },
  });

  const handleUpdateFile = async (values: UpdateFileValidationSchemaType) => {
    try {
      await updateFileMutation.mutateAsync({
        fileId: file!.id,
        originalname: `${values.originalname}.${extension}`,
        alt: values?.alt,
        currentFolderId: current_folder_id,
      });

      toast({
        title: "Success",
        description: "File updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to update file",
      });
    }
  };

  useEffect(() => {
    if (isOpen && file) {
      const { name } = splitFileName(file.originalname || "");
      reset({ originalname: name, alt: file?.alt });
    }
  }, [isOpen, file, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update file</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdateFile)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="Enter file name"
              {...register("originalname", { required: true })}
              disabled={updateFileMutation.isPending}
            />

            {errors?.originalname ? (
              <InlineAlert type="error">
                {errors.originalname.message}
              </InlineAlert>
            ) : null}
          </div>
          {file?.type === "image" && (
            <div className="grid gap-2">
              <Label htmlFor="alt">alt</Label>
              <Input
                id="alt"
                placeholder="Enter alt"
                {...register("alt", { required: true })}
                disabled={updateFileMutation.isPending}
              />

              {errors?.alt ? (
                <InlineAlert type="error">{errors.alt.message}</InlineAlert>
              ) : null}
            </div>
          )}
          <DialogFooter>
            <Button type="submit" isLoading={updateFileMutation.isPending}>
              <Pencil className="mr-2 h-4 w-4" />
              Update file
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
