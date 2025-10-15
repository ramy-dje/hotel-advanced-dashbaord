"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateDestinationValidationSchemaType } from "../create-destination-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { HiOutlineTrash } from "react-icons/hi";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const maxFileSize = 1024 ** 1024 * 2; // 2MB

const generateId = () => Math.random().toString(16).slice(2).toString();

// Create Destination Images Section

interface Props {
  id: string;
}

const CreateDestination_Images_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
    } = useFormContext<CreateDestinationValidationSchemaType>();
    // files
    const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
    // primary image
    const [primaryImage, setPrimaryImage] = useState<null | string>(null);

    // mainImage controller
    const main_image_controller = useController({
      control,
      name: "main_image",
    });

    // gallery controller
    const gallery_controller = useController({
      control,
      name: "gallery_images",
    });

    // update the images when ever the files gets updated
    useEffect(() => {
      if (files.length > 0) {
        // setting the primary image and gallery photos
        const primary =
          files.filter((e) => e.id == primaryImage)[0] || files[0];
        main_image_controller.field.onChange(primary.file);
        gallery_controller.field.onChange(
          files.filter((f) => f.id !== primaryImage).map((n) => n.file)
        );
      } else {
        main_image_controller.field.onChange(null);
        gallery_controller.field.onChange([]);
      }
    }, [files]);

    // handle remove image
    const handelRemoveImage = (id: string) => {
      setFiles((files) => files.filter((f) => f.id !== id));
      if (id == primaryImage) {
        setPrimaryImage(files[0].id);
      }
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Image & Photos
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The images and gallery photos of the destination
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="col-span-full flex flex-col gap-5">
            <div className="flex items-center justify-between w-full border-border border rounded-md">
              <DropZone
                disabled={disabled}
                setFiles={(f) => {
                  setFiles(
                    f.map((e, idx) => {
                      const id = generateId();
                      if (idx == 0 && e) {
                        // setting the primary image to the first item
                        e && setPrimaryImage(id);
                      }
                      return {
                        file: e,
                        id: id,
                      };
                    })
                  );
                }}
                className={cn(
                  "border-0 pl-6 w-full",
                  files.length > 1 && "w-1/2 justify-start"
                )}
                maxSize={maxFileSize}
                accept={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "image/webp": [],
                }}
              />
              {files.length > 1 ? (
                <div className="px-6 flex items-center gap-3">
                  <Button
                    onClick={() => setFiles([])}
                    variant="outline"
                    disabled={disabled}
                    className="gap-1"
                  >
                    <HiOutlineTrash className="size-4" />
                    Clear {files.length} images
                  </Button>
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "w-full grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]"
              )}
            >
              {files.map((file) => (
                <UploadedImageItem
                  key={file.id}
                  alt={file.file.name}
                  url={(() => {
                    return URL.createObjectURL(file.file);
                  })()}
                  onClick={() => setPrimaryImage(file.id)}
                  className={
                    primaryImage != file.id ? "cursor-pointer" : "cursor-auto"
                  }
                  tag={primaryImage == file.id ? "Primary" : null}
                  onRemove={() => handelRemoveImage(file.id)}
                  meta={{ name: file.file.name, size: file.file.size }}
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

export default CreateDestination_Images_Section;
