"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import InlineAlert from "@/components/ui/inline-alert";
import DropZone from "@/components/upload-files/drop-zone";
import Image from "next/image";
import { CreatePropertyInterface } from "@/interfaces/property.interface";

interface GalleryUploaderProps {
  id: string;
}

const GalleryUploader = forwardRef<HTMLDivElement, GalleryUploaderProps>(({ id }, ref) => {
  const {
    control,
    formState: { errors, disabled },
    register,
  } = useFormContext<CreatePropertyInterface>();

  const galleryCtrl = useController({ control, name: "imageGallery" });
  const currentFiles: File[] = galleryCtrl.field.value || [];
  // const previews = currentFiles.map((file) => URL.createObjectURL(file));
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const files: File[] = galleryCtrl.field.value || [];
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Clean up the created URLs to avoid memory leaks
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryCtrl.field.value]);
  // const previews = localFiles.map((file) => URL.createObjectURL(file));
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <CreationFormSection id={`${id}-setup`} ref={ref}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Property Gallery</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Upload, organize, and display property images
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        <div className="col-span-2 w-full">
          <DropZone
            accept="image/*"
            disabled={disabled}
            multiple
            setFiles={(newFiles) => {
              const updatedFiles = [...(galleryCtrl.field.value || []), ...newFiles];
              galleryCtrl.field.onChange(updatedFiles);
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          />
          {errors.imageGallery && (
            <InlineAlert type="error">
              {String(errors.imageGallery.message)}
            </InlineAlert>
          )}

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="col-span-2 w-full h-[302px] relative rounded-lg overflow-hidden">
                <Image
                  src={previews[0]}
                  alt="Featured"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                {previews.slice(1, 4).map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-[95px] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {idx === 2 && previews.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium">
                        +{previews.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="video360">360° Video URL</Label>
            <Input
              id="video360"
              disabled={disabled}
              {...register("video360")}
              placeholder="Enter 360° Video URL"
            />
          </div>


        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

GalleryUploader.displayName = "GalleryUploader";
export default GalleryUploader;
