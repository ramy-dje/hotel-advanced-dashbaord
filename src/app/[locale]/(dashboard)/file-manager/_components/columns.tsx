import { ColumnDef, ColumnHelper } from "@tanstack/react-table";
import {
  FileInterface,
  FolderInterface,
  SharedWith,
  SharedWithRoles,
} from "@/interfaces/file-manager";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HiLockClosed,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SetStateAction, Dispatch, useState } from "react";
import { DateTime } from "luxon";
import { StackedAvatar } from "@/components/stacked-avatar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import formatFileSize from "@/utils/file-size";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import { TooltipCard } from "@/components/tooltip-card";
import { Badge } from "@/components/ui/badge";

const DownloadFile = ({
  fileId,
  handleDownload,
}: {
  fileId: string;
  handleDownload: (
    fileId: string,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TooltipCard description="Download">
      <Button
        onClick={() => handleDownload(fileId, setIsLoading)}
        variant="outline"
        size="icon"
        className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
        isLoading={isLoading}
      >
        <HiOutlineDownload className="size-4" />
      </Button>
    </TooltipCard>
  );
};

export const getFilesColumns: (
  columnHelper: ColumnHelper<FileInterface>
) => ColumnDef<FileInterface, any>[] = (columnHelper) => [
  columnHelper.accessor("id", {
    id: "select",
    header: ({ table }) => {
      const {
        has,
        displayedFiles,
        displayedFolders,
        selectedFiles,
        selectedFolders,
        handleSelectAll,
      } = (table.options.meta as any) ?? {};
      return !(
        has(["file_manager:delete"]) || has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={
            selectedFiles.length + selectedFolders.length > 0
              ? selectedFiles.length + selectedFolders.length ===
                displayedFiles.length + displayedFolders.length
                ? true
                : "indeterminate"
              : false
          }
          disabled={displayedFiles.length + displayedFolders.length === 0}
          onCheckedChange={(value) => handleSelectAll(!!value)}
          aria-label="Select all"
          className="size-5"
        />
      );
    },
    cell: ({
      getValue,
      table: {
        options: { meta },
      },
    }) =>
      !(
        (meta as any).has(["file_manager:delete"]) ||
        (meta as any).has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={(meta as any)?.selectedFiles?.includes(getValue())}
          className="size-5"
          onCheckedChange={(value) =>
            (meta as any)?.handleSelectFile(getValue(), value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor(
    (row) => ({
      name: row.originalname,
      type: row.type,
    }),
    {
      id: "name",
      cell: (info) => {
        const { name, type } = info.getValue();
        return (
          <div className="flex items-center gap-4 max-w-96">
            <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted flex-shrink-0">
              {getFileIcon(type)}
            </div>
            <span className="ml-2 truncate">{name}</span>
          </div>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="min-w-80"
        />
      ),
    }
  ),
  columnHelper.accessor("size", {
    id: "size",
    cell: (info) => formatFileSize(info.getValue()),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published At" />
    ),
    cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd MMM yyyy"),
  }),
  columnHelper.accessor("sharedWith", {
    header: "Shared with",
    cell: (info) => {
      const sharedWith: SharedWith[] = info.getValue();
      if (sharedWith.length === 0) return "-";
      return (
        <StackedAvatar
          users={sharedWith.map((user) => ({
            id: user.id,
            fullName: user.fullName,
            pic: user.pic,
          }))}
          limit={5}
        />
      );
    },
    enableSorting: false,
  }),
  columnHelper.accessor("sharedWithRoles", {
    header: "Shared with roles",
    cell: (info) => {
      const sharedWithRoles: SharedWithRoles[] | undefined = info.getValue();
      if (!sharedWithRoles || sharedWithRoles?.length === 0) return "-";
      return (
        <div className="flex flex-nowrap gap-2">
          {sharedWithRoles.slice(0, 2).map((role) => (
            <Badge
              key={role.roleId}
              variant="secondary"
              className="max-w-28 border border-border"
            >
              <p className="truncate">{role.role?.name || role.roleId}</p>
            </Badge>
          ))}
          {sharedWithRoles.length > 2 ? (
            <Badge
              title={
                sharedWithRoles
                  .slice(2)
                  .map(
                    (role, i, { length }) =>
                      (role.role?.name || role.roleId) +
                      (length - 1 == i ? "" : ", ")
                  )
                  .join("") || ""
              }
              variant="secondary"
              className="border border-border"
            >
              ...
            </Badge>
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  }),

  columnHelper.accessor("id", {
    id: "actions",
    header: "",
    cell: (c) => {
      const id = c.getValue();
      const { handleFileClick, handleDownload, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          <TooltipCard description="Preview">
            <Button
              onClick={() =>
                handleFileClick({ fileId: id, action: "viewFile" })
              }
              variant="outline"
              size="icon"
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineEye className="size-4" />
            </Button>
          </TooltipCard>

          <DownloadFile fileId={id} handleDownload={handleDownload} />
          {has(["file_manager:share"]) ? (
            <TooltipCard description="Share file">
              <Button
                onClick={() =>
                  handleFileClick({ fileId: id, action: "shareFile" })
                }
                variant="outline"
                size="icon"
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineShare className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
          {has(["file_manager:update"]) ? (
            <TooltipCard description="Edit file">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFileClick({ fileId: id, action: "editFile" })
                }
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlinePencil className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
          {has(["file_manager:delete"]) ? (
            <TooltipCard description="Delete file">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFileClick({ fileId: id, action: "deleteFile" })
                }
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineTrash className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  }),
];

export const getFoldersColumns: (
  columnHelper: ColumnHelper<FolderInterface>
) => ColumnDef<FolderInterface, any>[] = (columnHelper) => [
  columnHelper.accessor(() => "", {
    id: "select",
    header: () => {},
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      !(
        (meta as any).has(["file_manager:delete"]) ||
        (meta as any).has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={(meta as any)?.selectedFolders?.includes(row.original.id)}
          className="size-5"
          onCheckedChange={(value) =>
            (meta as any)?.handleSelectFolder(row.original.id, value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor(
    (row) => ({
      name: row.name,
      id: row.id,
      accessibility: row.accessibility,
      note: row.note,
    }),
    {
      id: "name",
      cell: (info) => {
        const { id, name, accessibility, note } = info.getValue();
        const { handleFolderClick } = info.table.options.meta as any;
        return (
          <div
            className="flex items-center gap-4 cursor-pointer "
            onClick={() => handleFolderClick(id, accessibility)}
          >
            <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted flex-shrink-0">
              {getFileIcon("folder")}
              {accessibility === "protected" ? (
                <div className="absolute bottom-2 right-1">
                  <HiLockClosed className="size-4 text-primary" />
                </div>
              ) : null}
            </div>
            <span className="ml-2">{name}</span>
            {note && (
              <HoverCard>
                <HoverCardTrigger>
                  <HiOutlineInformationCircle className="size-5" />
                </HoverCardTrigger>
                <HoverCardContent className="text-pretty w-full max-w-96">
                  {note}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
      header: "Name",
    }
  ),
  columnHelper.accessor("totalSize", {
    id: "size",
    cell: (info) => formatFileSize(info.getValue()),
    header: "Size",
  }),

  columnHelper.accessor("createdAt", {
    header: "Published At",
    cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd MMM yyyy"),
  }),

  columnHelper.accessor("sharedWith", {
    header: "",
    cell: (info) => {
      const sharedWith: SharedWith[] = info.getValue();
      if (sharedWith.length === 0) return "-";
      return (
        <StackedAvatar
          users={sharedWith.map((user) => ({
            id: user.id,
            fullName: user.fullName,
            pic: user.pic,
          }))}
          limit={5}
        />
      );
    },
  }),
  columnHelper.accessor("sharedWithRoles", {
    header: "Shared with roles",
    cell: (info) => {
      const sharedWithRoles: SharedWithRoles[] = info.getValue();
      if (!sharedWithRoles || sharedWithRoles?.length === 0) return "-";
      return (
        <div className="flex flex-nowrap gap-2">
          {sharedWithRoles.slice(0, 2).map((role) => (
            <Badge
              key={role.roleId}
              variant="secondary"
              className="max-w-28 border border-border"
            >
              <p className="truncate">{role.role?.name || role.roleId}</p>
            </Badge>
          ))}
          {sharedWithRoles.length > 2 ? (
            <Badge
              title={
                sharedWithRoles
                  .slice(2)
                  .map(
                    (role, i, { length }) =>
                      (role.role?.name || role.roleId) +
                      (length - 1 == i ? "" : ", ")
                  )
                  .join("") || ""
              }
              variant="secondary"
              className="border border-border"
            >
              ...
            </Badge>
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  }),

  columnHelper.accessor((row) => row, {
    id: "actions",
    header: "",
    cell: (c) => {
      const folder = c.getValue();
      const { handleFileClick, handleUpdateFolder, has }: any =
        c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {has(["file_manager:share"]) ? (
            <TooltipCard description="Share folder">
              <Button
                onClick={() =>
                  handleFileClick({
                    folderId: folder.id,
                    action: "shareFolder",
                  })
                }
                variant="outline"
                size="icon"
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineShare className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
          {has(["file_manager:update"]) ? (
            <TooltipCard description="Edit folder">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdateFolder(folder)}
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlinePencil className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
          {has(["file_manager:delete"]) ? (
            <TooltipCard description="Delete folder">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleFileClick({
                    folderId: folder.id,
                    action: "deleteFolder",
                  })
                }
                className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
              >
                <HiOutlineTrash className="size-4" />
              </Button>
            </TooltipCard>
          ) : null}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  }),
];
