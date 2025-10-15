"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileIcon, Calendar, HardDrive, Tag } from "lucide-react";
import { FileInterface } from "@/interfaces/file-manager";
import { DateTime } from "luxon";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import formatFileSize from "@/utils/file-size";
import Link from "next/link";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileInterface | null;
}

export default function FilePreviewDialog({
  isOpen,
  onClose,
  file,
}: FilePreviewDialogProps) {
  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Preview Area */}
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-6 col-span-1 gap-2">
            {getFileIcon(file.type, "size-10")}
            <p className="text-sm text-muted-foreground text-center">
              {formatFileSize(file.size)}
            </p>
          </div>

          {/* File Details */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold ">File Information</h4>
                <div>
                  {file.presignedUrl && (
                    <Link
                      href={file.presignedUrl}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm py-2 px-4 flex items-center justify-center"
                      target="_blank"
                    >
                      Open
                    </Link>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Tag className="size-4 flex-shrink-0 mr-2 mt-0.5 text-muted-foreground" />

                  <p className="text-sm font-medium truncate">
                    Name:{" "}
                    <span className="text-muted-foreground">
                      {file.originalname}
                    </span>
                  </p>
                </div>

                <div className="flex items-start">
                  <FileIcon className="size-4 flex-shrink-0 mr-2 mt-0.5 text-muted-foreground" />

                  <p className="text-sm font-medium truncate">
                    Type:{" "}
                    <span className="text-muted-foreground capitalize truncate">
                      {file.type}
                    </span>
                  </p>
                </div>

                <div className="flex items-start">
                  <HardDrive className="size-4 flex-shrink-0 mr-2 mt-0.5 text-muted-foreground" />

                  <p className="text-sm font-medium truncate">
                    Size:{" "}
                    <span className="text-muted-foreground truncate">
                      {formatFileSize(file.size)}
                    </span>
                  </p>
                </div>

                <div className="flex items-start">
                  <Calendar className="size-4 flex-shrink-0 mr-2 mt-0.5 text-muted-foreground" />

                  <p className="text-sm font-medium truncate">
                    Created at:{" "}
                    <span className="text-muted-foreground">
                      {DateTime.fromISO(file.createdAt).toFormat("dd MMM yyyy")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
