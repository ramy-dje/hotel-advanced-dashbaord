"use client";

import {
  Dispatch,
  SetStateAction,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PageLayoutFilteringHeader,
  PageLayoutTable,
} from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { PiTextColumnsLight } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FileInterface, FolderInterface } from "@/interfaces/file-manager";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Grid, List, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFilesColumns, getFoldersColumns } from "./columns";
import useAccess from "@/hooks/use-access";
import {
  useBulkDelete,
  useDeleteFile,
  useDeleteFolder,
  useFolderBrowse,
  useGetCurrentLocation,
} from "../api-hooks";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/default-tabs";
import FileGrid from "./grid";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import UpdateFileDialog from "./update-file-dialog";
import { cn } from "@/lib/utils";
import FilePreviewDialog from "./file-preview-dialog";
import ShareFileDialog from "./share-file-dialog";
import { useRouter, usePathname } from "next/navigation";
import useFileManagerStore from "../store";
import { InView } from "react-intersection-observer";
import { FileManagerFilters } from "../page";
import axiosAPI from "@/lib/axios";
import { PasswordDialog } from "./password-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ShareFolderDialog from "./share-folder-dialog";
import { DataTableToolbar } from "./table-toolbar";
import { useFolderAccess } from "../hooks/useFolderAccess";
import MoveDialog from "./move-dialog";
import { LIMIT } from "@/components/select-images-dialog/file-icon";
import FoldersBrowseBreadcrumb from "@/components/select-images-dialog/foldes-browse-breadcrumb";
import EmptyIcon from "@/components/basic-table/empty-icon";

// The file manager table and filters section

interface FileManagerTableProps {
  filters?: FileManagerFilters;
}

export default function FileManagerTable({ filters }: FileManagerTableProps) {
  const folderId = filters?.folderId || "";
  const pathname = usePathname();
  const router = useRouter();

  // File manager store
  const {
    selected_files,
    selected_folders,
    set_current_folder_id,
    set_selected_files,
    set_selected_folders,
    handle_select_file,
    handle_select_folder,
    handle_select_all,
    set_folder_dialog,
    set_is_move_dialog_open,
  } = useFileManagerStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  // access info
  const { has } = useAccess();

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isPopupOpen, setPopupOpen] = useState<{
    action?: string;
    folderId?: string;
    fileId?: string;
  }>({});
  const { toast } = useToast();

  // Use hook for folder access
  const {
    folderPasswords,
    passwordDialog,
    closePasswordDialog,
    checkFolderAccess,
    handlePasswordSubmit,
    handleWrongPassword,
  } = useFolderAccess();

  // Use React Query's useInfiniteQuery to fetch files and folders
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFolderBrowse(
    LIMIT,
    {
      ...filters,
      ...(sorting.length > 0
        ? { sortBy: sorting[0].id, sortOrder: sorting[0].desc ? "desc" : "asc" }
        : {}),
    },
    folderPasswords,
    passwordDialog.isOpen
  );

  const {
    data: breadcrumbsPath,
    isLoading: isBreadcrumbsLoading,
    isError: isBreadcrumbsError,
    error: breadcrumbsError,
  } = useGetCurrentLocation(filters?.folderId);

  // Use React Query mutations
  const deleteFileMutation = useDeleteFile();
  const deleteFolderMutation = useDeleteFolder();
  const bulkDeleteMutation = useBulkDelete();

  // Extract files and folders from query data
  const displayedFiles: FileInterface[] = useMemo(
    () => data?.pages.flatMap((page) => page.files) || [],
    [data]
  );
  const displayedFolders: FolderInterface[] = useMemo(
    () => data?.pages.flatMap((page) => page.folders) || [],
    [data]
  );

  const handleDownload = async (
    fileId: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      setIsLoading(true);

      // Call the download endpoint to get the URL
      const response = await axiosAPI.get(`v1/files/${fileId}/download`);

      if (response.status !== 200 || !response.data) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      const data = response.data;

      // Extract filename from the URL if present
      const contentDisposition = decodeURIComponent(data.downloadUrl);
      let filename = "download.pdf"; // Default filename

      const filenameMatch = contentDisposition.match(
        /filename\*=UTF-8''([^&]+)/i
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      }

      // Approach 1: Using fetch to handle cross-origin issues
      const fileResponse = await fetch(data.downloadUrl);
      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description:
          "There was a problem downloading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFileMutation.mutateAsync({
        fileId: isPopupOpen.folderId!,
        currentFolderId: folderId,
      });
      setPopupOpen({});

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete file",
      });
    }
  };

  const handleDeleteFolder = async () => {
    console.log("folderId", folderId);
    try {
      await deleteFolderMutation.mutateAsync({
        folderId: isPopupOpen.folderId!,
        currentFolderId: folderId,
      });
      setPopupOpen({});
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete folder",
      });
    }
  };

  const handleFileClick = ({
    fileId,
    folderId,
    action,
  }: {
    folderId?: string;
    fileId?: string;
    action: string;
  }) => {
    setPopupOpen({
      action,
      fileId,
      folderId,
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    handle_select_all(displayedFolders, displayedFiles, isSelected);
  };

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

  const navigateToFolder = (folderId?: string) => {
    const params = new URLSearchParams();

    if (folderId) {
      params.set("folderId", folderId);
    } else {
      params.delete("folderId");
    }

    const newPathname = `${pathname}?${params.toString()}`;
    router.push(newPathname);
  };

  const handleUpdateFolder = (folder: FolderInterface) => {
    set_folder_dialog({ isOpen: true, folder, mode: "update" });
  };

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<FileInterface>();

  const columns = useMemo(() => getFilesColumns(columnHelper), [columnHelper]);

  const table = useReactTable({
    data: displayedFiles,
    columns,
    state: {
      columnVisibility: {
        type: false, // Hide this column initially
      },
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      has,
      selectedFiles: selected_files,
      selectedFolders: selected_folders,
      displayedFiles,
      displayedFolders,
      handleFileClick,
      handleDownload,
      handleSelectFile: handle_select_file,
      handleSelectAll,
    },
  });
  const folderColumnHelper = createColumnHelper<FolderInterface>();

  const folderColumns = useMemo(
    () => getFoldersColumns(folderColumnHelper),
    [folderColumnHelper]
  );

  const folderTable = useReactTable({
    data: displayedFolders,
    columns: folderColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      has,
      selectedFolders: selected_folders,
      handleFileClick,
      handleUpdateFolder,
      handleSelectFolder: handle_select_folder,
      handleFolderClick,
    },
  });

  const clearSelection = () => {
    // Clear selection
    set_selected_files([]);
    set_selected_folders([]);
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync({
        fileIds: selected_files,
        folderIds: selected_folders,
        currentFolderId: folderId,
      });
      setPopupOpen({});
      toast({
        title: "Success",
        description: "Selected items deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ??
          "Failed to delete some items",
      });
    }

    clearSelection();
  };
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Handle errors from the API
  useEffect(() => {
    if (isError) {
      const errorMessage = (error as any)?.response?.data?.message;

      if (
        errorMessage ===
        "Permission denied by file service: Password required to access this folder."
      ) {
        checkFolderAccess(folderId, "protected", navigateToFolder);
        return;
      }

      if (
        errorMessage ===
        "Permission denied by file service: Invalid password for folder access."
      ) {
        handleWrongPassword(folderId);
        return;
      }

      // Handle other errors...
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || "An error occurred fetching data",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error, folderId]);

  useEffect(() => {
    set_current_folder_id(folderId);
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, set_current_folder_id]);

  return (
    <>
      {/* Filtering place */}
      <PageLayoutFilteringHeader className="lg:items-start">
        {useMemo(
          () => (
            <DataTableToolbar filters={filters} />
          ),
          [filters]
        )}

        <div className="flex items-center max-sm:flex-row gap-2 justify-end">
          {/* filtering */}
          {/* <FilesManagerPageFiltering filters={filters} /> */}
          {/* The visibalt */}
          {viewMode === "list" && (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    title="Toggle columns"
                    size="icon"
                    variant="filter"
                    className="size-9"
                  >
                    <PiTextColumnsLight className="size-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="left-0"
                >
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "grid" | "list")}
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </PageLayoutFilteringHeader>
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as any).response?.data?.message ??
              "Failed to fetch files and folders. Please try again."}
          </AlertDescription>
        </Alert>
      )}
      <div>
        <FoldersBrowseBreadcrumb
          currentPath={breadcrumbsPath}
          handleNavigate={navigateToFolder}
          isLoading={isBreadcrumbsLoading}
          isError={isBreadcrumbsError}
          error={breadcrumbsError}
        />
        {viewMode === "grid" ? (
          <>
            <FileGrid
              files={displayedFiles}
              folders={displayedFolders}
              onFolderClick={handleFolderClick}
              onDownload={handleDownload}
              onDeleteFolder={handleDeleteFolder}
              setPopupOpen={setPopupOpen}
              isLoading={isLoading}
            />

            {/* Load More Button for Grid View */}
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
        ) : (
          <>
            <PageLayoutTable className="text-nowrap">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className={cn(
                            "text-left text-nowrap min-w-max",
                            header.column.columnDef.header === "" && "w-56",
                            typeof header.column.columnDef.header ===
                              "function" && "w-9"
                          )}
                          key={header.id}
                          onClick={() =>
                            header.column.getCanSort() &&
                            header.column.toggleSorting()
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(6)].map((element) => (
                      <TableRow key={element}>
                        {[...Array(columns.length)].map((_, index) => (
                          <TableCell
                            className="text-center"
                            key={`cell-${index}`}
                          >
                            <Skeleton className="w-full min-w-5 h-5" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : displayedFiles.length === 0 &&
                    displayedFolders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-6"
                      >
                        <div className="flex flex-col items-center justify-center py-6">
                          <EmptyIcon />
                          No files or folders found
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {folderTable.getRowModel().rows.map((row) => (
                        <Fragment key={row.id}>
                          <TableRow
                            key={row.id}
                            data-state={
                              selected_folders.includes(row.id) && "selected"
                            }
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </Fragment>
                      ))}
                      {table.getRowModel().rows.map((row) => (
                        <Fragment key={row.id}>
                          <TableRow
                            key={row.id}
                            data-state={
                              selected_files.includes(row.id) && "selected"
                            }
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </Fragment>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </PageLayoutTable>
            {(selected_files.length > 0 || selected_folders.length > 0) && (
              <div className="sticky bottom-0 inset-x-0 z-10 mt-2.5 flex flex-col sm:flex-row w-full sm:items-center sm:justify-between rounded-md border border-muted px-5 py-3.5 text-primary-dark shadow-sm bg-background gap-2">
                <div>
                  <strong className="font-bold">
                    {selected_files.length + selected_folders.length}
                  </strong>{" "}
                  item(s) selected
                  <Button
                    variant="link"
                    size="xs"
                    onClick={clearSelection}
                    className="inline-flex"
                  >
                    Clear selection
                  </Button>
                </div>
                <div className="flex gap-4">
                  {has(["file_manager:update"]) ? (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        set_is_move_dialog_open(true);
                      }}
                      className="flex-1 w-full"
                    >
                      Move them
                    </Button>
                  ) : null}
                  {has(["file_manager:delete"]) ? (
                    <Button
                      size="xs"
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setPopupOpen({ action: "deleteFiles&Folders" })
                      }
                      className="flex-1 w-full"
                    >
                      Delete them
                    </Button>
                  ) : null}
                </div>
              </div>
            )}
            {/* Load More Button for List View */}
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
      {/* Dialogs */}
      {/* Move dialog */}
      <MoveDialog />
      {/* Password dialog */}
      <PasswordDialog
        isOpen={passwordDialog.isOpen}
        folderId={passwordDialog.folderId}
        type={passwordDialog.isRetry ? "wrongPassword" : "requiredPassword"}
        onSuccess={passwordDialog.onSuccess}
        onClose={closePasswordDialog}
        handleSavePassword={handlePasswordSubmit}
      />

      {/* delete selection confirm dialog */}
      <DeleteConfirmPopup
        title="Delete items"
        description="Please be shure before you delete this files and folders because this action
              can not be undone."
        open={isPopupOpen?.action === "deleteFiles&Folders"}
        setOpen={(open) => {
          if (!open) setPopupOpen({});
        }}
        handleDelete={handleBulkDelete}
        isLoading={bulkDeleteMutation.isPending}
      />

      {/* delete file confirm dialog */}
      <DeleteConfirmPopup
        title="Delete file"
        description="Please be shure before you delete this file because this action
              can not be undone."
        open={isPopupOpen?.action === "deleteFile"}
        setOpen={(open) => {
          if (!open) setPopupOpen({});
        }}
        handleDelete={handleDelete}
        isLoading={deleteFileMutation.isPending}
      />

      {/* delete folder confirm dialog */}
      <DeleteConfirmPopup
        title="Delete Folder"
        description="Please be shure before you delete this folder because this action
              can not be undone."
        open={isPopupOpen?.action === "deleteFolder"}
        setOpen={(open) => {
          if (!open) setPopupOpen({});
        }}
        handleDelete={handleDeleteFolder}
        isLoading={deleteFolderMutation.isPending}
      />
      {/* file preview dialog */}
      <FilePreviewDialog
        isOpen={isPopupOpen?.action === "viewFile"}
        onClose={() => {
          setPopupOpen({});
        }}
        file={
          isPopupOpen?.fileId
            ? displayedFiles.find((file) => file.id === isPopupOpen.fileId)!
            : null
        }
      />

      {/* share file dialog */}
      <ShareFileDialog
        isOpen={isPopupOpen?.action === "shareFile"}
        onClose={() => {
          setPopupOpen({});
        }}
        file={
          isPopupOpen?.fileId
            ? displayedFiles.find((file) => file.id === isPopupOpen.fileId)!
            : null
        }
      />

      {/* share folder dialog */}
      <ShareFolderDialog
        isOpen={isPopupOpen?.action === "shareFolder"}
        onClose={() => {
          setPopupOpen({});
        }}
        folder={
          isPopupOpen?.folderId
            ? displayedFolders.find(
                (folder) => folder.id === isPopupOpen.folderId
              )!
            : null
        }
      />

      {/* Update file dialog */}
      <UpdateFileDialog
        isOpen={isPopupOpen?.action === "editFile"}
        onClose={() => {
          setPopupOpen({});
        }}
        file={
          isPopupOpen?.fileId
            ? displayedFiles.find((file) => file.id === isPopupOpen.fileId)!
            : null
        }
      />
    </>
  );
}
