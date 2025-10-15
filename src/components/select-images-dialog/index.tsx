"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FileUpload from "../file-upload";
import { useForm, useWatch } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { SearchInput } from "./SearchInput";
import { DEFAULT_FILE_TYPES, FileTypeCategory, getAcceptProps } from "./helper";
import { DialogFooter } from "../ui/dialog";
import { X } from "lucide-react";
import { FileInterface } from "@/interfaces/file-manager";
import FilesSelector from "./file-selector";
import { useCreateFile } from "@/app/[locale]/(dashboard)/file-manager/api-hooks";
import {
  CreateFileValidationSchema,
  CreateFileValidationSchemaType,
} from "@/app/[locale]/(dashboard)/file-manager/validation/create-file-validation.schema";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";

const defaultValues: CreateFileValidationSchemaType = {
  files: [],
  files_url: [],
};

interface FileSelectorModalProps {
  parentName: string;
  isOpen: boolean;
  onClose: () => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: FileTypeCategory[];
  formSelectedFiles?: any[];
  setFormSelectedFiles: (files: FileInterface[]) => void;
  setFormPrimaryImage?: (fileId: string) => void;
}

export default function FileSelectorModal({
  parentName,
  isOpen,
  onClose,
  maxFiles,
  maxFileSize,
  allowedFileTypes = DEFAULT_FILE_TYPES,
  formSelectedFiles,
  setFormSelectedFiles,
  setFormPrimaryImage,
}: FileSelectorModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("select");
  const [filters, setFilters] = useState<{
    search?: string;
    itemType?: string;
    fileTypes?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedFiles, setSelectedFiles] = useState<FileInterface[]>(
    formSelectedFiles ?? []
  );

  const form = useForm<CreateFileValidationSchemaType>({
    resolver: zodResolver(CreateFileValidationSchema),
    defaultValues,
  });
  const createFileMutation = useCreateFile();

  const handleFileUpload = async (values: CreateFileValidationSchemaType) => {
    try {
      const uploadedFiles = await createFileMutation.mutateAsync({
        files: values.files,
        parentName,
      });
      setFormSelectedFiles([...selectedFiles, ...uploadedFiles]);
      if (setFormPrimaryImage) setFormPrimaryImage(uploadedFiles[0]?.id);
      form.reset(defaultValues);
      onClose();
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to upload file",
      });
    }
  };

  const filesUploaded = useWatch({ control: form.control, name: "files" });

  const accept = useMemo(
    () => getAcceptProps(allowedFileTypes),
    [allowedFileTypes]
  );

  const searchInput = useMemo(() => {
    if (activeTab !== "upload") {
      return (
        <SearchInput
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters({})}
          allowedFileTypes={allowedFileTypes}
        />
      );
    }
    return null;
  }, [filters, activeTab, allowedFileTypes]);
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("select");
      if (formSelectedFiles) {
        setSelectedFiles(formSelectedFiles);
      }
      form.reset(defaultValues);
    }
  }, [isOpen, formSelectedFiles, form]);

  return (
    <Dialog
      open={isOpen}
      onClose={createFileMutation.isPending ? () => {} : onClose}
      className="relative z-[999]"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm ease-out data-closed:opacity-0" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform space-y-4 rounded-lg py-4 bg-background text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-4xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle className="flex items-center justify-between gap-4 px-4">
              <h3 className="flex-1 text-nowrap">Open File</h3>
              <div className="relative hidden md:block">{searchInput}</div>
              <div className="flex flex-1 justify-end">
                <CloseButton
                  as={Button}
                  variant="link"
                  className={
                    "p-1 flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-muted-foreground"
                  }
                  disabled={createFileMutation.isPending}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </CloseButton>
              </div>
            </DialogTitle>
            <div className="relative md:hidden mx-4">{searchInput}</div>
            <Tabs
              value={activeTab}
              onValueChange={(tab) => {
                setActiveTab(tab);
                if (tab === "upload") {
                  setSelectedFiles([]);
                  return;
                }
                form.reset(defaultValues);
              }}
              className="w-full"
            >
              <TabsList className="w-full px-4" defaultValue="select">
                <TabsTrigger value="select" className="flex items-center gap-2">
                  File manager
                </TabsTrigger>
                <TabsTrigger
                  value="sharedWithMe"
                  className="flex items-center gap-2"
                >
                  Shared with me
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="select" className="mt-4">
                <FilesSelector
                  onSelectFiles={setSelectedFiles}
                  selectedFiles={selectedFiles}
                  filters={filters}
                  allowedFileTypes={allowedFileTypes}
                />
              </TabsContent>
              <TabsContent value="sharedWithMe" className="mt-4">
                <FilesSelector
                  onSelectFiles={setSelectedFiles}
                  selectedFiles={selectedFiles}
                  filters={{ ...filters, sharedWithMe: true }}
                  allowedFileTypes={allowedFileTypes}
                />
              </TabsContent>
              <TabsContent value="upload" className="mt-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleFileUpload)}
                    className="grid gap-4 p-4 min-h-[400px] "
                  >
                    <FileUpload
                      control={form.control}
                      filesFieldName="files"
                      filesUrlFieldName="files_url"
                      maxFiles={maxFiles}
                      showLabel={false}
                      maxFileSize={maxFileSize}
                      containerClassName="flex flex-col gap-2 overflow-hidden"
                      dropzoneClassName="border-0 w-full min-h-[200px]"
                      acceptedFileTypes={accept}
                    />
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            {selectedFiles.length > 0 && (
              <DialogFooter className="px-4 pt-4 border-t justify-between sm:justify-between flex-row">
                <div className="flex items-center space-x-2">
                  <HiX
                    className="size-5 cursor-pointer text-primary"
                    onClick={() => setSelectedFiles([])}
                  />
                  <p className="text-sm">{selectedFiles.length} selected</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setFormSelectedFiles(selectedFiles);
                      if (setFormPrimaryImage)
                        setFormPrimaryImage(selectedFiles[0]?.id);
                      onClose();
                    }}
                  >
                    Select
                  </Button>
                </div>
              </DialogFooter>
            )}
            {filesUploaded?.length > 0 && (
              <DialogFooter className="px-4 pt-4 border-t">
                <Button
                  onClick={() => {
                    form.handleSubmit(handleFileUpload)();
                  }}
                  disabled={createFileMutation.isPending}
                  isLoading={createFileMutation.isPending}
                >
                  Save
                </Button>
              </DialogFooter>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
