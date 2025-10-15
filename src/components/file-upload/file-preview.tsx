import React from "react";
import UploadedImageItem from "@/components/uploaded-image";
import { HiOutlineTrash } from "react-icons/hi";
import { getFileIcon } from "../select-images-dialog/file-icon";
import formatFileSize from "@/utils/file-size";
import { FileInterface } from "@/interfaces/file-manager";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export type FileType =
  | "image"
  | "video"
  | "audio"
  | "text"
  | "pdf"
  | "spreadsheet"
  | "document"
  | "presentation"
  | "archive"
  | "other";

interface FilePreviewProps {
  file: File | FileInterface;
  url: string;
  onRemove: () => void;
  onlyImagePreview?: boolean;
  onClick?: () => void;
  tag?: string | null;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  url,
  tag,
  onlyImagePreview = false,
  className,
  onClick,
  onRemove,
}) => {
  // Function to determine file type
  const getFileType = (file: File): FileType => {
    const type = file.type;
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    if (type.startsWith("text/")) return "text";
    if (type.startsWith("application/pdf")) return "pdf";
    if (type.includes("spreadsheet") || type.includes("excel"))
      return "spreadsheet";
    if (type.includes("wordprocessing") || type.includes("document"))
      return "document";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "presentation";
    if (
      type.includes("zip") ||
      type.includes("archive") ||
      type.includes("compressed")
    )
      return "archive";
    return "other";
  };

  const fileType = file instanceof File ? getFileType(file) : file.type;
  const fileName = file instanceof File ? file.name : file.originalname;
  const fileSize = file.size ?? 0;

  return (
    <div className="mt-3 border border-border rounded-md p-3 relative">
      {fileType === "image" ? (
        <UploadedImageItem
          alt="user picture"
          url={url}
          onRemove={onRemove}
          meta={{
            name: fileName,
            size: fileSize,
          }}
          onClick={onClick}
          tag={tag}
          className={className}
        />
      ) : onlyImagePreview ? (
        <>
          <figure
            onClick={onClick}
            className={cn(
              "relative h-40 rounded-md bg-muted flex items-center justify-center",
              className
            )}
          >
            {getFileIcon(fileType, "size-10")}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove();
              }}
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full absolute top-1 right-1 size-7"
            >
              <HiOutlineTrash className="size-4" />
            </Button>
            {tag ? (
              <div className="absolute bottom-1 right-1">
                <Badge className="text-xs rounded-full px-2 py-0.5">
                  {tag}
                </Badge>
              </div>
            ) : null}
          </figure>
          <div className="flex items-center w-full mt-1">
            <div className="flex-shrink-0 mr-3">{getFileIcon(fileType)}</div>
            <div className="text-xs overflow-hidden flex-1 mr-2 font-medium">
              <p className="text-accent-foreground truncate" title={fileName}>
                {fileName}
              </p>
              <p className="text-accent-foreground/80 text-nowrap">
                {formatFileSize(fileSize)}
              </p>
            </div>
          </div>
        </>
      ) : fileType === "video" ? (
        <div className="flex flex-col gap-2">
          <video controls className="max-h-48 rounded-md" src={url} />
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">{getFileIcon(fileType)}</div>
              <div className="text-sm overflow-hidden flex-1 mr-2">
                <p className="font-medium truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-accent-foreground">
                  {formatFileSize(fileSize)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-accent rounded-full flex-shrink-0"
              aria-label="Remove file"
              type="button"
            >
              <HiOutlineTrash className="size-4" />
            </button>
          </div>
        </div>
      ) : fileType === "audio" ? (
        <div className="flex flex-col gap-2">
          <audio controls className="w-full" src={url} />
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">{getFileIcon(fileType)}</div>
              <div className="text-sm overflow-hidden flex-1 mr-2">
                <p className="font-medium truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-accent-foreground">
                  {formatFileSize(fileSize)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-accent rounded-full flex-shrink-0"
              aria-label="Remove file"
              type="button"
            >
              <HiOutlineTrash className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex-shrink-0 mr-3">{getFileIcon(fileType)}</div>
          <div className="text-sm overflow-hidden flex-1 mr-2">
            <p className="font-medium truncate" title={fileName}>
              {fileName}
            </p>
            <p className="text-accent-foreground">{formatFileSize(fileSize)}</p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-accent rounded-full flex-shrink-0"
            aria-label="Remove file"
            type="button"
          >
            <HiOutlineTrash className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};
