// components/ui/multi-select-tags.tsx
"use client";

import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"; // Assumes your Select is in components/ui/select.tsx

// --- Component Props Interface ---
interface MultiSelectTagsProps {
  /** The currently selected values. */
  selected: string[];
  /** Callback function to update the selected values. */
  onChange: (values: string[]) => void;
  /** A list of all possible options. */
  options?: string[];
  /** Placeholder text for the select input. */
  placeholder?: string;
}

// --- Default Options ---
const defaultTagOptions = [
  "React",
  "TypeScript",
  "Next.js",
  "JavaScript",
  "Node.js",
  "Tailwind CSS",
];

/**
 * A multi-select component that displays selections as tags (chips)
 * and uses a custom Select component for adding new items.
 */
function MultiSelectTags({
  selected,
  onChange,
  options = defaultTagOptions,
  placeholder = "Select a tag",
}: MultiSelectTagsProps) {
  /**
   * Toggles the selection state of a given value.
   * Adds the value if it's not selected, or removes it if it is.
   * @param val - The value to toggle.
   */
  const toggleTag = (val: string) => {
    if (val) { // Ensure a value was actually selected
      if (selected.includes(val)) {
        onChange(selected.filter((v) => v !== val));
      } else {
        onChange([...selected, val]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* --- Display selected tags --- */}
      <div className="flex gap-2 flex-wrap">
        {selected.map((item) => (
          <div
            key={item}
            className="flex items-center bg-muted rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span>{item}</span>
            <button
              type="button"
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => toggleTag(item)}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        ))}
      </div>

      {/* --- Custom Select for adding new tags --- */}
      {/* The fix is here: `value=""` forces the component to always show the placeholder */}
      <Select value="" onValueChange={toggleTag}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((option) => !selected.includes(option))
            .map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default MultiSelectTags;





// // components/ui/multi-select-chip.tsx
// import { X } from "lucide-react";
// import { useState } from "react";

// interface MultiSelectChipProps {
//   selected: string[];
//   onChange: (val: string[]) => void;
//   options?: string[]; // now customizable, defaults to viewOptions
//   placeholder?: string;
// }

// const defaultViewOptions = ["Ocean", "Garden", "City", "Mountain", "Pool"];

// function MultiSelectChip({
//   selected,
//   onChange,
//   options = defaultViewOptions,
//   placeholder = "Select a view",
// }: MultiSelectChipProps) {
//   const toggleOption = (val: string) => {
//     if (selected.includes(val)) {
//       onChange(selected.filter((v) => v !== val));
//     } else {
//       onChange([...selected, val]);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex gap-2 flex-wrap">
//         {selected.map((item) => (
//           <div
//             key={item}
//             className="flex items-center bg-muted rounded-full px-3 py-1 text-sm"
//           >
//             {item}
//             <button
//               type="button"
//               className="ml-2 text-muted-foreground"
//               onClick={() => toggleOption(item)}
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>

//       <select
//         onChange={(e) => {
//           const value = e.target.value;
//           if (value) toggleOption(value);
//           e.target.value = "";
//         }}
//         className="border rounded px-2 py-1 text-sm"
//       >
//         <option value="">{placeholder}</option>
//         {options
//           .filter((v) => !selected.includes(v))
//           .map((val) => (
//             <option key={val} value={val}>
//               {val}
//             </option>
//           ))}
//       </select>
//     </div>
//   );
// }


// export default MultiSelectChip;