import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import DropZone from "../upload-files/drop-zone";
import { FilePreview } from "./file-preview";
import { ScrollArea } from "../ui/scroll-area";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "../ui/form";

// Type definitions
type FileUploadProps<TFieldValues extends FieldValues> = {
  // React Hook Form controllers
  control: Control<TFieldValues>;
  filesFieldName: Path<TFieldValues>;
  filesUrlFieldName: Path<TFieldValues>;

  // Label options
  label?: string;
  showLabel?: boolean;
  labelClassName?: string;

  // File restrictions
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: Record<string, string[]>;

  // Component styling
  containerClassName?: string;
  dropzoneContainerClassName?: string;
  dropzoneClassName?: string;
  maxSizeIndicatorClassName?: string;
  previewContainerClassName?: string;

  // Custom text
  dropzonePlaceholder?: string;
  maxSizeText?: string;

  // Additional props
  disabled?: boolean;
  [x: string]: any;
};

// Main component
const FileUpload = <TFieldValues extends FieldValues>({
  // React Hook Form controllers
  control,
  filesFieldName,
  filesUrlFieldName,

  // Label options
  label = "Upload Files",
  showLabel = true,
  labelClassName = "block mb-2",

  // File restrictions
  maxFiles = 10,
  maxFileSize = 2 * 1024 * 1024, // 2MB default
  acceptedFileTypes = {},

  // Component styling
  containerClassName = "flex flex-col gap-2",
  dropzoneContainerClassName = "relative flex items-center justify-center w-full border-border border rounded-md",
  dropzoneClassName = "border-0 w-full z-10",
  maxSizeIndicatorClassName = "absolute z-[9] select-none bottom-1 right-2 text-xs text-accent-foreground",
  previewContainerClassName = "w-full mb-2 overflow-hidden flex flex-col gap-2",

  // Custom text
  dropzonePlaceholder = "Drop or select file",
  maxSizeText = `Max file Size ${Math.floor(maxFileSize / (1024 * 1024))}MB`,

  // Additional props
  disabled = false,
  ...restProps
}: FileUploadProps<TFieldValues>): JSX.Element => {
  // Use controllers for both fields
  const filesController = useController({
    name: filesFieldName,
    control,
  });

  const filesUrlController = useController({
    name: filesUrlFieldName,
    control,
  });

  // Handler for when files are selected or dropped
  const handleFilesChange = (files: File[]): void => {
    // Clear the old object URLs if they exist
    const oldFilesUrl = filesUrlController.field.value;
    const oldFiles = filesController.field.value;

    // Create new object URLs
    const filesUrl: string[] = [];
    files.forEach((file: File) => {
      filesUrl.push(URL.createObjectURL(file));
    });

    // Update both controllers
    filesUrlController.field.onChange([...oldFilesUrl, ...filesUrl]);
    filesController.field.onChange([...oldFiles, ...files]);
  };

  // Handler for removing a file
  const handleFileRemove = (index: number): void => {
    // Get the file URL to revoke
    const fileUrl = filesUrlController.field.value?.[index];

    // Clear the object URL if it exists
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    // Get current values
    const oldFilesUrl = [...(filesUrlController.field.value || [])];
    const oldFiles = [...(filesController.field.value || [])];

    // Remove the file from both arrays
    oldFilesUrl.splice(index, 1);
    oldFiles.splice(index, 1);

    // Update both controllers
    filesUrlController.field.onChange(oldFilesUrl);
    filesController.field.onChange(oldFiles);
  };

  return (
    <FormField
      control={control}
      name={filesFieldName}
      render={({ field }) => (
        <FormItem className={containerClassName} {...restProps}>
          {showLabel && (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <FormControl>
            <div className={dropzoneContainerClassName}>
              <DropZone
                disabled={disabled}
                placeholder={dropzonePlaceholder}
                setFiles={handleFilesChange}
                className={dropzoneClassName}
                maxSize={maxFileSize}
                maxFiles={maxFiles}
                accept={acceptedFileTypes}
              />
              <span className={maxSizeIndicatorClassName}>{maxSizeText}</span>
            </div>
          </FormControl>
          <ScrollArea className="max-h-72">
            <div className={previewContainerClassName}>
              {field.value?.map((file: File, index: number) => (
                <FilePreview
                  key={`preview-${index}`}
                  file={file}
                  url={filesUrlController.field.value?.[index] || ""}
                  onRemove={() => handleFileRemove(index)}
                />
              ))}
            </div>
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUpload;
