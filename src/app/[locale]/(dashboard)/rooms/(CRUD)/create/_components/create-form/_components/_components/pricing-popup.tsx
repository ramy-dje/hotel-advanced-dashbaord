"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import MultiSelectChip from "@/components/ui/multi-select-chip";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import PropertyInterface from "@/interfaces/property.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define Row interface for internal component state
// Internally, 'views' will always be an array (even empty).
interface Row {
  id: string; // Unique ID for each row in internal state
  type: string;
  views: string[]; // <--- views is always a string[] for internal state
  smoking: boolean;
  petFriendly: boolean;
  rateCode: string;
}

// Define the type for the data that will be saved/passed to the parent
// This *must* match the structure of your react-hook-form schema for 'roomPricing' items.
// If your Zod schema allows `views` to be optional (e.g., z.array(z.string()).optional()),
// then `SavedPricingRow` MUST also reflect that optionality.
export interface SavedPricingRow {
  type: string;
  views?: string[]; // <--- views is an OPTIONAL string[] for data exchanged with parent/schema
  smoking: boolean;
  petFriendly: boolean;
  rateCode: string;
}

// Ensure the props interface correctly uses the SavedPricingRow type
interface SetPricingPopupProps {
  selectedPropertyDetails: PropertyInterface | null;
  initialPricingData: SavedPricingRow[]; // This prop accepts data with optional views
  onSavePricing: (data: SavedPricingRow[]) => void; // This callback sends data with optional views
}

const SetPricingPopup: React.FC<SetPricingPopupProps> = ({
  selectedPropertyDetails,
  initialPricingData,
  onSavePricing,
}) => {
  const [rows, setRows] = useState<Row[]>([]); // Internal state uses `Row[]`
  const [VIEW_OPTIONS, setVIEW_OPTIONS] = useState<string[]>([]);
  const [ROOM_TYPE_OPTIONS, setROOM_TYPE_OPTIONS] = useState<{ id: string; name: string }[]>([]);
  const [duplicateRowsMessage, setDuplicateRowsMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPropertyDetails) {
      setVIEW_OPTIONS(selectedPropertyDetails.views || []);
      setROOM_TYPE_OPTIONS(
        (selectedPropertyDetails.roomTypes || []).map(rt => ({ id: rt.id, name: rt.typeName })) || []
      );
    }

    if (isOpen && initialPricingData) {
        // Map initialPricingData (which has views?: string[]) to internal Row[] state (views: string[])
        const processedInitialData: Row[] = initialPricingData.map(item => ({
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            views: item.views || [] // Convert undefined/null views to an empty array for internal use
        }));

        // Prevent unnecessary re-initialization
        const currentRowsForComparison = rows.map(({ id, ...rest }) => ({ ...rest, views: rest.views || [] }));
        if (processedInitialData.length > 0 && JSON.stringify(currentRowsForComparison) !== JSON.stringify(processedInitialData)) {
            setRows(processedInitialData);
        } else if (processedInitialData.length === 0 && rows.length > 0) {
            setRows([]);
        }
    } else if (!isOpen) {
        setRows([]); // Clear internal rows when the dialog closes
    }
  }, [selectedPropertyDetails, initialPricingData, isOpen]);


  const updateRow = (id: string, updated: Partial<Row>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updated } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "",
        views: [], // Initialize views as an empty array for new rows
        smoking: false,
        petFriendly: false,
        rateCode: "",
      },
    ]);
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const findDuplicateRows = useMemo(() => {
    const seenCombinations = new Map<string, string[]>();
    const duplicateIds: string[] = [];
    setDuplicateRowsMessage(null);

    rows.forEach((row) => {
      const combination = JSON.stringify({
        type: row.type,
        views: [...row.views].sort(), // Use internal row.views (which is string[])
        smoking: row.smoking,
        petFriendly: row.petFriendly,
        rateCode: row.rateCode,
      });

      if (seenCombinations.has(combination)) {
        duplicateIds.push(row.id, ...seenCombinations.get(combination)!);
        setDuplicateRowsMessage("Identical room configurations found. Please ensure each entry is unique.");
      } else {
        seenCombinations.set(combination, [row.id]);
      }
    });

    return Array.from(new Set(duplicateIds));
  }, [rows]);

  const hasDuplicates = findDuplicateRows.length > 0;

  const handleSave = () => {
    if (!hasDuplicates) {
      // Map internal 'Row[]' (views: string[]) to 'SavedPricingRow[]' (views?: string[]) for output
      const dataToSave: SavedPricingRow[] = rows.map(({ id, ...rest }) => ({
        ...rest,
        // If views is an empty array, convert it to undefined for the schema if it allows optional
        // Otherwise, if your schema requires `string[]` even for empty, just use `rest.views`
        views: rest.views.length > 0 ? rest.views : undefined
      }));
      onSavePricing(dataToSave);
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setRows([]);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
         <DialogTrigger asChild>
                <Button className="gap-2 font-normal w-1/2 md:w-auto">
                  <HiOutlinePlus className="size-4" /> Set Room Pricing
                </Button>
              </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Set Room Details & Pricing</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Configure views, smoking, pets and rate codes for each room type. Add multiple entries for different variations.
          </p>
        </DialogHeader>

        {duplicateRowsMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Warning! </strong>
            <span className="block sm:inline">{duplicateRowsMessage}</span>
          </div>
        )}

        <table className="w-full table-auto border-collapse mt-4">
          <colgroup>
            <col className="w-1/6" />
            <col className="w-2/6" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/6" />
            <col className="w-1/12" />
          </colgroup>
          <thead>
            <tr>
              <th className="border p-2 text-left">Room Type</th>
              <th className="border p-2 text-left">Views</th>
              <th className="border p-2 text-center">Smoking</th>
              <th className="border p-2 text-center">Pet Friendly</th>
              <th className="border p-2 text-left">Rate Code</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`${findDuplicateRows.includes(row.id) ? 'bg-red-200' : 'even:bg-gray-50'}`}
              >
                <td className="border p-2">
                  <Select
                    value={row.type}
                    onValueChange={(value) => updateRow(row.id, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border p-2">
                  <MultiSelectChip
                    selected={row.views}
                    options={VIEW_OPTIONS}
                    onChange={(newViews) => updateRow(row.id, { views: newViews })}
                    placeholder="Select views"
                  />
                </td>
                <td className="border p-2 text-center">
                  <Switch
                    checked={row.smoking}
                    onCheckedChange={(val) => updateRow(row.id, { smoking: val })}
                  />
                </td>
                <td className="border p-2 text-center">
                  <Switch
                    checked={row.petFriendly}
                    onCheckedChange={(val) => updateRow(row.id, { petFriendly: val })}
                  />
                </td>
                <td className="border p-2">
                  <Input
                    type="text"
                    value={row.rateCode}
                    onChange={(e) => updateRow(row.id, { rateCode: e.target.value })}
                    placeholder="Enter rate code"
                  />
                </td>
                <td className="border p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <HiOutlineTrash className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <Button variant="outline" onClick={addRow} className="gap-2">
            <HiOutlinePlus className="size-4" /> Add Row
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="ml-2"
            onClick={handleSave}
            disabled={hasDuplicates}
          >
            Save Room Pricing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetPricingPopup;

















// // pricing-popup.tsx

// import React, { useState, useEffect, useMemo } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
// import MultiSelectChip from "@/components/ui/multi-select-chip";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
// import PropertyInterface from "@/interfaces/property.interface";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // Define Row interface here as it's internal to this component's state management
// interface Row {
//   id: string; // Unique ID for each row to help with adding/removing
//   type: string;
//   views: string[]; // <-- Ensure this is always an array, even if empty
//   smoking: boolean;
//   petFriendly: boolean;
//   rateCode: string;
// }

// // Define the type for the data that will be saved/passed to the parent
// // SavedPricingRow should now reflect that `views` is always an array.
// // If your schema allows `views` to be optional (e.g., `z.array(z.string()).optional()`),
// // then it's better for SavedPricingRow to also reflect that:
// type SavedPricingRow = Omit<Row, 'id'>; // This is correct if Row's `views` is `string[]`

// // If `views` in your Zod schema for `roomPricing` is `z.array(z.string()).optional()`,
// // then your SavedPricingRow *must* also allow `views` to be undefined.
// // In that case, you'd change the Row interface:
// // interface Row {
// //   // ... other properties ...
// //   views?: string[]; // Make it explicitly optional
// // }
// // And then SavedPricingRow would naturally inherit this `views?: string[]`.
// // However, MultiSelectChip often returns `[]` for no selection, so `string[]` is often fine.

// interface SetPricingPopupProps {
//   selectedPropertyDetails: PropertyInterface | null;
//   initialPricingData: SavedPricingRow[]; // Data from form context
//   onSavePricing: (data: SavedPricingRow[]) => void; // Callback to save data to form context
// }

// const SetPricingPopup: React.FC<SetPricingPopupProps> = ({
//   selectedPropertyDetails,
//   initialPricingData,
//   onSavePricing,
// }) => {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [VIEW_OPTIONS, setVIEW_OPTIONS] = useState<string[]>([]);
//   const [ROOM_TYPE_OPTIONS, setROOM_TYPE_OPTIONS] = useState<{ id: string; name: string }[]>([]);
//   const [duplicateRowsMessage, setDuplicateRowsMessage] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (selectedPropertyDetails) {
//       setVIEW_OPTIONS(selectedPropertyDetails.views || []);
//       setROOM_TYPE_OPTIONS(
//         (selectedPropertyDetails.roomTypes || []).map(rt => ({ id: rt.id, name: rt.typeName })) || []
//       );
//     }

//     if (isOpen && initialPricingData) {
//         // Ensure initialPricingData's views are always arrays, even if they were undefined from schema/backend
//         const processedInitialData = initialPricingData.map(item => ({
//             ...item,
//             views: item.views || [], // Crucial: Convert undefined views to empty array
//             id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
//         }));

//         // Prevent unnecessary re-initialization if data is effectively the same
//         const currentRowsForComparison = rows.map(({ id, ...rest }) => ({ ...rest, views: rest.views || [] }));
//         if (processedInitialData.length > 0 && JSON.stringify(currentRowsForComparison) !== JSON.stringify(processedInitialData)) {
//             setRows(processedInitialData);
//         } else if (processedInitialData.length === 0 && rows.length > 0) {
//             setRows([]); // Clear if initial data is empty but rows exist
//         }
//     } else if (!isOpen) {
//         setRows([]); // Clear internal rows when the dialog closes
//     }
//   }, [selectedPropertyDetails, initialPricingData, isOpen]);


//   const updateRow = (id: string, updated: Partial<Row>) => {
//     setRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, ...updated } : row))
//     );
//   };

//   const addRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         type: "",
//         views: [], // Initialize views as an empty array
//         smoking: false,
//         petFriendly: false,
//         rateCode: "",
//       },
//     ]);
//   };

//   const deleteRow = (id: string) => {
//     setRows((prev) => prev.filter((row) => row.id !== id));
//   };

//   const findDuplicateRows = useMemo(() => {
//     const seenCombinations = new Map<string, string[]>();
//     const duplicateIds: string[] = [];
//     setDuplicateRowsMessage(null);

//     rows.forEach((row) => {
//       const combination = JSON.stringify({
//         type: row.type,
//         views: [...row.views].sort(),
//         smoking: row.smoking,
//         petFriendly: row.petFriendly,
//         rateCode: row.rateCode,
//       });

//       if (seenCombinations.has(combination)) {
//         duplicateIds.push(row.id, ...seenCombinations.get(combination)!);
//         setDuplicateRowsMessage("Identical room configurations found. Please ensure each entry is unique.");
//       } else {
//         seenCombinations.set(combination, [row.id]);
//       }
//     });

//     return Array.from(new Set(duplicateIds));
//   }, [rows]);

//   const hasDuplicates = findDuplicateRows.length > 0;

//   const handleSave = () => {
//     if (!hasDuplicates) {
//       const dataToSave: SavedPricingRow[] = rows.map(({ id, ...rest }) => rest);
//       onSavePricing(dataToSave);
//       setIsOpen(false);
//     }
//   };

//   const handleOpenChange = (open: boolean) => {
//     setIsOpen(open);
//     if (!open) {
//       setRows([]);
//     }
//   };

//   return (
//     <Dialog onOpenChange={handleOpenChange} open={isOpen}>
//          <DialogTrigger asChild>
//                 <Button className="gap-2 font-normal w-1/2 md:w-auto">
//                   <HiOutlinePlus className="size-4" /> Set Room Pricing
//                 </Button>
//               </DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Set Room Details & Pricing</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             Configure views, smoking, pets and rate codes for each room type. Add multiple entries for different variations.
//           </p>
//         </DialogHeader>

//         {duplicateRowsMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Warning! </strong>
//             <span className="block sm:inline">{duplicateRowsMessage}</span>
//           </div>
//         )}

//         <table className="w-full table-auto border-collapse mt-4">
//           <colgroup>
//             <col className="w-1/6" />
//             <col className="w-2/6" />
//             <col className="w-1/12" />
//             <col className="w-1/12" />
//             <col className="w-1/6" />
//             <col className="w-1/12" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th className="border p-2 text-left">Room Type</th>
//               <th className="border p-2 text-left">Views</th>
//               <th className="border p-2 text-center">Smoking</th>
//               <th className="border p-2 text-center">Pet Friendly</th>
//               <th className="border p-2 text-left">Rate Code</th>
//               <th className="border p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className={`${findDuplicateRows.includes(row.id) ? 'bg-red-200' : 'even:bg-gray-50'}`}
//               >
//                 <td className="border p-2">
//                   <Select
//                     value={row.type}
//                     onValueChange={(value) => updateRow(row.id, { type: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {ROOM_TYPE_OPTIONS.map((option) => (
//                         <SelectItem key={option.id} value={option.name}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </td>
//                 <td className="border p-2">
//                   <MultiSelectChip
//                     selected={row.views}
//                     options={VIEW_OPTIONS}
//                     onChange={(newViews) => updateRow(row.id, { views: newViews })}
//                     placeholder="Select views"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.smoking}
//                     onCheckedChange={(val) => updateRow(row.id, { smoking: val })}
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.petFriendly}
//                     onCheckedChange={(val) => updateRow(row.id, { petFriendly: val })}
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <Input
//                     type="text"
//                     value={row.rateCode}
//                     onChange={(e) => updateRow(row.id, { rateCode: e.target.value })}
//                     placeholder="Enter rate code"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteRow(row.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <HiOutlineTrash className="size-4" />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="mt-4">
//           <Button variant="outline" onClick={addRow} className="gap-2">
//             <HiOutlinePlus className="size-4" /> Add Row
//           </Button>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button
//             className="ml-2"
//             onClick={handleSave}
//             disabled={hasDuplicates}
//           >
//             Save Room Pricing
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SetPricingPopup;

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
// import MultiSelectChip from "@/components/ui/multi-select-chip";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi"; // Assuming react-icons is resolved
// import PropertyInterface from "@/interfaces/property.interface";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // Define Row interface here as it's internal to this component's state management
// interface Row {
//   id: string; // Unique ID for each row to help with adding/removing
//   type: string;
//   views: string[];
//   smoking: boolean;
//   petFriendly: boolean;
//   rateCode: string;
// }

// // Define the type for the data that will be saved/passed to the parent
// type SavedPricingRow = Omit<Row, 'id'>;

// interface SetPricingPopupProps {
//   selectedPropertyDetails: PropertyInterface | null;
//   initialPricingData: SavedPricingRow[]; // Data from form context
//   onSavePricing: (data: SavedPricingRow[]) => void; // Callback to save data to form context
// }

// const SetPricingPopup: React.FC<SetPricingPopupProps> = ({
//   selectedPropertyDetails,
//   initialPricingData,
//   onSavePricing,
// }) => {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [VIEW_OPTIONS, setVIEW_OPTIONS] = useState<string[]>([]);
//   const [ROOM_TYPE_OPTIONS, setROOM_TYPE_OPTIONS] = useState<{ id: string; name: string }[]>([]);
//   const [duplicateRowsMessage, setDuplicateRowsMessage] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false); // State to control dialog open/close

//   // Effect to initialize options and rows when selectedPropertyDetails or initialPricingData changes
//   useEffect(() => {
//     if (selectedPropertyDetails) {
//       setVIEW_OPTIONS(selectedPropertyDetails.views || []);
//       setROOM_TYPE_OPTIONS(
//         (selectedPropertyDetails.roomTypes || []).map(rt => ({ id: rt.id, name: rt.typeName })) || []
//       );
//     }

//     // Initialize rows from initialPricingData when the dialog opens or initial data changes
//     // Only set if the dialog is opening or if the initial data has changed significantly
//     if (isOpen && initialPricingData && initialPricingData.length > 0) {
//         // Simple check to avoid re-initializing if data is already present and seemingly the same
//         if (rows.length === 0 || JSON.stringify(rows.map(({id, ...rest}) => rest)) !== JSON.stringify(initialPricingData)) {
//             setRows(initialPricingData.map(item => ({ ...item, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) })));
//         }
//     } else if (isOpen && initialPricingData && initialPricingData.length === 0 && rows.length > 0) {
//         // If initial data is empty but internal rows exist, clear them when opening
//         setRows([]);
//     } else if (!isOpen && rows.length > 0) {
//         // When closing, clear internal rows to ensure fresh load next time
//         // This prevents old data from appearing if the popup is opened again without saving changes
//         setRows([]);
//     }
//   }, [selectedPropertyDetails, initialPricingData, isOpen]);


//   const updateRow = (id: string, updated: Partial<Row>) => {
//     setRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, ...updated } : row))
//     );
//   };

//   const addRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(), // Generate a unique ID for the new row
//         type: "",
//         views: [],
//         smoking: false,
//         petFriendly: false,
//         rateCode: "",
//       },
//     ]);
//   };

//   const deleteRow = (id: string) => {
//     setRows((prev) => prev.filter((row) => row.id !== id));
//   };

//   // --- Duplicate Checking Logic ---
//   const findDuplicateRows = useMemo(() => {
//     const seenCombinations = new Map<string, string[]>(); // Key: stringified combination, Value: array of row IDs
//     const duplicateIds: string[] = [];
//     setDuplicateRowsMessage(null); // Clear previous message

//     rows.forEach((row) => {
//       // Create a unique string representation of the core identifying fields
//       // Ensure views are sorted for consistent comparison
//       const combination = JSON.stringify({
//         type: row.type,
//         views: [...row.views].sort(), // Sort views for consistent comparison
//         smoking: row.smoking,
//         petFriendly: row.petFriendly,
//         rateCode: row.rateCode,
//       });

//       if (seenCombinations.has(combination)) {
//         duplicateIds.push(row.id, ...seenCombinations.get(combination)!);
//         setDuplicateRowsMessage("Identical room configurations found. Please ensure each entry is unique.");
//       } else {
//         seenCombinations.set(combination, [row.id]);
//       }
//     });

//     // Remove duplicates from the duplicateIds array
//     return Array.from(new Set(duplicateIds));
//   }, [rows]); // Recalculate whenever 'rows' changes

//   const hasDuplicates = findDuplicateRows.length > 0;
//   // --- End Duplicate Checking Logic ---

//   const handleSave = () => {
//     if (!hasDuplicates) {
//       const dataToSave: SavedPricingRow[] = rows.map(({ id, ...rest }) => rest); // Remove internal `id` before saving
//       // console.log("Calling onSavePricing with data:", dataToSave); // Debugging line
//       onSavePricing(dataToSave); // This is where the error occurs if onSavePricing is undefined
//       setIsOpen(false); // Close the dialog on successful save
//     }
//   };

//   const handleOpenChange = (open: boolean) => {
//     setIsOpen(open);
//     // When dialog closes, if it wasn't saved (e.g., user clicked outside),
//     // and there are no duplicates, you might want to revert internal state
//     // to initialPricingData. However, if 'initialPricingData' is not always
//     // the source of truth, just clearing 'rows' on close (as currently implemented)
//     // prepares for a fresh start next time the dialog opens.
//     if (!open) {
//       setRows([]); // Clear internal rows when the dialog closes
//     }
//   };


//   return (
//     <Dialog onOpenChange={handleOpenChange} open={isOpen}>
//          <DialogTrigger asChild>
//                 <Button className="gap-2 font-normal w-1/2 md:w-auto">
//                   <HiOutlinePlus className="size-4" /> Set Room Pricing
//                 </Button>
//               </DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Set Room Details & Pricing</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             Configure views, smoking, pets and rate codes for each room type. Add multiple entries for different variations.
//           </p>
//         </DialogHeader>

//         {duplicateRowsMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Warning! </strong>
//             <span className="block sm:inline">{duplicateRowsMessage}</span>
//           </div>
//         )}

//         <table className="w-full table-auto border-collapse mt-4">
//           <colgroup>
//             <col className="w-1/6" />
//             <col className="w-2/6" />
//             <col className="w-1/12" />
//             <col className="w-1/12" />
//             <col className="w-1/6" />
//             <col className="w-1/12" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th className="border p-2 text-left">Room Type</th>
//               <th className="border p-2 text-left">Views</th>
//               <th className="border p-2 text-center">Smoking</th>
//               <th className="border p-2 text-center">Pet Friendly</th>
//               <th className="border p-2 text-left">Rate Code</th>
//               <th className="border p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className={`${findDuplicateRows.includes(row.id) ? 'bg-red-200' : 'even:bg-gray-50'}`}
//               >
//                 <td className="border p-2">
//                   <Select
//                     value={row.type}
//                     onValueChange={(value) => updateRow(row.id, { type: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {ROOM_TYPE_OPTIONS.map((option) => (
//                         <SelectItem key={option.id} value={option.name}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </td>
//                 <td className="border p-2">
//                   <MultiSelectChip
//                     selected={row.views}
//                     options={VIEW_OPTIONS}
//                     onChange={(newViews) => updateRow(row.id, { views: newViews })}
//                     placeholder="Select views"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.smoking}
//                     onCheckedChange={(val) => updateRow(row.id, { smoking: val })}
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.petFriendly}
//                     onCheckedChange={(val) => updateRow(row.id, { petFriendly: val })}
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <Input
//                     type="text"
//                     value={row.rateCode}
//                     onChange={(e) => updateRow(row.id, { rateCode: e.target.value })}
//                     placeholder="Enter rate code"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteRow(row.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <HiOutlineTrash className="size-4" />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="mt-4">
//           <Button variant="outline" onClick={addRow} className="gap-2">
//             <HiOutlinePlus className="size-4" /> Add Row
//           </Button>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button
//             className="ml-2"
//             onClick={handleSave}
//             disabled={hasDuplicates}
//           >
//             Save Room Pricing
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SetPricingPopup;




// // Assuming this is in SetPricingPopup.tsx or similar file
// import React, { useState, useEffect, useMemo } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
// import MultiSelectChip from "@/components/ui/multi-select-chip";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
// import PropertyInterface from "@/interfaces/property.interface";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // Define Row interface here as it's internal to this component's state management
// interface Row {
//   id: string; // Unique ID for each row to help with adding/removing
//   type: string;
//   views: string[];
//   smoking: boolean;
//   petFriendly: boolean;
//   rateCode: string;
// }

// // Define the type for the data that will be saved/passed to the parent
// type SavedPricingRow = Omit<Row, 'id'>;

// interface SetPricingPopupProps {
//   selectedPropertyDetails: PropertyInterface | null;
//   initialPricingData: SavedPricingRow[]; // Data from form context
//   onSavePricing: (data: SavedPricingRow[]) => void; // Callback to save data to form context
// }

// const SetPricingPopup: React.FC<SetPricingPopupProps> = ({
//   selectedPropertyDetails,
//   initialPricingData,
//   onSavePricing,
// }) => {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [VIEW_OPTIONS, setVIEW_OPTIONS] = useState<string[]>([]);
//   const [ROOM_TYPE_OPTIONS, setROOM_TYPE_OPTIONS] = useState<{ id: string; name: string }[]>([]);
//   const [duplicateRowsMessage, setDuplicateRowsMessage] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false); // State to control dialog open/close

//   // Effect to initialize options and rows when selectedPropertyDetails or initialPricingData changes
//   useEffect(() => {
//     if (selectedPropertyDetails) {
//       setVIEW_OPTIONS(selectedPropertyDetails.views || []);
//       setROOM_TYPE_OPTIONS(
//         (selectedPropertyDetails.roomTypes || []).map(rt => ({ id: rt.id, name: rt.typeName })) || []
//       );
//     }

//     // Initialize rows from initialPricingData when the dialog opens or initial data changes
//     // Only set if the dialog is opening or if the initial data has changed significantly
//     if (isOpen && initialPricingData && initialPricingData.length > 0) {
//         // Simple check to avoid re-initializing if data is already present and seemingly the same
//         if (rows.length === 0 || JSON.stringify(rows.map(({id, ...rest}) => rest)) !== JSON.stringify(initialPricingData)) {
//             setRows(initialPricingData.map(item => ({ ...item, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) })));
//         }
//     } else if (isOpen && initialPricingData && initialPricingData.length === 0 && rows.length > 0) {
//         // If initial data is empty but internal rows exist, clear them when opening
//         setRows([]);
//     } else if (!isOpen && rows.length > 0) {
//         // When closing, clear internal rows to ensure fresh load next time
//         setRows([]);
//     }
//   }, [selectedPropertyDetails, initialPricingData, isOpen]);


//   const updateRow = (id: string, updated: Partial<Row>) => {
//     setRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, ...updated } : row))
//     );
//   };

//   const addRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(), // Generate a unique ID for the new row
//         type: "",
//         views: [],
//         smoking: false,
//         petFriendly: false,
//         rateCode: "",
//       },
//     ]);
//   };

//   const deleteRow = (id: string) => {
//     setRows((prev) => prev.filter((row) => row.id !== id));
//   };

//   // --- Duplicate Checking Logic ---
//   const findDuplicateRows = useMemo(() => {
//     const seenCombinations = new Map<string, string[]>(); // Key: stringified combination, Value: array of row IDs
//     const duplicateIds: string[] = [];
//     setDuplicateRowsMessage(null); // Clear previous message

//     rows.forEach((row) => {
//       // Create a unique string representation of the core identifying fields
//       // Ensure views are sorted for consistent comparison
//       const combination = JSON.stringify({
//         type: row.type,
//         views: [...row.views].sort(), // Sort views for consistent comparison
//         smoking: row.smoking,
//         petFriendly: row.petFriendly,
//         rateCode: row.rateCode,
//       });

//       if (seenCombinations.has(combination)) {
//         duplicateIds.push(row.id, ...seenCombinations.get(combination)!);
//         setDuplicateRowsMessage("Identical room configurations found. Please ensure each entry is unique.");
//       } else {
//         seenCombinations.set(combination, [row.id]);
//       }
//     });

//     // Remove duplicates from the duplicateIds array
//     return Array.from(new Set(duplicateIds));
//   }, [rows]); // Recalculate whenever 'rows' changes

//   const hasDuplicates = findDuplicateRows.length > 0;
//   // --- End Duplicate Checking Logic ---

//   const handleSave = () => {
//     if (!hasDuplicates) {
//       const dataToSave: SavedPricingRow[] = rows.map(({ id, ...rest }) => rest); // Remove internal `id` before saving
//       onSavePricing(dataToSave);
//       setIsOpen(false); // Close the dialog on successful save
//     }
//   };

//   const handleOpenChange = (open: boolean) => {
//     setIsOpen(open);
//     if (!open && !hasDuplicates) { // When dialog closes without saving (e.g., by clicking outside),
//                                    // and there are no duplicates, reset internal rows
//         // If you want to revert changes on close, you can load initialPricingData here
//         // setRows(initialPricingData.map(item => ({ ...item, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) })));
//     }
//     // If you want to always clear internal state on close, regardless of duplicates:
//     // if (!open) {
//     //   setRows([]);
//     // }
//   };


//   return (
//     <Dialog onOpenChange={handleOpenChange} open={isOpen}>
//          <DialogTrigger asChild>
//                 <Button className="gap-2 font-normal w-1/2 md:w-auto">
//                   <HiOutlinePlus className="size-4" /> Set Room Pricing
//                 </Button>
//               </DialogTrigger>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Set Room Details & Pricing</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             Configure views, smoking, pets and rate codes for each room type. Add multiple entries for different variations.
//           </p>
//         </DialogHeader>

//         {duplicateRowsMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Warning! </strong>
//             <span className="block sm:inline">{duplicateRowsMessage}</span>
//           </div>
//         )}

//         <table className="w-full table-auto border-collapse mt-4">
//           <colgroup>
//             <col className="w-1/6" />
//             <col className="w-2/6" />
//             <col className="w-1/12" />
//             <col className="w-1/12" />
//             <col className="w-1/6" />
//             <col className="w-1/12" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th className="border p-2 text-left">Room Type</th>
//               <th className="border p-2 text-left">Views</th>
//               <th className="border p-2 text-center">Smoking</th>
//               <th className="border p-2 text-center">Pet Friendly</th>
//               <th className="border p-2 text-left">Rate Code</th>
//               <th className="border p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className={`${findDuplicateRows.includes(row.id) ? 'bg-red-200' : 'even:bg-gray-50'}`}
//               >
//                 <td className="border p-2">
//                   <Select
//                     value={row.type}
//                     onValueChange={(value) => updateRow(row.id, { type: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {ROOM_TYPE_OPTIONS.map((option) => (
//                         <SelectItem key={option.id} value={option.name}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </td>
//                 <td className="border p-2">
//                   <MultiSelectChip
//                     selected={row.views}
//                     options={VIEW_OPTIONS}
//                     onChange={(newViews) => updateRow(row.id, { views: newViews })}
//                     placeholder="Select views"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.smoking}
//                     onCheckedChange={(val) => updateRow(row.id, { smoking: val })}
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.petFriendly}
//                     onCheckedChange={(val) => updateRow(row.id, { petFriendly: val })}
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <Input
//                     type="text"
//                     value={row.rateCode}
//                     onChange={(e) => updateRow(row.id, { rateCode: e.target.value })}
//                     placeholder="Enter rate code"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteRow(row.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <HiOutlineTrash className="size-4" />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="mt-4">
//           <Button variant="outline" onClick={addRow} className="gap-2">
//             <HiOutlinePlus className="size-4" /> Add Row
//           </Button>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button
//             className="ml-2"
//             onClick={handleSave}
//             disabled={hasDuplicates}
//           >
//             Save Room Pricing
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SetPricingPopup;


// import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
// import MultiSelectChip from "@/components/ui/multi-select-chip";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
// import PropertyInterface from "@/interfaces/property.interface";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface Row {
//   id: string;
//   type: string;
//   views: string[];
//   smoking: boolean;
//   petFriendly: boolean;
//   rateCode: string;
// }

// interface SetPricingPopupProps {
//   selectedPropertyDetails: PropertyInterface | null;
// }

// const SetPricingPopup: React.FC<SetPricingPopupProps> = ({ selectedPropertyDetails }) => {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [VIEW_OPTIONS, setVIEW_OPTIONS] = useState<string[]>([]);
//   const [ROOM_TYPE_OPTIONS, setROOM_TYPE_OPTIONS] = useState<{ id: string; name: string }[]>([]);
//   const [duplicateRowsMessage, setDuplicateRowsMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (selectedPropertyDetails) {
//       setVIEW_OPTIONS(selectedPropertyDetails.views || []);
//       setROOM_TYPE_OPTIONS(
//         (selectedPropertyDetails.roomTypes || []).map(rt => ({ id: rt.id, name: rt.typeName })) || []
//       );

//       if ((selectedPropertyDetails.roomTypes || []).length > 0 && rows.length === 0) {
//         setRows([
//           {
//             id: Date.now().toString(),
//             type: "",
//             views: [],
//             smoking: false,
//             petFriendly: false,
//             rateCode: "",
//           },
//         ]);
//       }
//     }
//   }, [selectedPropertyDetails]);

//   const updateRow = (id: string, updated: Partial<Row>) => {
//     setRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, ...updated } : row))
//     );
//   };

//   const addRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         type: "",
//         views: [],
//         smoking: false,
//         petFriendly: false,
//         rateCode: "",
//       },
//     ]);
//   };

//   const deleteRow = (id: string) => {
//     setRows((prev) => prev.filter((row) => row.id !== id));
//   };

//   // --- Duplicate Checking Logic ---
//   const findDuplicateRows = useMemo(() => {
//     const seenCombinations = new Map<string, string[]>(); // Key: stringified combination, Value: array of row IDs
//     const duplicateIds: string[] = [];
//     setDuplicateRowsMessage(null); // Clear previous message

//     rows.forEach((row) => {
//       // Create a unique string representation of the core identifying fields
//       // Ensure views are sorted for consistent comparison
//       const combination = JSON.stringify({
//         type: row.type,
//         views: [...row.views].sort(), // Sort views for consistent comparison
//         smoking: row.smoking,
//         petFriendly: row.petFriendly,
//         rateCode: row.rateCode,
//       });

//       if (seenCombinations.has(combination)) {
//         duplicateIds.push(row.id, ...seenCombinations.get(combination)!);
//         setDuplicateRowsMessage("Identical room configurations found. Please ensure each entry is unique.");
//       } else {
//         seenCombinations.set(combination, [row.id]);
//       }
//     });

//     // Remove duplicates from the duplicateIds array
//     return Array.from(new Set(duplicateIds));
//   }, [rows]); // Recalculate whenever 'rows' changes

//   const hasDuplicates = findDuplicateRows.length > 0;
//   // --- End Duplicate Checking Logic ---

//   return (
//     <Dialog>
//          <DialogTrigger asChild>
//                 <Button className="gap-2 font-normal w-1/2 md:w-auto">
//                   <HiOutlinePlus className="size-4" /> Set Room Pricing
//                 </Button>
//               </DialogTrigger>
//       <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Set Room Details & Pricing</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             Configure views, smoking, pets and rate codes for each room type. Add multiple entries for different variations.
//           </p>
//         </DialogHeader>

//         {duplicateRowsMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Warning! </strong>
//             <span className="block sm:inline">{duplicateRowsMessage}</span>
//           </div>
//         )}

//         <table className="w-full table-auto border-collapse mt-4">
//           <colgroup>
//             <col className="w-1/6" />
//             <col className="w-2/6" />
//             <col className="w-1/12" />
//             <col className="w-1/12" />
//             <col className="w-1/6" />
//             <col className="w-1/12" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th className="border p-2 text-left">Room Type</th>
//               <th className="border p-2 text-left">Views</th>
//               <th className="border p-2 text-center">Smoking</th>
//               <th className="border p-2 text-center">Pet Friendly</th>
//               <th className="border p-2 text-left">Rate Code</th>
//               <th className="border p-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className={`${findDuplicateRows.includes(row.id) ? 'bg-red-200' : 'even:bg-gray-50'}`}
//               >
//                 <td className="border p-2">
//                   <Select
//                     value={row.type}
//                     onValueChange={(value) => updateRow(row.id, { type: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {ROOM_TYPE_OPTIONS.map((option) => (
//                         <SelectItem key={option.id} value={option.name}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </td>
//                 <td className="border p-2">
//                   <MultiSelectChip
//                     selected={row.views}
//                     options={VIEW_OPTIONS}
//                     onChange={(newViews) => updateRow(row.id, { views: newViews })}
//                     placeholder="Select views"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.smoking}
//                     onCheckedChange={(val) => updateRow(row.id, { smoking: val })}
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Switch
//                     checked={row.petFriendly}
//                     onCheckedChange={(val) => updateRow(row.id, { petFriendly: val })}
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <Input
//                     type="text"
//                     value={row.rateCode}
//                     onChange={(e) => updateRow(row.id, { rateCode: e.target.value })}
//                     placeholder="Enter rate code"
//                   />
//                 </td>
//                 <td className="border p-2 text-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteRow(row.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <HiOutlineTrash className="size-4" />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="mt-4">
//           <Button variant="outline" onClick={addRow} className="gap-2">
//             <HiOutlinePlus className="size-4" /> Add Row
//           </Button>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button
//             className="ml-2"
//             onClick={() => console.log('Save', rows)}
//             disabled={hasDuplicates} // Disable save button if duplicates exist
//           >
//             Save Room Pricing
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SetPricingPopup;
