"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import FileSelectorModal from "@/components/select-images-dialog";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import {
  FOLDERS_NAME,
  handelRemoveImage,
} from "@/components/select-images-dialog/helper";
import { FilePreview } from "@/components/file-upload/file-preview";
import InlineAlert from "@/components/ui/inline-alert";
import { DropZoneCard } from "@/components/upload-files/drop-zone";

// Create Room Images Section

interface Props {
  id: string;
}

const CreateRoom_Images_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const [isOpen, setOpen] = useState(false);
    const {
      control,
      formState: { errors },
    } = useFormContext<CreateRoomValidationSchemaType>();

    const primary_image_controller = useController({
      control: control,
      name: "main_image",
    });
    const files_controller = useController({
      control: control,
      name: "gallery_images",
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Image & Photos
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The images and gallery photos of the room
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="col-span-full flex flex-col gap-5">
            <div
              className="w-full flex items-center justify-center select-noneP border py-6 rounded-lg border-border cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <DropZoneCard placeholder="Select images" />
            </div>

            <FileSelectorModal
              isOpen={isOpen}
              onClose={() => setOpen(false)}
              allowedFileTypes={["image"]}
              maxFileSize={1024 * 1024 * 2} // 2MB
              setFormSelectedFiles={files_controller.field.onChange}
              setFormPrimaryImage={primary_image_controller.field.onChange}
              formSelectedFiles={files_controller.field.value}
              parentName={FOLDERS_NAME.ROOMS}
            />
            <div
              className={cn(
                "w-full grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]"
              )}
            >
              {files_controller.field.value?.map((file) => (
                <FilePreview
                  key={file.id}
                  url={file.presignedUrl}
                  file={file as any}
                  onClick={() =>
                    primary_image_controller.field.onChange(file.id)
                  }
                  className={
                    primary_image_controller.field.value != file.id
                      ? "cursor-pointer"
                      : "cursor-auto"
                  }
                  tag={
                    primary_image_controller.field.value == file.id
                      ? "Primary"
                      : null
                  }
                  onRemove={() =>
                    handelRemoveImage({
                      id: file.id,
                      files: files_controller.field.value,
                      setFiles: files_controller.field.onChange,
                      primaryImage: primary_image_controller.field.value,
                      setPrimaryImage: primary_image_controller.field.onChange,
                    })
                  }
                  onlyImagePreview
                />
              ))}
            </div>
            {errors?.main_image ? (
              <InlineAlert type="error">
                {errors.main_image.message as string}
              </InlineAlert>
            ) : null}
            {errors?.gallery_images ? (
              <InlineAlert type="error">
                {errors.gallery_images.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

CreateRoom_Images_Section.displayName = "CreateRoom_Images_Section";

export default CreateRoom_Images_Section;
