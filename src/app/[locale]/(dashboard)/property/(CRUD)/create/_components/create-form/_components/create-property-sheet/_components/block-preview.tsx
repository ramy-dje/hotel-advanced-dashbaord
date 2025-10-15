import React, { useEffect, useState, useMemo } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { PiElevatorLight, PiStairs } from "react-icons/pi";
import { LiaBedSolid } from "react-icons/lia";
import { useFormContext, useWatch } from "react-hook-form";
import { CreatePropertyInterface, Floor } from "@/interfaces/property.interface";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // Assuming you have toast notifications

interface BlockPreviewProps {
  blockIndex: number;
  // `selectedFloorLevel` can now be a number or a string (e.g., "Ground Floor") or null
  // This is used to highlight the currently edited floor.
  selectedFloorLevel?: number | string | null;
  // `onEditFloor` now explicitly passes the original index and the floor data to the parent.
  onEditFloor: (floorIndex: number, floorData: Floor) => void;
  // `onDeleteFloor` passes the original index to the parent.
  onDeleteFloor: (floorIndex: number) => void;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({
  blockIndex,
  selectedFloorLevel = null, // Default to null if not provided
  onEditFloor,
  onDeleteFloor,
}) => {
  const { control } = useFormContext<CreatePropertyInterface>();

  // Use `useWatch` to watch all floors of this specific block in real time.
  // This ensures `BlockPreview` re-renders whenever floors are added, updated, or deleted.
  const watchedFloors = useWatch<
    CreatePropertyInterface,
    `blocks.${number}.floors`
  >({
    control,
    name: `blocks.${blockIndex}.floors`,
    defaultValue: [], // Provide a default empty array
  });

  useEffect(() => {
    // Optional: Log watched floors for debugging purposes
    console.log(`🧿 Watched floors for block ${blockIndex}:`, watchedFloors);
  }, [watchedFloors, blockIndex]);

  // Memoize the sorted list of floors for display.
  // Sorting is done from lowest level to highest, then reversed to show highest levels first.
  const floorsBottomUp = useMemo(() => {
    return [...watchedFloors].sort((a, b) => {
      // Robust sorting for 'level' which might be number or string.
      // Convert to number for comparison; default to 0 if conversion fails.
      const levelA = typeof a.level === 'string' ? parseInt(a.level, 10) || 0 : a.level;
      const levelB = typeof b.level === 'string' ? parseInt(b.level, 10) || 0 : b.level;
      return levelA - levelB;
    }).reverse(); // Reverse to display highest level at the top
  }, [watchedFloors]);

  return (
    <div className="w-full space-y-4 rounded h-full overflow-y-auto sm-scrollbar">
      <div className="flex flex-col space-y-[16px] w-full p-2">
        {floorsBottomUp.length === 0 ? (
          <div className="text-gray-500 text-center p-4">No floors available</div>
        ) : (
          floorsBottomUp.map((floor) => {
            // Find the *original array index* of this floor within the `watchedFloors` array.
            // This index is crucial for `useFieldArray` operations (`update`, `remove`) in the parent.
            // We use `floor.level` to find the unique floor. Ensure `level` is unique per floor within a block.
            const originalIndex = watchedFloors.findIndex(
              (f) => f.level === floor.level
            );

            // If the floor can't be found (e.g., due to stale data or a very quick delete),
            // skip rendering it and log a warning.
            if (originalIndex === -1) {
                console.warn("Floor not found in original array (skipping render):", floor);
                return null;
            }

            return (
              <FloorCard
                key={floor.level} // Using level as key, assuming it's unique per block
                floor={floor}
                floorIndex={originalIndex} // Pass the original index to FloorCard
                // Determine if this card should be highlighted as selected/being edited
                isSelected={selectedFloorLevel === floor.level}
                onEdit={() => {
                  // When 'Edit' is clicked on a FloorCard, call the parent's `onEditFloor`
                  // with the original index and the complete floor data.
                  onEditFloor(originalIndex, floor);
                }}
                onDelete={() => {
                  // When 'Delete' is clicked, call the parent's `onDeleteFloor` with the original index.
                  onDeleteFloor(originalIndex);
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
export default BlockPreview;

// --- FloorCard Component ---
// This component displays individual floor details and provides action buttons.

interface FloorCardProps {
  floor: Floor;
  floorIndex: number; // The original index of the floor in the array (passed from BlockPreview)
  isSelected: boolean; // Indicates if this floor card should be highlighted
  onEdit: () => void; // Callback for when the edit button is clicked (triggers parent edit)
  onDelete: () => void; // Callback for when the delete button is clicked (triggers parent delete)
}

const FloorCard: React.FC<FloorCardProps> = ({
  floor,
  floorIndex,
  isSelected,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false); // State to control visibility of action buttons

  // Show action buttons on double-click
  const handleDoubleClick = () => {
    setShowActions(true);
  };

  const handleEdit = () => {
    setShowActions(false); // Hide action buttons after click
    onEdit(); // Call the `onEdit` prop, which will trigger the parent's edit handler
  };

  const handleDelete = () => {
    setShowActions(false); // Hide action buttons after click
    // Use `window.confirm` as per your original code. In a production app, use a custom modal.
    if (window.confirm(`Are you sure you want to DELETE floor "${floor.name || floor.level}"?`)) {
      onDelete(); // Call the `onDelete` prop, which will trigger the parent's delete handler
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`w-full border p-2 bg-white shadow select-none
        ${isSelected ? "border-2 border-blue-500" : "border-gray-200"}
        hover:border-blue-300 transition-colors cursor-pointer rounded`}
    >
      {/* Header Section: Floor Name and Level */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-lg">{floor.name || `Floor ${floor.level}`}</span>
          <span className="text-sm text-gray-500 flex items-center">
            <PiStairs className="h-6 w-6" />
            {floor.level}
          </span>
        </div>

        {/* Room, Elevator, and Info Icons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 flex items-center">
            <LiaBedSolid className="h-6 w-6" />
            {floor.rooms?.length || 0}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <PiElevatorLight className="h-6 w-6" />
            {floor.elevators?.length || 0}
          </span>

          {/* Information Tooltip for Extra Areas and Additional Features */}
          <div className="group relative inline-block">
            <IoMdInformationCircleOutline className="h-6 w-6 text-gray-500" />
            <div className="absolute top-full right-0 mb-2 w-56 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 pointer-events-none scale-75 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100">
              <div className="font-semibold mb-1">Extra Areas</div>
              <ul className="list-disc list-inside mb-2 space-y-1">
                {(floor.ExtraAreas || []).map((area, i) => (
                  <li key={i}>{`${area.name}: ${area.usedFor}`}</li>
                ))}
              </ul>
              <div className="font-semibold mb-1">Additional Features</div>
              <ul className="list-disc list-inside space-y-1">
                {(floor.AdditionalFeatures || []).map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Container (Rooms and Facilities grouped by Section) */}
      <div className="flex flex-wrap gap-4 mb-4">
        {(floor.sections || []).map((section) => {
          const sectionRooms =
            floor.rooms?.filter((r) => r.sectionName === section.name) || [];
          const sectionFacilities =
            floor.facilities?.filter((f) => f.sectionName === section.name) ||
            [];

          return (
            <div
              key={section.name} // Assuming section names are unique within a floor
              className="border rounded p-2 bg-gray-50 flex-1 min-w-[200px]"
            >
              <div className="text-sm font-medium text-gray-700 mb-2">
                {section.name} ({section.roomFrom}-{section.roomTo})
              </div>

              {/* Rooms Display */}
              {sectionRooms.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <LiaBedSolid className="w-4 h-4" />
                    Rooms
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sectionRooms.map((room) => (
                      <div
                        key={room.number} // Assuming room numbers are unique within a section/floor
                        className="w-8 h-8 bg-blue-100 text-xs flex items-center justify-center"
                        title={`${section.name} – Room ${room.number}`}
                        draggable
                      >
                        {room.number}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities Display */}
              {sectionFacilities.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <HiOutlineHome className="w-4 h-4" />
                    Facilities
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sectionFacilities.map((facility) => (
                      <div
                        key={facility.name} // Assuming facility names are unique within a section/floor
                        className="w-8 h-8 bg-green-200 text-xs flex items-center justify-center rounded"
                        title={facility.name}
                        draggable
                      >
                        {facility.name[0] || <HiOutlineHome className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Section: Surface Area and Energy Class */}
      <div className="text-sm text-gray-600">
        <div className="mb-1">
          Surface:{" "}
          <strong>
            {floor.surfaceArea}
            {floor.surfaceUnit === "sqm" ? " m²" : " ft²"}
          </strong>{" "}
          • Energy:{" "}
          <strong>{(Array.isArray(floor.energyClass) ? floor.energyClass.join(", ") : floor.energyClass) || 'N/A'}</strong>
        </div>
      </div>
      {/* Action Buttons (Edit/Delete) - Shown on Double Click */}
      {showActions && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
