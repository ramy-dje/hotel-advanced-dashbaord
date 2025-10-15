"use client";

import type React from "react";

import { useEffect } from "react";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPen, FolderPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateFolder, useUpdateFolder } from "../api-hooks";
import {
  CreateFolderValidationSchemaType,
  getFolderValidationSchema,
} from "../validation/create-folder-validation.schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineFolderAdd } from "react-icons/hi";
import useFileManagerStore from "../store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UsersComboboxFormItem from "./users-select-input";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import RolesComboboxFormItem from "./roles-select-input";

const defaultValues: CreateFolderValidationSchemaType = {
  name: "",
  accessibility: "public",
  accessPassword: "",
  sharedWith: [],
  permission: "read",
  note: "",
};

export default function FolderFormDialog() {
  const { current_folder_id } = useFileManagerStore();
  const { toast } = useToast();
  const {
    folder_dialog: { isOpen, folder, mode },
    set_folder_dialog,
  } = useFileManagerStore();
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();

  const handleCreateFolder = async (
    values: CreateFolderValidationSchemaType
  ) => {
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
      await createFolderMutation.mutateAsync({
        name: values.name,
        accessibility: values.accessibility,
        ...(values.accessPassword
          ? { accessPassword: values.accessPassword }
          : {}),
        ...(current_folder_id ? { parentId: current_folder_id } : {}),
        sharedWith,
        sharedWithRoles,
        note: values.note,
      });

      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to create folder",
      });
    }
  };

  const handleUpdateFolder = async (
    values: CreateFolderValidationSchemaType
  ) => {
    try {
      await updateFolderMutation.mutateAsync({
        folderId: folder!.id,
        name: values.name,
        accessibility: values.accessibility,
        ...(values.accessPassword
          ? { accessPassword: values.accessPassword }
          : {}),
        ...(current_folder_id ? { currentFolderId: current_folder_id } : {}),
        note: values.note,
      });

      toast({
        title: "Success",
        description: "Folder updated successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to update folder",
      });
    }
  };
  const validationSchema = getFolderValidationSchema(mode);
  const form = useForm<CreateFolderValidationSchemaType>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const accessibility = useWatch({
    control: form.control,
    name: "accessibility",
  });

  const handleClose = () => {
    form.reset(defaultValues);
    set_folder_dialog({ isOpen: false, mode: "create" });
  };

  useEffect(() => {
    if (isOpen && folder && mode === "update") {
      form.reset({
        name: folder.name,
        accessibility: folder.accessibility,
        note: folder.note,
        accessPassword: "",
      });
    }
  }, [isOpen, folder, form, mode]);
  return (
    <>
      <Button
        className="gap-2 font-normal w-1/2 md:w-auto"
        variant={"secondary"}
        onClick={() => set_folder_dialog({ isOpen: true, mode: "create" })}
      >
        <HiOutlineFolderAdd className="size-4" /> New Folder
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
                <h3>
                  {mode === "create" ? "Create New Folder" : "Update folder"}
                </h3>
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
                  onSubmit={form.handleSubmit(
                    mode === "create" ? handleCreateFolder : handleUpdateFolder
                  )}
                  className="w-full space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Folder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter folder name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessibility"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4 items-center"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="public" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Public
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="protected" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Private
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {accessibility === "protected" && (
                    <FormField
                      control={form.control}
                      name="accessPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {mode === "create" && (
                    <>
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
                            <FormLabel>Share with</FormLabel>
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
                    </>
                  )}
                  {/* <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="read">Viewer</SelectItem>
                        <SelectItem value="write">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                  <DialogFooter>
                    <Button
                      type="submit"
                      isLoading={
                        mode === "create"
                          ? createFolderMutation.isPending
                          : updateFolderMutation.isPending
                      }
                    >
                      {mode === "create" ? (
                        <>
                          <FolderPlus className="mr-2 h-4 w-4" />
                          Create Folder
                        </>
                      ) : (
                        <>
                          <FolderPen className="mr-2 h-4 w-4" />
                          Update Folder
                        </>
                      )}
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
