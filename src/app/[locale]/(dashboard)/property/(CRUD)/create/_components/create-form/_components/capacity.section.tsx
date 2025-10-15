// "use client";
// import {
//   CreationFormSection,
//   CreationFormSectionContent,
//   CreationFormSectionInfo,
//   CreationFormSectionInfoDescription,
//   CreationFormSectionInfoTitle,
// } from "@/components/creation-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { forwardRef } from "react";
// import { useFormContext } from "react-hook-form";
// import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
// import InlineAlert from "@/components/ui/inline-alert";

// // Create Room Capacity Section

// interface Props {
//   id: string;
// }

// const CreateRoom_Capacity_Section = forwardRef<HTMLDivElement, Props>(
//   ({ id }, ref) => {
//     const {
//       formState: { errors, disabled },
//       register,
//     } = useFormContext<CreateRoomValidationSchemaType>();

//     return (
//       <CreationFormSection ref={ref} id={id}>
//         <CreationFormSectionInfo>
//           <CreationFormSectionInfoTitle>
//             Size & Capacity
//           </CreationFormSectionInfoTitle>
//           <CreationFormSectionInfoDescription>
//             The room square meter size and capacity for the adults and children
//           </CreationFormSectionInfoDescription>
//         </CreationFormSectionInfo>
//         <CreationFormSectionContent className="md:grid-cols-3">
//           {/* room size */}
//           <div className="flex flex-col col-span-1 gap-2">
//             <Label htmlFor="size">
//               Size <span className="text-xs">(Square Meter)</span>
//             </Label>
//             <Input
//               id="size"
//               min={0}
//               defaultValue={0}
//               type="number"
//               disabled={disabled}
//               placeholder="Size (Square Meter)"
//               {...register("size", {
//                 required: true,
//                 valueAsNumber: true,
//               })}
//             />
//             {errors?.size ? (
//               <InlineAlert type="error">{errors.size.message}</InlineAlert>
//             ) : null}
//           </div>
//           {/* room capacity adults */}
//           <div className="flex flex-col col-span-1 gap-2">
//             <Label htmlFor="adults">Adults</Label>
//             <Input
//               id="adults"
//               min={0}
//               defaultValue={0}
//               type="number"
//               disabled={disabled}
//               placeholder="Adults number"
//               {...register("capacity_adults", {
//                 required: true,
//                 valueAsNumber: true,
//               })}
//             />
//             {errors?.capacity_adults ? (
//               <InlineAlert type="error">
//                 {errors.capacity_adults.message}
//               </InlineAlert>
//             ) : null}
//           </div>
//           {/* room capacity children */}
//           <div className="flex flex-col col-span-1 gap-2">
//             <Label htmlFor="children">Children</Label>
//             <Input
//               id="children"
//               min={0}
//               defaultValue={0}
//               type="number"
//               disabled={disabled}
//               placeholder="Children number"
//               {...register("capacity_children", {
//                 required: true,
//                 valueAsNumber: true,
//               })}
//             />
//             {errors?.capacity_children ? (
//               <InlineAlert type="error">
//                 {errors.capacity_children.message}
//               </InlineAlert>
//             ) : null}
//           </div>
//         </CreationFormSectionContent>
//       </CreationFormSection>
//     );
//   }
// );

// export default CreateRoom_Capacity_Section;
