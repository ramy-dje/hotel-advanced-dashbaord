"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateDestinationValidationSchemaType } from "../update-destination-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { HiOutlineTrash } from "react-icons/hi";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const maxFileSize = 1024 ** 1024 * 2; // 2MB

const generateId = () => Math.random().toString(16).slice(2).toString();

// Update Destination Images Section

interface Props {
  id: string;
}

const UpdateDestination_Images_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
    } = useFormContext<UpdateDestinationValidationSchemaType>();
    // files
    const [files, setFiles] = useState<
      { id: string; file: File | null; url: string | null }[]
    >([]);
    // primary image
    const [primaryImage, setPrimaryImage] = useState<null | string>(null);

    // mainImage controller
    const main_image_url_controller = useController({
      control,
      name: "main_image_url",
    });

    // gallery controller
    const gallery_url_controller = useController({
      control,
      name: "gallery_images_url",
    });

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

    // setting the old images

    const setOldImages = useCallback(() => {
      if (
        main_image_url_controller.field.value &&
        gallery_url_controller.field.value
      ) {
        // setting the main image
        const main_id = generateId();
        setFiles(() => [
          {
            file: null,
            id: main_id,
            url: main_image_url_controller.field.value,
          },
          ...gallery_url_controller.field.value.map((url) => ({
            file: null,
            id: generateId(),
            url: url,
          })),
        ]);
        setPrimaryImage(main_id);
      }
    }, [
      main_image_url_controller.field.value,
      gallery_url_controller.field.value,
    ]);

    // setting the old images
    useEffect(() => {
      setOldImages();
    }, [
      main_image_url_controller.field.value,
      gallery_url_controller.field.value,
    ]);

    // update the images when ever the files gets updated
    useEffect(() => {
      if (files.length > 0) {
        let primaryImageId = primaryImage;
        // setting the primary image and gallery photos
        const primary =
          files.filter((e) => e.id == primaryImage)[0] || files[0];

        // if the user didn't set the primary image so we set the id of the first file
        if (primaryImageId == null) {
          primaryImageId = primary.id;
        }

        // setting the main image
        main_image_controller.field.onChange(
          primary?.file ? primary?.file : primary?.url
        );
        // setting the gallery images
        gallery_controller.field.onChange(
          files
            .filter((f) => f.id !== primaryImageId)
            .map((n) => (n?.file ? n.file : n.url))
        );
      } else {
        main_image_controller.field.onChange(null);
        gallery_controller.field.onChange([]);
      }
    }, [files, primaryImage]);

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
                  setFiles((imgs) => [
                    ...imgs,
                    ...f.map((e) => {
                      return {
                        file: e,
                        url: null,
                        id: generateId(),
                      };
                    }),
                  ]);
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
                    onClick={setOldImages}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="gap-1"
                  >
                    <HiOutlineTrash className="size-4" />
                    Clear & reset {files.length} images
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
                  alt={file?.file ? file.file.name : (file.url as string)}
                  url={
                    file.file
                      ? (() => {
                          return URL.createObjectURL(file.file);
                        })()
                      : (file.url as string)
                  }
                  onClick={() => setPrimaryImage(file.id)}
                  className={
                    primaryImage != file.id ? "cursor-pointer" : "cursor-auto"
                  }
                  tag={primaryImage == file.id ? "Primary" : null}
                  onRemove={() => handelRemoveImage(file.id)}
                  meta={
                    file.file
                      ? { name: file.file.name, size: file.file.size }
                      : undefined
                  }
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

export default UpdateDestination_Images_Section;
