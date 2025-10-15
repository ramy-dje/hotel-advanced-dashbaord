"use client";

import type React from "react";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import {
  CreateFileValidationSchema,
  CreateFileValidationSchemaType,
} from "../validation/create-file-validation.schema";
import { Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCreateFile } from "../api-hooks";
import { HiOutlineUpload } from "react-icons/hi";
import useFileManagerStore from "../store";
import FileUpload from "@/components/file-upload";
import UsersComboboxFormItem from "./users-select-input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RolesComboboxFormItem from "./roles-select-input";

const defaultValues: CreateFileValidationSchemaType = {
  files: [],
  files_url: [],
  sharedWith: [],
  sharedWithRoles: [],
  permission: "read",
};

export default function FileUploadDialog() {
  const { current_folder_id } = useFileManagerStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const createFileMutation = useCreateFile();

  const handleFileUpload = async (values: CreateFileValidationSchemaType) => {
    const sharedWith = values.sharedWith?.map((user) => ({
      principalId: user.id,
      principalType: "HotelUser",
      permission: values.permission!,
    }));

    const sharedWithRoles = values.sharedWithRoles?.map((role) => ({
      roleId: role.id,
      permission: values.permission!,
    }));

    try {
      await createFileMutation.mutateAsync({
        files: values.files,
        parentId: current_folder_id,
        sharedWith,
        sharedWithRoles,
      });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to upload file",
      });
    }
  };
  const form = useForm<CreateFileValidationSchemaType>({
    resolver: zodResolver(CreateFileValidationSchema),
    defaultValues,
  });

  const handleClose = () => {
    setIsOpen(false);
    // reset the form
    form.reset(defaultValues);
  };

  return (
    <>
      <Button
        className="gap-2 font-normal w-1/2 md:w-auto"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <HiOutlineUpload className="size-4" /> Upload
      </Button>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-[999]">
        <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm ease-out data-closed:opacity-0" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform space-y-4 p-4 rounded-lg bg-background text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <DialogTitle className="flex items-center justify-between text-lg font-medium leading-6">
                <h3>Upload File</h3>
                <CloseButton
                  as={Button}
                  variant="link"
                  className={
                    "p-1 flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-muted-foreground"
                  }
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </CloseButton>
              </DialogTitle>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFileUpload)}
                  className="grid gap-4 py-4 "
                >
                  <FileUpload
                    control={form.control}
                    filesFieldName="files"
                    filesUrlFieldName="files_url"
                    maxFiles={10}
                    maxFileSize={200 * 1024 * 1024} // 200MB
                    containerClassName="flex flex-col gap-2 overflow-hidden"
                  />

                  <FormField
                    control={form.control}
                    name="sharedWithRoles"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Shared with roles</FormLabel>
                        <FormControl>
                          <RolesComboboxFormItem
                            selectedRoles={field.value as any}
                            onRoleSelect={field.onChange}
                            placeholder="Select roles to share with"
                            name="roles"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sharedWith"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Shared with</FormLabel>
                        <FormControl>
                          <UsersComboboxFormItem
                            selectedUsers={field.value}
                            onUserSelect={field.onChange}
                            placeholder="Select users to share with"
                            name="users"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <div className="grid gap-2">
              <Label htmlFor="folderName">Permission</Label>
              <Select
                onValueChange={permission_controller.field.onChange}
                defaultValue={permission_controller.field.value}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="read">Viewer</SelectItem>
                  <SelectItem value="write">Editor</SelectItem>
                </SelectContent>
              </Select>
              {errors?.permission ? (
                <InlineAlert type="error">
                  {errors.permission.message}
                </InlineAlert>
              ) : null}
            </div> */}

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createFileMutation.isPending}
                      isLoading={createFileMutation.isPending}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
