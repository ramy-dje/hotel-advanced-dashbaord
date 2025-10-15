import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UsersComboboxFormItem from "./users-select-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAvatarName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { HiTrash } from "react-icons/hi";
import { useForm, useWatch } from "react-hook-form";
import { SharedWith, SharedWithRoles } from "@/interfaces/file-manager";
import {
  ShareWithRolesValidationSchema,
  ShareWithRolesValidationSchemaType,
  ShareWithValidationSchema,
  ShareWithValidationSchemaType,
} from "../validation/share-with-validation.schema";
import { useToast } from "@/hooks/use-toast";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import RolesComboboxFormItem from "./roles-select-input";
import { TooltipCard } from "@/components/tooltip-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { RiFolderSharedLine } from "react-icons/ri";

const UserItem = ({
  user,
  removeAccess,
  useDeleteSharedPermission,
}: {
  user: SharedWith;
  removeAccess: (
    userId: string,
    deleteSharedPermission: UseMutationResult<
      boolean,
      Error,
      {
        id: string;
        principalId: string;
      },
      unknown
    >
  ) => Promise<any>;
  useDeleteSharedPermission: ShareDialogProps["useDeleteSharedPermission"];
}) => {
  const deleteSharedPermission = useDeleteSharedPermission();
  return (
    <div key={user.id} className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={user?.pic}
            alt={getAvatarName(user?.fullName ?? "")}
          />
          <AvatarFallback>{getAvatarName(user?.fullName ?? "")}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium leading-none">
          {user?.fullName ?? ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* <Select
                        value={user.permission}
                        onValueChange={(value) =>
                          updatePermission(
                            user.principalId,
                            value as FileInterface["sharedWith"][0]["permission"]
                          )
                        }
                        disabled={updateSharedFilePermission.isPending}
                        
                      >
                        <SelectTrigger className="h-8 w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="read">Viewer</SelectItem>
                          <SelectItem value="write">Editor</SelectItem>
                        </SelectContent>
                      </Select> */}

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => removeAccess(user.id, deleteSharedPermission)}
          disabled={deleteSharedPermission.isPending}
          isLoading={deleteSharedPermission.isPending}
          className="text-muted-foreground hover:text-destructive-foreground hover:bg-destructive"
        >
          <HiTrash className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const RoleItem = ({
  role,
  removeAccess,
  useDeleteSharedPermission,
}: {
  role: SharedWithRoles;
  removeAccess: (
    userId: string,
    deleteSharedPermission: UseMutationResult<
      boolean,
      Error,
      {
        id: string;
        roleId: string;
      },
      unknown
    >
  ) => Promise<any>;
  useDeleteSharedPermission: ShareDialogProps["useDeleteSharedWithRolePermission"];
}) => {
  const deleteSharedPermission = useDeleteSharedPermission();
  return (
    <div
      key={role.roleId}
      style={
        role.role
          ? {
              borderColor: role.role.color,
            }
          : undefined
      }
      className={cn(
        "flex items-center justify-between",
        role.role && "border-l-[3px] rounded-l-none px-2"
      )}
    >
      <p className="text-sm font-medium leading-none">
        {role?.role?.name ?? role.roleId}
      </p>
      <div className="flex items-center gap-2">
        {/* <Select
                        value={role.permission}
                        onValueChange={(value) =>
                          updatePermission(
                            role.roleId,
                            value as FileInterface["sharedWith"][0]["permission"]
                          )
                        }
                        disabled={updateSharedFilePermission.isPending}
                        
                      >
                        <SelectTrigger className="h-8 w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="read">Viewer</SelectItem>
                          <SelectItem value="write">Editor</SelectItem>
                        </SelectContent>
                      </Select> */}

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => removeAccess(role.roleId, deleteSharedPermission)}
          disabled={deleteSharedPermission.isPending}
          isLoading={deleteSharedPermission.isPending}
          className="text-muted-foreground hover:text-destructive-foreground hover:bg-destructive"
        >
          <HiTrash className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export const defaultValues: ShareWithValidationSchemaType = {
  sharedWith: [],
  permission: "read",
};
export const shareWithRolesDefaultValues: ShareWithRolesValidationSchemaType = {
  sharedWithRoles: [],
  permission: "read",
};

type ShareDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "file" | "folder";
  id: string;
  // share with user Ids
  useGetShareInfos: (id?: string | null) => UseQueryResult<SharedWith[], Error>;
  useShare: () => UseMutationResult<
    any,
    Error,
    {
      sharedWith: {
        principalId: string;
        principalType: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    },
    unknown
  >;
  useUpdateSharedPermission?: () => UseMutationResult<
    any,
    Error,
    {
      id: string;
      principalId: string;
      permission: "admin" | "read" | "write";
    },
    unknown
  >;
  useDeleteSharedPermission: () => UseMutationResult<
    boolean,
    Error,
    {
      id: string;
      principalId: string;
    },
    unknown
  >;
  // share with role Ids
  useGetShareWithRolesInfos: (
    id?: string | null
  ) => UseQueryResult<SharedWithRoles[], Error>;
  useShareWithRole: () => UseMutationResult<
    any,
    Error,
    {
      sharedWithRoles: {
        roleId: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    },
    unknown
  >;
  useUpdateSharedWithRolePermission?: () => UseMutationResult<
    any,
    Error,
    {
      id: string;
      roleId: string;
      permission: "admin" | "read" | "write";
    },
    unknown
  >;
  useDeleteSharedWithRolePermission: () => UseMutationResult<
    boolean,
    Error,
    {
      id: string;
      roleId: string;
    },
    unknown
  >;
};

export default function ShareDialog({
  isOpen,
  onClose,
  title,
  id,
  type,
  useGetShareInfos,
  useShare,
  useDeleteSharedPermission,
  useGetShareWithRolesInfos,
  useShareWithRole,
  useDeleteSharedWithRolePermission,
}: ShareDialogProps) {
  const { toast } = useToast();
  const form = useForm<ShareWithValidationSchemaType>({
    resolver: zodResolver(ShareWithValidationSchema),
    defaultValues,
  });
  const shareWithRolesForm = useForm<ShareWithRolesValidationSchemaType>({
    resolver: zodResolver(ShareWithRolesValidationSchema),
    defaultValues: shareWithRolesDefaultValues,
  });
  const newUsers = useWatch({ control: form.control, name: "sharedWith" });

  // handle share with user ids
  const {
    data: sharedWith,
    isLoading: isSharedWithLoading,
    isError: isSharedWithError,
    error: sharedWithError,
  } = useGetShareInfos(id);

  const share = useShare();

  // const updatePermission = async (
  //   userId: string,
  //   newPermission: FileInterface["sharedWith"][0]["permission"]
  // ) => {
  //   try {
  //     await updateSharedFilePermission.mutateAsync({
  //       fileId: file.id,
  //       principalId: userId,
  //       permission: newPermission,
  //     });

  //     toast({
  //       title: "Permission updated",
  //       description: "User permission has been successfully updated.",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Failed to update permission",
  //       description:
  //         (error as any).response?.data?.message ?? "There was an error updating the permission. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // Function to remove a user's access
  const removeAccess = async (
    userId: string,
    deleteSharedPermission: UseMutationResult<
      boolean,
      Error,
      {
        id: string;
        principalId: string;
      },
      unknown
    >
  ) => {
    try {
      await deleteSharedPermission.mutateAsync({
        id,
        principalId: userId,
      });

      toast({
        title: "Access removed",
        description: "User access has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to remove access",
        description:
          (error as any).response?.data?.message ??
          "There was an error removing access. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to invite a new user
  const inviteUsers = async (values: ShareWithValidationSchemaType) => {
    const sharedWith = values.sharedWith!.map((user) => ({
      principalId: user.id,
      principalType: "HotelUser",
      permission: values.permission!,
    }));
    try {
      await share.mutateAsync({
        id,
        sharedWith,
      });
      form.reset(defaultValues);
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description:
          (error as any).response?.data?.message ??
          "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // handle share with role ids
  const {
    data: sharedWithRoles,
    isLoading: isSharedWithRolesLoading,
    isError: isSharedWithRolesError,
    error: sharedWithRolesError,
  } = useGetShareWithRolesInfos(id);

  const shareWithRole = useShareWithRole();

  // Function to invite a new user with roles
  const inviteUsersWithRoles = async (
    values: ShareWithRolesValidationSchemaType
  ) => {
    const sharedWithRoles =
      values.sharedWithRoles?.map((role) => ({
        roleId: role.id,
        permission: values.permission!,
      })) || [];
    try {
      await shareWithRole.mutateAsync({
        id,
        sharedWithRoles,
      });
      shareWithRolesForm.reset(shareWithRolesDefaultValues);
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description:
          (error as any).response?.data?.message ??
          "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeRoleAccess = async (
    roleId: string,
    deleteSharedPermission: UseMutationResult<
      boolean,
      Error,
      {
        id: string;
        roleId: string;
      },
      unknown
    >
  ) => {
    try {
      await deleteSharedPermission.mutateAsync({
        id,
        roleId,
      });

      toast({
        title: "Access removed",
        description: "User access has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to remove access",
        description:
          (error as any).response?.data?.message ??
          "There was an error removing access. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-[999]">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform space-y-4 p-4 rounded-lg bg-background text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle className="flex items-center justify-between text-lg font-medium leading-6">
              <h3>{title}</h3>
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

            <Form {...shareWithRolesForm}>
              <form
                onSubmit={shareWithRolesForm.handleSubmit(inviteUsersWithRoles)}
                className="w-full space-y-4"
              >
                <FormField
                  control={shareWithRolesForm.control}
                  name="sharedWithRoles"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Grants {type} access to a role</FormLabel>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 w-full">
                          <FormControl>
                            <RolesComboboxFormItem
                              selectedRoles={field.value as any}
                              onRoleSelect={field.onChange}
                              placeholder={`Gives a role permission to access the ${type}`}
                              name="roles"
                              sharedWithRoles={sharedWithRoles}
                            />
                          </FormControl>
                        </div>
                        <TooltipCard description="Save">
                          <Button
                            type="submit"
                            size="icon"
                            disabled={field.value?.length === 0}
                            isLoading={shareWithRole.isPending}
                          >
                            <RiFolderSharedLine className="size-5" />
                          </Button>
                        </TooltipCard>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Separator />

            {/* roles list section */}
            <div className="max-h-[300px] overflow-y-auto space-y-4">
              {isSharedWithRolesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {(sharedWithRolesError as any).response?.data?.message ??
                      "Failed to fetch share information. Please try again."}
                  </AlertDescription>
                </Alert>
              ) : isSharedWithRolesLoading ? (
                [...Array(3)].map((_, index) => (
                  <div
                    className="flex items-center space-x-4"
                    key={`user-loading-${index}`}
                  >
                    <Skeleton className="size-4 w-[250px]" />
                  </div>
                ))
              ) : sharedWithRoles?.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No roles have access to this {type} yet
                </div>
              ) : (
                sharedWithRoles?.map((role) => (
                  <RoleItem
                    key={role.roleId}
                    role={role}
                    removeAccess={removeRoleAccess}
                    useDeleteSharedPermission={
                      useDeleteSharedWithRolePermission
                    }
                  />
                ))
              )}
            </div>
            <Separator />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(inviteUsers)}
                className="w-full space-y-4"
              >
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
                          placeholder="Select a contact to share with"
                          name="users"
                          sharedWith={sharedWith}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Separator />

                {/* User list section */}
                <div className="max-h-[300px] overflow-y-auto space-y-4">
                  {isSharedWithError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {(sharedWithError as any).response?.data?.message ??
                          "Failed to fetch share information. Please try again."}
                      </AlertDescription>
                    </Alert>
                  ) : isSharedWithLoading ? (
                    [...Array(3)].map((_, index) => (
                      <div
                        className="flex items-center space-x-4"
                        key={`user-loading-${index}`}
                      >
                        <Skeleton className="size-10 rounded-full" />

                        <Skeleton className="size-4 w-[250px]" />
                      </div>
                    ))
                  ) : sharedWith?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No contact have access to this {type} yet
                    </div>
                  ) : (
                    sharedWith?.map((user) => (
                      <UserItem
                        key={user.id}
                        user={user}
                        removeAccess={removeAccess}
                        useDeleteSharedPermission={useDeleteSharedPermission}
                      />
                    ))
                  )}
                </div>
                <Separator />
                <DialogFooter>
                  <Button
                    type="submit"
                    isLoading={share.isPending}
                    disabled={newUsers?.length === 0}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
