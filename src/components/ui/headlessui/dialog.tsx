"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogBackdrop>,
  React.ComponentPropsWithoutRef<typeof DialogBackdrop>
>(({ className, ...props }, ref) => (
  <DialogBackdrop
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogBackdrop.displayName;
export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Deactivate account
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

import { FileIcon, Calendar, HardDrive, Tag, FolderIcon } from "lucide-react";

import { FileInterface } from "@/interfaces/file-manager";
import { DateTime } from "luxon";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import formatFileSize from "@/utils/file-size";

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
    <Dialog open={isOpen} onClose={onClose} className="relative z-[999]">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-2xl space-y-4 bg-background p-4 rounded-lg">
          <DialogTitle>File Preview</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Preview Area */}
            <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-6 col-span-1 gap-2">
              {getFileIcon(file.type)}
              <p className="text-sm text-muted-foreground text-center">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* File Details */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">File Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Tag className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {file.originalname}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FileIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {file.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <HardDrive className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created at</p>
                      <p className="text-sm text-muted-foreground">
                        {DateTime.fromISO(file.createdAt).toFormat(
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FolderIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{"Root"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
