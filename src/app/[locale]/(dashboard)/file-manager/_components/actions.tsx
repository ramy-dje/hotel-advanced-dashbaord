"use client";
import { PageLayoutHeaderActions } from "@/components/page-layout";
import useAccess from "@/hooks/use-access";
import React from "react";
import NewFolderDialog from "./folder-form-dialog";
import FileUploadDialog from "./file-upload-dialog";

export default function FileManagerActions() {
  const { has } = useAccess();
  return (
    <PageLayoutHeaderActions>
      {/* create new folder */}
      {has(["file_manager:create"]) ? <NewFolderDialog /> : null}
      {/* upload file */}
      {has(["file_manager:create"]) ? <FileUploadDialog /> : null}
    </PageLayoutHeaderActions>
  );
}
