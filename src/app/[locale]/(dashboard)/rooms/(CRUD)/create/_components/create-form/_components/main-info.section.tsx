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
import { forwardRef, useEffect, useState, useTransition } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import RoomCategoryInterface from "@/interfaces/room-category.interface"; // Assuming this is still used if 'categories' prop remains
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/text-editor";
import { DebouncedInput } from "@/components/debounced-input"; // Not directly used in this snippet, but kept if needed elsewhere
import PropertyInterface from "@/interfaces/property.interface";
import { Loader2 } from "lucide-react";
import useServerTable from "@/hooks/use-server-table";

interface Props {
  id: string;
  categories: RoomCategoryInterface[]; // This prop seems unused in the current logic but kept if external usage depends on it.
  onPropertySelect: (property: PropertyInterface | null) => void;
}

const CreateRoom_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, categories, onPropertySelect }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      setValue,
      register, // Use register for simpler fields
    } = useFormContext<CreateRoomValidationSchemaType>();

    const [isPending, startTransition] = useTransition(); // Not used in this snippet, but kept
    const [propertySearchQuery, setPropertySearchQuery] = useState("");

    const [localFetchedProperties, setLocalFetchedProperties] = useState<PropertyInterface[]>([]);
    const [localTotalProperties, setLocalTotalProperties] = useState(0);

    // Using useController for fields that might have more complex interactions (like onChange, onBlur)
    // or when you need the full controller object.
    const propertyCode_controller = useController({ control, name: "propertyCode" });
    const propertyName_controller = useController({ control, name: "propertyName" }); // Corrected to propertyName
    const accommodation_controller = useController({ control, name: "accommodation" });
    const type_controller = useController({ control, name: "type" });
    const roomCode_controller = useController({ control, name: "roomCode" }); // Renamed from 'code'
    const description_controller = useController({ control, name: "description" });

    // This useEffect block seems to be based on an old schema where 'type' selected a 'name'.
    // Your new interface doesn't have a 'name' field for the room itself,
    // so this line setValue("name", selectedType.name) is problematic.
    // Assuming 'type' itself holds the value you want to use.
    // If 'categories' are still meant to populate 'type' options,
    // you'll need to adapt this logic or provide the `types` array.
    // For now, I'm commenting it out or simplifying it as it doesn't align with the new interface.
    // If your 'categories' prop is meant for the 'type' field options, you should map it to SelectItem values.
    /*
    useEffect(() => {
      // Assuming 'categories' is meant to be the source for the 'type' field options
      // And the 'type_controller.field.value' should correspond to an ID/value from 'categories'
      if (type_controller.field.value && categories) {
        // Find the category that matches the selected type value
        const selectedCategory = categories.find(
          (cate) => cate.id === type_controller.field.value
        );
        if (selectedCategory) {
          // If you need to set some other derived field based on the type, do it here.
          // For now, there's no 'name' field in CreateRoomInterface for the room itself,
          // so this line is likely no longer needed or needs a different target.
          // setValue("someOtherFieldBasedOnType", selectedCategory.name);
        }
      }
    }, [type_controller.field.value, categories, setValue]);
    */


    const { isFetching: isPropertySearching } = useServerTable<PropertyInterface>({
      api: {
        url: "property",
      },
      data: localFetchedProperties,
      setData: setLocalFetchedProperties,
      totalData: localTotalProperties, 
      setTotalData: setLocalTotalProperties,
      column: [],
      sorting: {},
      initialTable: {},
      defaultRowsPerPage: "25",
      initialPage: 1,
      search: {
        query: "q",
        state: propertySearchQuery,
      },
      onError: (err) => {
        console.error("Error fetching properties for search:", err);
        setLocalFetchedProperties([]);
        onPropertySelect(null); // Clear selected property on search error
      }
    });

    useEffect(() => {
      if (localFetchedProperties.length === 1 && propertySearchQuery.trim()) {
        const selectedProp = localFetchedProperties[0];
        setValue("propertyCode", selectedProp.code); // Set propertyCode from the selected property
        setValue("propertyName", selectedProp.propertyName); // Set propertyName

        onPropertySelect(selectedProp);
      } else {
        const currentSelectionPropertyName = propertyName_controller.field.value;
        const isCurrentSelectionValid = localFetchedProperties.some(p => p.propertyName === currentSelectionPropertyName);

        if (!currentSelectionPropertyName || !isCurrentSelectionValid) {
          setValue("propertyCode", "");
          setValue("propertyName", "");
          onPropertySelect(null);
        } else {
          const currentlySelectedProp = localFetchedProperties.find(p => p.propertyName === currentSelectionPropertyName);
          onPropertySelect(currentlySelectedProp || null);
        }
      }
    }, [localFetchedProperties, propertySearchQuery, setValue, propertyName_controller.field.value, onPropertySelect]);


    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Write your room name, description and main information from here
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* Property Code/Search */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2 relative">
            <Label htmlFor="propertyCode">Search Property (Code or Name)</Label>
            <Input
              id="propertyCode"
              type="text"
              value={propertyCode_controller.field.value}
              onChange={(e) => {
                propertyCode_controller.field.onChange(e.target.value); // Update react-hook-form
                setPropertySearchQuery(e.target.value); // Trigger search
              }}
              onBlur={propertyCode_controller.field.onBlur}
              ref={propertyCode_controller.field.ref}
              disabled={disabled}
              placeholder="Enter property code or name..."
            />

            {isPropertySearching && (
              <Loader2 className="animate-spin h-5 w-5 text-blue-500 absolute right-2 top-2 mt-2 mr-2" />
            )}
            {errors?.propertyCode ? (
              <InlineAlert type="error">
                {errors.propertyCode.message}
              </InlineAlert>
            ) : null}
          </div>

          {/* Property Name (Select/Display) */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="propertyName">Selected Property Name</Label>
            <Select
              onValueChange={(selectedPropertyName) => {
                // Find the full property object by name
                const selectedProp = localFetchedProperties.find(p => p.propertyName === selectedPropertyName);
                if (selectedProp) {
                  setValue("propertyCode", selectedProp.code); // Set propertyCode
                  setValue("propertyName", selectedProp.propertyName); // Set propertyName
                  onPropertySelect(selectedProp); // Inform parent
                } else {
                  setValue("propertyCode", "");
                  setValue("propertyName", "");
                  onPropertySelect(null);
                }
              }}
              value={propertyName_controller.field.value}
              disabled={disabled || isPropertySearching || localFetchedProperties.length === 0}
            >
              <SelectTrigger id="propertyName" className="w-auto">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {localFetchedProperties.length > 0 ? (
                  localFetchedProperties.map((prop) => (
                    // Use propertyName as value since that's what's displayed and what the controller uses
                    <SelectItem key={prop.id} value={prop.propertyName}>
                      {prop.propertyName} ({prop.code})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_results__" disabled>
                    No properties found. Search above.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors?.propertyName ? (
              <InlineAlert type="error">{errors.propertyName.message}</InlineAlert>
            ) : null}
          </div>


          {/* Accommodation Select */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="accommodation">Accommodation</Label>
            <Select
              onValueChange={accommodation_controller.field.onChange}
              value={accommodation_controller.field.value}
              // onBlur={accommodation_controller.field.onBlur}
              disabled={disabled}
            >
              <SelectTrigger id="accommodation" className="w-auto">
                <SelectValue placeholder="Select accommodation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                {/* Add more as needed */}
              </SelectContent>
            </Select>
            {errors?.accommodation ? (
              <InlineAlert type="error">
                {errors.accommodation.message}
              </InlineAlert>
            ) : null}
          </div>

          {/* Type Select */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={type_controller.field.onChange}
              value={type_controller.field.value}
              // onBlur={type_controller.field.onBlur}
              disabled={disabled}
            >
              <SelectTrigger id="type" className="w-auto">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                {/* Dynamically load from `categories` prop if `categories` are room types */}
                {/* {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))} */}
              </SelectContent>
            </Select>
            {errors?.type ? (
              <InlineAlert type="error">{errors.type.message}</InlineAlert>
            ) : null}
          </div>

          {/* Room Code with generate button */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="roomCode">Room Code</Label>{" "} {/* Label changed to roomCode */}
            <div className="flex gap-2">
              <Input
                id="roomCode" // ID changed to roomCode
                type="text"
                disabled={disabled}
                placeholder="Unique Code"
                // Using spread for simple register
                {...register("roomCode", { required: true })} // Name changed to roomCode
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  setValue(
                    "roomCode", // Set value for roomCode
                    Math.random().toString(36).substring(2, 10).toUpperCase()
                  )
                }
                className="px-4 py-2 text-sm bg-gray-200 rounded-md"
              >
                Generate
              </button>
            </div>
            {errors?.roomCode ? (
              <InlineAlert type="error">{errors.roomCode.message}</InlineAlert>
            ) : null}
          </div>

          {/* Room Description */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextEditor
              content={description_controller.field.value}
              setContent={(n) => {
                description_controller.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Description Of The Room"
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_MainInformation_Section;

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
// import { forwardRef, useEffect, useState, useTransition } from "react";
// import { useController, useFormContext } from "react-hook-form";
// import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
// import RoomCategoryInterface from "@/interfaces/room-category.interface";
// import InlineAlert from "@/components/ui/inline-alert";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import TextEditor from "@/components/text-editor";
// import { DebouncedInput } from "@/components/debounced-input";
// import PropertyInterface from "@/interfaces/property.interface"; // Make sure this import is correct
// import { Loader2 } from "lucide-react";
// import useServerTable from "@/hooks/use-server-table";

// interface Props {
//   id: string;
//   categories: RoomCategoryInterface[];
//   // --- NEW PROP: Callback function to send selected property details to parent ---
//   onPropertySelect: (property: PropertyInterface | null) => void;
// }

// const CreateRoom_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
//   ({ id, categories, onPropertySelect }, ref) => {
//     const {
//       control,
//       formState: { errors, disabled },
//       setValue,
//       register,
//     } = useFormContext<CreateRoomValidationSchemaType>();

//     const [isPending, startTransition] = useTransition();
//     const [propertySearchQuery, setPropertySearchQuery] = useState("");

//     const [localFetchedProperties, setLocalFetchedProperties] = useState<PropertyInterface[]>([]);
//     const [localTotalProperties, setLocalTotalProperties] = useState(0);

//     const propertyCode_controller = useController({
//       control,
//       name: "propertyCode",
//     });

//     const property_controller = useController({
//       control,
//       name: "propertyName",
//     });

//     const description_controller = useController({
//       control,
//       name: "description",
//     });

//     const type_controller = useController({
//       control,
//       name: "type",
//     });

//     useEffect(() => {
//       if (type_controller.field.value) {
//         const selectedType = types.find(
//           (cate) => cate.id == type_controller.field.value
//         )!;
//         setValue("name", selectedType.name);
//       }
//     }, [type_controller.field.value, categories, setValue]);


//     const { isFetching: isPropertySearching } = useServerTable<PropertyInterface>({
//       api: {
//         url: "property",
//       },
//       data: localFetchedProperties,
//       setData: setLocalFetchedProperties,
//       totalData: localTotalProperties,
//       setTotalData: setLocalTotalProperties,
//       column: [],
//       sorting: {},
//       initialTable: {},
//       defaultRowsPerPage: "25",
//       initialPage: 1,
//       search: {
//         query: "q",
//         state: propertySearchQuery,
//       },
//       onError: (err) => {
//         console.error("Error fetching properties for search:", err);
//         setLocalFetchedProperties([]);
//         onPropertySelect(null); // Clear selected property on search error
//       }
//     });

//     // Effect to automatically select property if only one result is found
//     // and to inform parent about selection changes (including clearing)
//     useEffect(() => {
//       if (localFetchedProperties.length === 1 && propertySearchQuery.trim()) {
//         const selectedProp = localFetchedProperties[0];
//         // setValue("property", selectedProp.id);
//         setValue("propertyName", selectedProp.propertyName);

//         onPropertySelect(selectedProp); // <-- Inform parent about the auto-selected property
//       } else {
//         const currentSelectionId = property_controller.field.value;
//         const isCurrentSelectionValid = localFetchedProperties.some(p => p.id === currentSelectionId);

//         if (!currentSelectionId || !isCurrentSelectionValid) {
//           // setValue("property", ""); // Clear the react-hook-form value
//           setValue("propertyName", ""); // Clear property name

//           onPropertySelect(null); // <-- Inform parent that no property is selected
//         } else {
//           // If there's a current selection and it's still valid in the new results,
//           // make sure the parent still has its details. This handles cases where
//           // the user previously selected something, then searched for something else
//           // but the original selection is still in the list.
//           const currentlySelectedProp = localFetchedProperties.find(p => p.id === currentSelectionId);
//           onPropertySelect(currentlySelectedProp || null);
//         }
//       }
//     }, [localFetchedProperties, propertySearchQuery, setValue, property_controller.field.value, onPropertySelect]);


//     return (
//       <CreationFormSection ref={ref} id={id}>
//         <CreationFormSectionInfo>
//           <CreationFormSectionInfoTitle>
//             Main Information
//           </CreationFormSectionInfoTitle>
//           <CreationFormSectionInfoDescription>
//             Write your room name, description and main information from here
//           </CreationFormSectionInfoDescription>
//         </CreationFormSectionInfo>
//         <CreationFormSectionContent>
//           <div className="flex flex-col col-span-2 md:col-span-1 gap-2 relative">
//             <Label htmlFor="propertyCode">Search Property (Code or Name)</Label>
//             <Input
//               id="propertyCode"
//               type="text"
//               value={propertyCode_controller.field.value}
//               onChange={(e) => {
//                 propertyCode_controller.field.onChange(e);
//                 setPropertySearchQuery(e.target.value);
//               }}
//               onBlur={propertyCode_controller.field.onBlur}
//               ref={propertyCode_controller.field.ref}
//               disabled={disabled}
//               placeholder="Enter property code or name..."
//             />

//             {isPropertySearching && (
//               <Loader2 className="animate-spin h-5 w-5 text-blue-500 absolute right-2 top-2 mt-2 mr-2" />
//             )}
//             {errors?.propertyCode ? (
//               <InlineAlert type="error">
//                 {errors.propertyCode.message}
//               </InlineAlert>
//             ) : null}
//           </div>

//           <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
//             <Label htmlFor="property">Select Property</Label>
//             <Select
//               onValueChange={(selectedId) => {
//                 property_controller.field.onChange(selectedId); // Update react-hook-form

//                 // --- NEW LOGIC: Find the full property object and send to parent ---
//                 const selectedProp = localFetchedProperties.find(p => p.id === selectedId);
//                 onPropertySelect(selectedProp || null); // Pass the full object or null
//               }}
//               value={property_controller.field.value}
//               disabled={disabled || isPropertySearching || localFetchedProperties.length === 0}
//             >
//               <SelectTrigger id="property" className="w-auto">
//                 <SelectValue placeholder="Select a property" />
//               </SelectTrigger>
//               <SelectContent>
//                 {localFetchedProperties.length > 0 ? (
//                   localFetchedProperties.map((prop) => (
//                     <SelectItem key={prop.id} value={prop.id as string}>
//                       {prop.propertyName} ({prop.code})
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="__no_results__" disabled>
//                     No properties found. Search above.
//                   </SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//             {errors?.propertyName ? (
//               <InlineAlert type="error">{errors.propertyName.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* accommodation select */}
//           <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
//             <Label htmlFor="accommodation">Accommodation</Label>
//             <Select {...register("accommodation")}>
//               <SelectTrigger
//                 id="accommodation"
//                 className="w-auto"
//                 disabled={disabled}
//               >
//                 <SelectValue placeholder="Select accommodation" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="shared">Shared</SelectItem>
//                 <SelectItem value="private">Private</SelectItem>
//                 <SelectItem value="luxury">Luxury</SelectItem>
//               </SelectContent>
//             </Select>
//             {errors?.accommodation ? (
//               <InlineAlert type="error">
//                 {errors.accommodation.message}
//               </InlineAlert>
//             ) : null}
//           </div>

//           {/* Type Select */}
//           <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
//             <Label htmlFor="type">Type</Label>
//             <Select {...register("type")}>
//               <SelectTrigger id="type" className="w-auto" disabled={disabled}>
//                 <SelectValue placeholder="Select type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="standard">Standard</SelectItem>
//                 <SelectItem value="deluxe">Deluxe</SelectItem>
//                 <SelectItem value="suite">Suite</SelectItem>
//               </SelectContent>
//             </Select>
//             {errors?.type ? (
//               <InlineAlert type="error">{errors.type.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* Room Code with generate button */}
//           <div className="flex flex-col gap-2 col-span-2">
//             <Label htmlFor="code">Room Code</Label>{" "}
//             <div className="flex gap-2">
//               <Input
//                 id="code"
//                 type="text"
//                 disabled={disabled}
//                 placeholder="Unique Code"
//                 {...register("roomCode", { required: true })}
//               />
//               <button
//                 type="button"
//                 disabled={disabled}
//                 onClick={() =>
//                   setValue(
//                     "roomCode",
//                     Math.random().toString(36).substring(2, 10).toUpperCase()
//                   )
//                 }
//                 className="px-4 py-2 text-sm bg-gray-200 rounded-md"
//               >
//                 Generate
//               </button>
//             </div>
//             {errors?.roomCode ? (
//               <InlineAlert type="error">{errors.roomCode.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* Room Description */}
//           <div className="flex flex-col gap-4 col-span-2">
//             <Label htmlFor="description">Description</Label>
//             <TextEditor
//               content={description_controller.field.value}
//               setContent={(n) => {
//                 description_controller.field.onChange(n);
//               }}
//               disabled={disabled}
//               className="col-span-2 h-[7em] mb-[3em]"
//               placeholder="Description Of The Room"
//             />
//             {errors?.description ? (
//               <InlineAlert type="error">
//                 {errors.description.message}
//               </InlineAlert>
//             ) : null}
//           </div>
//         </CreationFormSectionContent>
//       </CreationFormSection>
//     );
//   }
// );

// export default CreateRoom_MainInformation_Section;