import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetFolders, useMoveToFolder } from "../api-hooks";
import useFileManagerStore from "../store";
import { useToast } from "@/hooks/use-toast";
import { FolderInterface } from "@/interfaces/file-manager";
import { Button } from "@/components/ui/button";
import { InView } from "react-intersection-observer";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { HiLockClosed } from "react-icons/hi";
import {
  getFileIcon,
  LIMIT,
} from "@/components/select-images-dialog/file-icon";

export default function MoveDialog() {
  const { toast } = useToast();
  const [targetFolder, setTargetFolder] = React.useState<string | null>(null);
  const {
    current_folder_id,
    is_move_dialog_open,
    selected_files,
    selected_folders,
    set_selected_files,
    set_selected_folders,
    set_is_move_dialog_open,
  } = useFileManagerStore();

  const moveToFolderMutation = useMoveToFolder();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetFolders(current_folder_id, LIMIT, !is_move_dialog_open);

  const folders: FolderInterface[] = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.data.filter(
          (folder: FolderInterface) => !selected_folders.includes(folder.id)
        )
      ) || [],
    [data, selected_folders]
  );
  const handleBulkMove = async (targetFolderId: string) => {
    try {
      await moveToFolderMutation.mutateAsync({
        fileIds: selected_files,
        folderIds: selected_folders,
        targetFolderId,
        currentFolderId: current_folder_id,
      });

      toast({
        title: "Success",
        description: "Selected items moved successfully",
      });
      set_selected_files([]);
      set_selected_folders([]);
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to move some items",
      });
    }
  };
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleClose = () => {
    set_is_move_dialog_open(false);
    setTargetFolder(null);
  };
  return (
    <Dialog
      open={is_move_dialog_open}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent
        className="sm:max-w-xl"
        preventOutsideClose={moveToFolderMutation.isPending}
        closeButtonDisabled={moveToFolderMutation.isPending}
      >
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a destination folder for the selected items.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {(error as any).response?.data?.message ??
                    "Failed to fetch folders. Please try again."}
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              [...Array(4)].map((element) => (
                <Skeleton key={element} className="w-full h-16" />
              ))
            ) : folders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No folders available
              </p>
            ) : (
              folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`p-2 rounded-md cursor-pointer flex items-center ${
                    targetFolder === folder.id
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setTargetFolder(folder.id)}
                >
                  <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted flex-shrink-0">
                    {getFileIcon("folder")}
                    {folder.accessibility === "protected" ? (
                      <div className="absolute bottom-2 right-1">
                        <HiLockClosed className="size-4 text-primary" />
                      </div>
                    ) : null}
                  </div>
                  <span className="ml-2">{folder.name}</span>
                </div>
              ))
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
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={moveToFolderMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => targetFolder && handleBulkMove(targetFolder)}
            disabled={!targetFolder}
            isLoading={moveToFolderMutation.isPending}
          >
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
