"use client";

import { FileInterface } from "@/interfaces/file-manager";

import {
  useDeleteShareFilePermission,
  useDeleteShareFileWithRolesPermission,
  useGetShareFileInfos,
  useGetShareFileWithRolesInfos,
  useShareFile,
  useShareFileWithRoles,
} from "../api-hooks";

import ShareDialog from "./share-dialog";

interface ShareFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileInterface | null;
}

export default function ShareFileDialog({
  isOpen,
  onClose,
  file,
}: ShareFileDialogProps) {
  if (!file) return null;

  return (
    <ShareDialog
      id={file.id}
      isOpen={isOpen}
      onClose={onClose}
      title="Share File"
      type="file"
      useGetShareInfos={useGetShareFileInfos}
      useShare={useShareFile}
      useDeleteSharedPermission={useDeleteShareFilePermission}
      useGetShareWithRolesInfos={useGetShareFileWithRolesInfos}
      useShareWithRole={useShareFileWithRoles}
      useDeleteSharedWithRolePermission={useDeleteShareFileWithRolesPermission}
    />
  );
}
