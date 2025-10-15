"use client";

import { FolderInterface } from "@/interfaces/file-manager";

import {
  useDeleteShareFolderPermission,
  useDeleteShareWithRoleFolderPermission,
  useGetShareFolderInfos,
  useGetShareFolderWithRolesInfos,
  useShareFolder,
  useShareWithRolesFolder,
} from "../api-hooks";
import ShareDialog from "./share-dialog";

interface ShareFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folder: FolderInterface | null;
}

export default function ShareFolderDialog({
  isOpen,
  onClose,
  folder,
}: ShareFolderDialogProps) {
  if (!folder) return null;

  return (
    <ShareDialog
      id={folder.id}
      isOpen={isOpen}
      onClose={onClose}
      title="Share Folder"
      type="folder"
      useGetShareInfos={useGetShareFolderInfos}
      useShare={useShareFolder}
      useDeleteSharedPermission={useDeleteShareFolderPermission}
      useGetShareWithRolesInfos={useGetShareFolderWithRolesInfos}
      useShareWithRole={useShareWithRolesFolder}
      useDeleteSharedWithRolePermission={useDeleteShareWithRoleFolderPermission}
    />
  );
}
