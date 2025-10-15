"use client";

import { MoreVertical, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileInterface, FolderInterface } from "@/interfaces/file-manager";
import {
  HiLockClosed,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineShare,
  HiOutlineTrash,
} from "react-icons/hi";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import formatFileSize from "@/utils/file-size";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import useFileManagerStore from "../store";
import useAccess from "@/hooks/use-access";
import EmptyIcon from "@/components/basic-table/empty-icon";

const FileCard = ({
  file,
  onDownload,
  setPopupOpen,
}: {
  file: FileInterface;
  onDownload: (
    fileId: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
  setPopupOpen: Dispatch<
    SetStateAction<{
      fileId?: string;
      folderId?: string;
      action?: string;
    }>
  >;
}) => {
  // access info
  const { has } = useAccess();

  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  return (
    <Card
      key={file.id}
      className="hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <CardContent className="p-4 flex flex-col">
        <div className="relative flex items-start justify-between">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            {getFileIcon(file.type)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-8 w-8 hover:bg-transparent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  setPopupOpen({ fileId: file.id, action: "viewFile" })
                }
              >
                <HiOutlineEye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              {has(["file_manager:share"]) ? (
                <DropdownMenuItem
                  onClick={() =>
                    setPopupOpen({
                      fileId: file.id,
                      action: "shareFile",
                    })
                  }
                >
                  <HiOutlineShare className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
              ) : null}
              {has(["file_manager:update"]) ? (
                <DropdownMenuItem
                  onClick={() =>
                    setPopupOpen({ fileId: file.id, action: "editFile" })
                  }
                >
                  <HiOutlinePencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => onDownload(file.id, setIsDownloadLoading)}
                disabled={isDownloadLoading}
              >
                {isDownloadLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />{" "}
                    Downloading...
                  </>
                ) : (
                  <>
                    <HiOutlineDownload className="mr-2 size-4" />
                    Download
                  </>
                )}
              </DropdownMenuItem>
              {has(["file_manager:delete"]) ? (
                <DropdownMenuItem
                  onClick={() =>
                    setPopupOpen({ fileId: file.id, action: "deleteFile" })
                  }
                >
                  <HiOutlineTrash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h4 className="mb-1 truncate text-sm font-medium text-foreground w-full">
          {file.originalname}
        </h4>
        <div className="text-sm text-muted-foreground">
          {formatFileSize(file.size)}
        </div>
      </CardContent>
    </Card>
  );
};

interface FileGridProps {
  files: FileInterface[];
  folders: FolderInterface[];
  onFolderClick: (
    folderName: string,
    accessibility: FolderInterface["accessibility"]
  ) => void;
  onDownload: (
    fileId: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
  onDeleteFolder: (folderId: string) => void;
  setPopupOpen: Dispatch<
    SetStateAction<{
      fileId?: string;
      folderId?: string;
      action?: string;
    }>
  >;
  isLoading: boolean;
}

export default function FileGrid({
  files,
  folders,
  onFolderClick,
  onDownload,
  onDeleteFolder,
  setPopupOpen,
  isLoading,
}: FileGridProps) {
  // access info
  const { has } = useAccess();

  const { set_folder_dialog } = useFileManagerStore();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading ? (
        [...Array(8)].map((element) => (
          <Skeleton className="w-full h-36" key={element} />
        ))
      ) : files.length === 0 && folders.length === 0 ? (
        <div className="text-center py-8 col-span-2 sm:col-span-3 md:col-span-4">
          <div className="flex flex-col items-center justify-center ">
            <EmptyIcon />
            <p className="text-sm text-muted-foreground">
              No files or folders found
            </p>
          </div>
        </div>
      ) : (
        <>
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardContent className="p-4 flex flex-col">
                <div className="relative w-full flex justify-between py-2">
                  <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted">
                    {getFileIcon("folder")}
                    {folder.accessibility === "protected" ? (
                      <div className="absolute bottom-2 right-1">
                        <HiLockClosed className="size-4 text-primary" />
                      </div>
                    ) : null}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-8 w-8 hover:bg-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {has(["file_manager:update"]) ? (
                        <DropdownMenuItem
                          onClick={() =>
                            setPopupOpen({
                              folderId: folder.id,
                              action: "shareFolder",
                            })
                          }
                        >
                          <HiOutlineShare className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                      ) : null}
                      {has(["file_manager:update"]) ? (
                        <DropdownMenuItem
                          onClick={() =>
                            set_folder_dialog({
                              isOpen: true,
                              folder,
                              mode: "update",
                            })
                          }
                        >
                          <HiOutlinePencil className="mr-2 h-4 w-4" />
                          Update
                        </DropdownMenuItem>
                      ) : null}

                      {has(["file_manager:delete"]) ? (
                        <DropdownMenuItem
                          onClick={() => onDeleteFolder(folder.id)}
                        >
                          <HiOutlineTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h4
                  className="mb-1 truncate text-sm font-medium text-foreground hover:underline cursor-pointer"
                  onClick={() => onFolderClick(folder.id, folder.accessibility)}
                >
                  {folder.name}
                </h4>
                <ul className="flex list-inside list-disc gap-3.5">
                  <li className="list-none text-sm text-muted-foreground">
                    {formatFileSize(folder?.totalSize ?? 0)}
                  </li>
                  <li className="text-sm text-muted-foreground">
                    {folder?.filesCount ?? 0} files
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}

          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={onDownload}
              setPopupOpen={setPopupOpen}
            />
          ))}
        </>
      )}
    </div>
  );
}
