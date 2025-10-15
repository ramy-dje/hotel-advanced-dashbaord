"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFolderBrowse } from "@/app/[locale]/(dashboard)/file-manager/api-hooks";

import { FileInterface } from "@/interfaces/file-manager";
import { InView } from "react-intersection-observer";
import { Label } from "../ui/label";
import Image from "next/image";
import { HiLockClosed } from "react-icons/hi";

import { useFolderAccess } from "@/app/[locale]/(dashboard)/file-manager/hooks/useFolderAccess";
import { PasswordDialog } from "@/app/[locale]/(dashboard)/file-manager/_components/password-dialog";
import { getFileIcon, LIMIT } from "./file-icon";
import FoldersBrowseBreadcrumb from "./foldes-browse-breadcrumb";
import { FileTypeCategory } from "./helper";
import ImagePreview from "./image-preview";

interface FilesSelectorProps {
  onSelectFiles: Dispatch<SetStateAction<FileInterface[]>>;
  selectedFiles: FileInterface[];
  filters: {
    search?: string;
    itemType?: string;
    fileType?: string;
    startDate?: string;
    endDate?: string;
    sharedWithMe?: boolean;
  };
  allowedFileTypes: FileTypeCategory[];
}

export default function FilesSelector({
  onSelectFiles,
  selectedFiles,
  filters,
  allowedFileTypes,
}: FilesSelectorProps) {
  const [currentPath, setCurrentPath] = useState<
    { id: string; name: string }[]
  >([]);

  // Use hook for folder access
  const {
    folderPasswords,
    passwordDialog,
    closePasswordDialog,
    checkFolderAccess,
    handlePasswordSubmit,
  } = useFolderAccess();

  // Use React Query to fetch files and folders
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFolderBrowse(
    LIMIT,
    {
      sortBy: "updatedAt",
      sortOrder: "desc",
      folderId:
        currentPath?.length > 0
          ? currentPath[currentPath.length - 1].id
          : undefined,
      ...filters,
    },
    folderPasswords
  );

  // Extract files and folders from query data
  const allFiles = data?.pages.flatMap((page) => page.files) || [];
  const filteredFiles = allFiles.filter((file) =>
    allowedFileTypes.includes(file.type as FileTypeCategory)
  );
  console.log({ allFiles, filteredFiles, allowedFileTypes });
  const folders = data?.pages.flatMap((page) => page.folders) || [];

  const handleFolderClick = (folderId: string, accessibility: string) => {
    const hasAccess = checkFolderAccess(
      folderId,
      accessibility,
      navigateToFolder
    );
    if (hasAccess) {
      navigateToFolder(folderId);
    }
  };

  const navigateToFolder = (folderId: string) => {
    const folder = folders.find((item) => item.id === folderId);
    if (folder)
      setCurrentPath((prev) => [...prev, { name: folder.name, id: folderId }]);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSelectFile = (file: FileInterface) => {
    // If the file is already selected, deselect it
    if (selectedFiles?.some((selectedFile) => file.id === selectedFile.id)) {
      onSelectFiles((prev) =>
        prev.filter((selectedFile) => file.id !== selectedFile.id)
      );
      return;
    }
    onSelectFiles((prev) => [...prev, file]);
  };

  return (
    <>
      <FoldersBrowseBreadcrumb
        currentPath={currentPath}
        handleNavigate={(folderId) => {
          // go home
          if (!folderId) {
            setCurrentPath([]);
            return;
          }
          // Navigate to this item (keeping all items up to and including this one)
          const index = currentPath.findIndex((p) => p.id === folderId);
          if (index >= 0) {
            setCurrentPath(currentPath.slice(0, index + 1));
          }
        }}
      />
      <div className="flex px-4 min-h-[400px] flex-col overflow-y-auto space-y-4 max-h-[450px]">
        {/* Error State */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(error as any).response?.data?.message ??
                "Failed to load files and folders"}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !isError &&
          folders.length === 0 &&
          filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center p-6 flex-1">
              <Image
                src="/file-manager-icons/no_data.png"
                alt="no-data"
                width={277}
                height={153}
                className="h-32 w-auto"
              />
              <p className="font-medium pt-8">This folder is empty</p>
            </div>
          )}

        {/* Content - Folders and Files */}
        {!isLoading &&
          !isError &&
          (folders.length > 0 || filteredFiles.length > 0) && (
            <>
              {folders.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2">Folders</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                    {/* Display folders first for navigation */}
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="cursor-pointer rounded-md overflow-hidden border-2 border-border hover:border-primary/50 transition-colors p-4"
                        onClick={() =>
                          handleFolderClick(folder.id, folder.accessibility)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-shrink-0">
                            {getFileIcon("folder")}
                            {folder.accessibility === "protected" ? (
                              <div className="absolute -bottom-1 -right-1">
                                <HiLockClosed className="size-4 text-primary" />
                              </div>
                            ) : null}
                          </div>
                          <div className="truncate">{folder.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filteredFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2">Files</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                    {/* Display File files */}
                    {filteredFiles.map((file) => {
                      const isFileSelected = selectedFiles?.some(
                        (selectedFile) => file.id === selectedFile.id
                      );
                      return (
                        <div
                          key={file.id}
                          className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                            isFileSelected
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleSelectFile(file)}
                        >
                          <div className="bg-muted flex flex-col">
                            <div className="relative flex flex-1 items-center justify-center bg-muted/30">
                              {file.type === "image" ? (
                                <ImagePreview
                                  name={file.originalname}
                                  url={file.presignedUrl}
                                  className="aspect-video"
                                />
                              ) : (
                                <div className="flex items-center justify-center aspect-video w-full">
                                  {getFileIcon(file.type, "size-12")}
                                </div>
                              )}
                            </div>
                            <div className="bg-background px-2 py-4 overflow-hidden">
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file.type, "size-5")}
                                <p className="text-sm truncate">
                                  {file.originalname}
                                </p>
                              </div>
                            </div>
                            {isFileSelected && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {hasNextPage && (
                <InView
                  as="div"
                  onChange={(inView) => {
                    if (inView) handleLoadMore();
                  }}
                  className="flex justify-center items-center py-4"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin text-primary" />
                      Loading...
                    </>
                  ) : (
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="w-full"
                    >
                      Load More
                    </Button>
                  )}
                </InView>
              )}
            </>
          )}
      </div>
      <PasswordDialog
        isOpen={passwordDialog.isOpen}
        folderId={passwordDialog.folderId}
        type={passwordDialog.isRetry ? "wrongPassword" : "requiredPassword"}
        onSuccess={passwordDialog.onSuccess}
        onClose={closePasswordDialog}
        handleSavePassword={handlePasswordSubmit}
      />
    </>
  );
}
