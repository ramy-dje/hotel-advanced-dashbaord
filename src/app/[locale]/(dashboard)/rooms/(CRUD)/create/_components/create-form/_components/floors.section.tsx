"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import FloorInterface from "@/interfaces/floor.interface";
import ManageRoomsSheet from "./rooms-management-sheet/sheet";
import PropertyInterface from "@/interfaces/property.interface";

// Create Room Floors Section

interface Props {
  id: string;
  selectedPropertyDetails: PropertyInterface | null;
}

const CreateRoom_Floors_Section = forwardRef<HTMLDivElement, Props>(
  ({ id , selectedPropertyDetails}, ref) => {
    const {
      formState: { errors, disabled },
      setError,
      clearErrors,
      control,
    } = useFormContext<CreateRoomValidationSchemaType>();
    // console.log("CreateRoom_Floors_Section selected prooprtyyy", selectedPropertyDetails);

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Floors</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The floors and the ranges of the room
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
            <ManageRoomsSheet
              selectedPropertyDetails={selectedPropertyDetails}
              blockIndex={0}
              hasRooms={true} // Assuming ManageRoomsSheet will manage rooms, so setting to true
              hasFacilities={false}
            />
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_Floors_Section;




















































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
// import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
// import { forwardRef, useEffect, useState } from "react";
// import { useController, useFormContext } from "react-hook-form";
// import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
// import InlineAlert from "@/components/ui/inline-alert";
// import { Button } from "@/components/ui/button";
// import FloorInterface from "@/interfaces/floor.interface";
// import ManageRoomsSheet from "./rooms-management-sheet/sheet";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { generateSimpleId } from "@/lib/utils";
// import PropertyInterface from "@/interfaces/property.interface";

// // Create Room Floors Section

// interface Props {
//   floors: FloorInterface[];
//   id: string;
//   selectedPropertyDetails: PropertyInterface | undefined;
// }

// const CreateRoom_Floors_Section = forwardRef<HTMLDivElement, Props>(
//   ({ id, floors , selectedPropertyDetails}, ref) => {
//     const {
//       formState: { errors, disabled },
//       setError,
//       clearErrors,
//       control,
//     } = useFormContext<CreateRoomValidationSchemaType>();

//     const [floorsList, setFloorsList] = useState<
//       {
//         id: string;
//         floor_id: string;
//         name: string;
//         floor_free_space: number;
//         floor_range: {
//           start: number;
//           end: number;
//         };
//         range_start: number;
//         range_end: number;
//       }[]
//     >([
//       {
//         id: generateSimpleId(),
//         name: "",
//         floor_id: "",
//         floor_free_space: 0,
//         floor_range: {
//           end: 0,
//           start: 0,
//         },
//         range_end: 0,
//         range_start: 0,
//       },
//     ]);

//     // floors controller
//     const floors_controller = useController({
//       control,
//       name: "floors",
//       defaultValue: [],
//     });

//     // setting the floors_controller when floorList gets updated
//     useEffect(() => {
//       if (floorsList) {
//         floors_controller.field.onChange(
//           floorsList.map((floor) => ({
//             name: floor.name,
//             id: floor.floor_id,
//             range_start: floor.range_start,
//             range_end: floor.range_end,
//             floor_free_space: floor.floor_free_space,
//             floor_range: {
//               start: floor.floor_range.start,
//               end: floor.floor_range.end,
//             },
//           }))
//         );
//       }
//     }, [floorsList]);

//     // # Methods

//     // set the floor range
//     const setFloorRange = (
//       id: string,
//       range: { start?: number; end?: number }
//     ) => {
//       setFloorsList((floors) =>
//         floors.map((floor) =>
//           floor.id == id
//             ? {
//               ...floor,
//               ...(Number(range.start)
//                 ? { range_start: Number(range.start) }
//                 : {}),
//               ...(Number(range.end) ? { range_end: Number(range.end) } : {}),
//             }
//             : floor
//         )
//       );
//     };

//     // set the floor
//     const setFloorId = (id: string, floor_id: string) => {
//       const newFloor = floors.find((f) => f.id == floor_id)!;
//       setFloorsList((floors) =>
//         floors.map((floor) =>
//           floor.id == id
//             ? {
//               ...floor,
//               floor_range: {
//                 end: newFloor.range_end,
//                 start: newFloor.range_start,
//               },
//               floor_free_space: newFloor.free_space,
//               name: newFloor.name,
//               floor_id: newFloor.id,
//             }
//             : floor
//         )
//       );
//     };

//     // Add floor
//     const handleAddFloor = () => {
//       // remove the err
//       clearErrors("floors");
//       // checking the floors
//       for (let i = 0; i < floorsList.length; i++) {
//         const currentItem = floorsList[i];
//         const floor = floors.find((f) => f.id == currentItem.floor_id)!;
//         if (floor && currentItem.range_start <= currentItem.range_end) {
//           // checking if out of range
//           if (
//             !(floor.range_end >= currentItem.range_end) ||
//             !(floor.range_start <= currentItem.range_start)
//           ) {
//             // add error
//             setError("floors", {
//               message: `Out of ${floor.name} floor range`,
//               type: "validate",
//             });
//             return;
//           } else {
//             // remove the err
//             clearErrors("floors");
//           }
//           // checking if the floor has a free space
//           const room_space =
//             currentItem.range_start == currentItem.range_end
//               ? 1
//               : currentItem.range_end - currentItem.range_start;
//           if (room_space > floor.free_space) {
//             // add error
//             setError("floors", {
//               message: `${floor.name} floor hasn't enough space for this room`,
//               type: "validate",
//             });
//             return;
//           } else {
//             // remove the err
//             clearErrors("floors");
//           }
//         } else {
//           setError("floors", {
//             message: `Add valid floor and ranges`,
//             type: "validate",
//           });
//           return;
//         }
//       }
//       // Add a empty floor
//       setFloorsList((fs) => [
//         ...fs,
//         {
//           id: generateSimpleId(),
//           floor_free_space: 0,
//           floor_range: {
//             end: 0,
//             start: 0,
//           },
//           floor_id: "",
//           name: "",
//           range_end: 0,
//           range_start: 0,
//         },
//       ]);
//     };

//     // remove floor
//     const handleRemoveFloor = (id: string) => {
//       clearErrors("floors");
//       if (id) {
//         setFloorsList((list) => list.filter((p) => p.id !== id));
//       }
//     };

//     return (
//       <CreationFormSection ref={ref} id={id}>
//         <CreationFormSectionInfo>
//           <CreationFormSectionInfoTitle>Floors</CreationFormSectionInfoTitle>
//           <CreationFormSectionInfoDescription>
//             The floors and the ranges of the room
//           </CreationFormSectionInfoDescription>
//         </CreationFormSectionInfo>
//         <CreationFormSectionContent>
//           {/* list part */}

//           {/* {floorsList.map((floor) => (
//             <div
//               key={floor.id}
//               className="col-span-2 md:col-span-full flex flex-col md:flex-row items-end gap-7 mb-2"
//             >
//               <div className="w-full md:w-1/3 flex flex-col gap-2">
//                 <Label htmlFor={"floor" + floor.id}>Floor</Label>
//                 <Select
//                   value={floor.floor_id}
//                   onValueChange={(id) => setFloorId(floor.id, id)}
//                 >
//                   <SelectTrigger id={"floor" + floor.id} className="w-full">
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent className="min-w-[calc(100%+2em)]">
//                     {floors.map((floorItem) => (
//                       <SelectItem
//                         value={floorItem.id}
//                         key={floorItem.id}
//                         className="gap-4"
//                       >
//                         <span>{floorItem.name}</span>
//                         {"  "}
//                         <span className="px-2 rounded-full bg-secondary text-muted-foreground">
//                           {floorItem.range_start}
//                           <span className="text-foreground"> - </span>
//                           {floorItem.range_end}
//                         </span>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="w-full md:w-1/3 flex flex-col gap-2">
//                 <Label htmlFor={"start" + floor.id}>Range Start</Label>
//                 <Input
//                   id={"start" + floor.id}
//                   min={0}
//                   defaultValue={0}
//                   disabled={disabled}
//                   type="number"
//                   placeholder="Start"
//                   value={floor.range_start}
//                   onChange={(e) =>
//                     setFloorRange(floor.id, {
//                       start: Number(e.target.value) || 0,
//                     })
//                   }
//                 />
//               </div>
//               <div className="w-full md:w-1/3 flex flex-col gap-2">
//                 <Label htmlFor={"end" + floor.id}>Range End</Label>
//                 <Input
//                   id={"end" + floor.id}
//                   min={0}
//                   defaultValue={0}
//                   disabled={disabled}
//                   value={floor.range_end}
//                   type="number"
//                   onChange={(e) =>
//                     setFloorRange(floor.id, {
//                       end: Number(e.target.value) || 0,
//                     })
//                   }
//                   placeholder="End"
//                 />
//               </div>

//               {floorsList.length > 1 ? (
//                 <Button
//                   onClick={() => handleRemoveFloor(floor.id)}
//                   type="button"
//                   variant="secondary"
//                   size="icon"
//                   className="min-w-10"
//                   disabled={disabled}
//                 >
//                   <HiOutlineTrash className="size-4" />
//                 </Button>
//               ) : null}
//             </div>
//           ))}

//           <div className="col-span-2 md:col-span-full flex justify-end">
//             <Button
//               onClick={handleAddFloor}
//               type="button"
//               variant="outline"
//               disabled={disabled}
//               className="gap-2"
//             >
//               <HiOutlinePlus className="size-4" />
//               Add Floor
//             </Button>
//           </div>

//           <div className="col-span-2">
//             {errors?.floors ? (
//               <InlineAlert type="error">{errors.floors.message}</InlineAlert>
//             ) : null}
//           </div> */}
//             <ManageRoomsSheet
//               selectedPropertyDetails={selectedPropertyDetails}
//               blockIndex={0}
//               hasRooms={floorsList.length > 0}
//               hasFacilities={false}
//             />

//         </CreationFormSectionContent>
//       </CreationFormSection>
//     );
//   }
// );

// export default CreateRoom_Floors_Section;
