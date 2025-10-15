// "use client";

// import {
//   CreationFormSection,
//   CreationFormSectionContent,
//   CreationFormSectionInfo,
//   CreationFormSectionInfoDescription,
//   CreationFormSectionInfoTitle,
// } from "@/components/creation-form";
// import { forwardRef, useCallback, useEffect, useState } from "react";
// import { useController, useFormContext } from "react-hook-form";
// import { CreatePropertyValidationSchemaType } from "../create-property-validation.schema";
// import InlineAlert from "@/components/ui/inline-alert";
// import { HiOutlineTrash } from "react-icons/hi";
// import DropZone from "@/components/upload-files/drop-zone";
// import UploadedImageItem from "@/components/uploaded-image";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// const maxFileSize = 1024 ** 2 * 2; // 2MB
// const generateId = () => Math.random().toString(16).slice(2);

// interface Props {
//   id: string;
// }

// const CreateProperty_Images_Section = forwardRef<HTMLDivElement, Props>(
//   ({ id }, ref) => {
//     const {
//       setValue,
//       getValues,
//       control,
//       formState: { errors, disabled },
//     } = useFormContext<CreatePropertyValidationSchemaType>();

//     // track files and primary
//     const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
//     const [primaryImage, setPrimaryImage] = useState<string | null>(null);

//     // revoke URLs
//     const addImageURLToRevoke = useCallback(
//       (url: string) => {
//         setValue("mainDetails.imageGallery", getValues("mainDetails.imageGallery") || []);
//         setValue("imagesURLs_to_revoked", [
//           ...(getValues("imagesURLs_to_revoked") || []),
//           url,
//         ]);
//       },
//       [getValues, setValue]
//     );

//     // controllers
//     const mainGalleryController = useController({ control, name: "mainDetails.imageGallery" });

//     // sync files -> form
//     useEffect(() => {
//       if (files.length > 0) {
//         // first file becomes primary
//         const primary = files.find((f) => f.id === primaryImage) || files[0];
//         setValue("mainDetails.imageGallery", files.map((f) => f.file));
//         mainGalleryController.field.onChange(files.map((f) => f.file));
//       } else {
//         setValue("mainDetails.imageGallery", []);
//         mainGalleryController.field.onChange([]);
//       }
//     }, [files, primaryImage, setValue, mainGalleryController.field]);

//     const handleRemove = (id: string) => {
//       setFiles((curr) => curr.filter((f) => f.id !== id));
//       if (id === primaryImage) setPrimaryImage(files[0]?.id || null);
//     };

//     return (
//       <CreationFormSection ref={ref} id={id}>
//         <CreationFormSectionInfo>
//           <CreationFormSectionInfoTitle>Images & Photos</CreationFormSectionInfoTitle>
//           <CreationFormSectionInfoDescription>
//             Upload main image and gallery for the property
//           </CreationFormSectionInfoDescription>
//         </CreationFormSectionInfo>

//         <CreationFormSectionContent>
//           <div className="col-span-full flex flex-col gap-5">
//             <div className="relative flex items-center justify-between border border-border rounded-md">
//               <DropZone
//                 disabled={disabled}
//                 setFiles={(fList) => {
//                   const mapped = fList.map((file, idx) => {
//                     const id = generateId();
//                     if (idx === 0) setPrimaryImage(id);
//                     return { id, file };
//                   });
//                   setFiles(mapped);
//                 }}
//                 className={cn(
//                   "border-0 pl-6 w-full",
//                   files.length > 1 && "w-1/2 justify-start"
//                 )}
//                 maxSize={maxFileSize}
//                 accept={{
//                   "image/png": [],
//                   "image/jpeg": [],
//                   "image/jpg": [],
//                   "image/webp": [],
//                 }}
//               />
//               {files.length > 1 && (
//                 <div className="px-6">
//                   <Button
//                     variant="outline"
//                     disabled={disabled}
//                     onClick={() => setFiles([])}
//                     className="gap-1"
//                   >
//                     <HiOutlineTrash className="size-4" /> Clear {files.length}
//                   </Button>
//                 </div>
//               )}
//               <span className="absolute bottom-1 right-2 text-xs text-accent-foreground">
//                 Max Image Size 2MB
//               </span>
//             </div>

//             <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]">
//               {files.map((f) => {
//                 const url = URL.createObjectURL(f.file);
//                 addImageURLToRevoke(url);
//                 return (
//                   <UploadedImageItem
//                     key={f.id}
//                     alt={f.file.name}
//                     url={url}
//                     tag={primaryImage === f.id ? "Primary" : null}
//                     onClick={() => setPrimaryImage(f.id)}
//                     onRemove={() => handleRemove(f.id)}
//                     className={primaryImage !== f.id ? "cursor-pointer" : ""}
//                     meta={{ name: f.file.name, size: f.file.size }}
//                   />
//                 );
//               })}
//             </div>

//             {errors.mainDetails?.imageGallery && (
//               <InlineAlert type="error">
//                 {(errors.mainDetails.imageGallery as any).message}
//               </InlineAlert>
//             )}
//           </div>
//         </CreationFormSectionContent>
//       </CreationFormSection>
//     );
//   }
// );

// export default CreateProperty_Images_Section;
// CreateProperty_Images_Section.displayName = "CreateProperty_Images_Section";