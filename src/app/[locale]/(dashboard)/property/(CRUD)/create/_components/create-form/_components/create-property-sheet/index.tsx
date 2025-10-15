"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FormProvider, useFormContext, useWatch, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Skeleton } from "@/components/ui/skeleton";
import BlockPreview from "./_components/block-preview";
import CreateBlockForm from "./_components/create-form";
import CreateFloorsGeneralData from "./_components/general-data";

import { CreatePropertyInterface, Floor } from "@/interfaces/property.interface";
import useAccess from "@/hooks/use-access"; // Assuming your permissions hook

interface Props {
  open: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  blockIndex: number;
  hasRooms?: boolean;
  hasFacilities?: boolean;
}

export default function CreateReservationPage({
  setOpen,
  setIsLoading,
  blockIndex,
}: Props) {
  const {
    control,
    getValues,
    setValue,
  } = useFormContext<CreatePropertyInterface>();
  const methods = useForm<Floor>({
    defaultValues: {
      name: "",
      level: 0,
      hasRooms: true, // Default values for new floors
      side: "E",
      rooms: [],
      roomFrom: 0,
      roomTo: 0,
      energyClass: [], // Assuming energyClass is an array of strings
      sections: [],
      hasFacilities: true,
      facilities: [],
      elevators: [],
      surfaceArea: 0,
      surfaceUnit: "sqm",
      AdditionalFeatures: [],
      ExtraAreas: []
    },
  });

  const { has } = useAccess();
  const watchedLevel = useWatch({
    control: methods.control,
    name: "level" as const, 
  });

  const [currentFloorOriginalIndex, setCurrentFloorOriginalIndex] = useState<number | null>(null);

  const watchedMethodsFormValues = methods.watch();

  const watchedHasFacilities = useWatch<
    CreatePropertyInterface,
    `blocks.${number}.hasFacilities`
  >({
    control,
    name: `blocks.${blockIndex}.hasFacilities`,
    defaultValue: false,
  });
  const watchedHasRooms = useWatch<
    CreatePropertyInterface,
    `blocks.${number}.hasRooms`
  >({
    control,
    name: `blocks.${blockIndex}.hasRooms`,
    defaultValue: false,
  });

  const { append, update, remove: removeFloorArray } = useFieldArray({
    control, 
    name: `blocks.${blockIndex}.floors`, 
  });
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const handleSaveFloor = async () => {
    const formData = methods.getValues();

    if (formData.level === null || formData.level === undefined) {
      toast.error("Floor level is required.");
      return;
    }
    const currentFloors = getValues(`blocks.${blockIndex}.floors`) || [];
    const levelExists = currentFloors.some(
      (floor, index) =>
        floor.level === formData.level &&
        index !== currentFloorOriginalIndex
    );
    if (levelExists) {
      setDuplicateError(`Floor level ${formData.level} already exists`);
      return;
    }

    if (!watchedMethodsFormValues) {
      toast.error("No floor data to save.");
      return;
    }

    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields for the floor.");
      return;
    }

    const allBlocks = getValues("blocks");
    const currentBlock = allBlocks?.[blockIndex];

    if (currentBlock) {
      if (currentFloorOriginalIndex !== null) {
        update(currentFloorOriginalIndex, watchedMethodsFormValues);
        toast.success("Floor updated successfully!");
      } else {
        append(watchedMethodsFormValues);
        toast.success("Floor added successfully!");
      }
      
    } else {
      toast.error("Block not found.");
    }

    methods.reset(methods.formState.defaultValues);
    setCurrentFloorOriginalIndex(null);
    setDuplicateError(null);
  };

  const handleSaveDataFromChild = async (data: { formState: Floor }) => {
    const floorDataToSave = data.formState;

    const allBlocks = getValues("blocks");
    const currentBlock = allBlocks?.[blockIndex];


    if (!currentBlock) {
      toast.error("Block not found during child data save.");
      return;
    }

    if (currentFloorOriginalIndex !== null) {
      update(currentFloorOriginalIndex, floorDataToSave);
      toast.success("Floor updated successfully from child!");
    } else {
      append(floorDataToSave);
      toast.success("Floor added successfully from child!");
    }

    methods.reset(methods.formState.defaultValues);
    setCurrentFloorOriginalIndex(null);
  };

  /**
   * Function to handle editing a floor. It is called from `BlockPreview` when an 'Edit' button is clicked.
   * It populates the `CreateBlockForm` with the selected floor's data.
   * @param originalIndex The original array index of the floor to edit.
   * @param floorData The `Floor` object containing the data to populate the form.
   */
  const handleEditFloor = (originalIndex: number, floorData: Floor) => {
    methods.reset(floorData);
    setCurrentFloorOriginalIndex(originalIndex);
  };

  /**
   * Handles deleting a floor from the `floors` array.
   * This function is called from `BlockPreview` when a 'Delete' button is clicked.
   * @param floorIndexToRemove The original array index of the floor to delete.
   */
  const handleDeleteFloor = (floorIndexToRemove: number) => {
    removeFloorArray(floorIndexToRemove); // Use `useFieldArray`'s `remove` method
    toast.success("Floor deleted successfully!");

    if (currentFloorOriginalIndex === floorIndexToRemove) {
      setCurrentFloorOriginalIndex(null);
      methods.reset(methods.formState.defaultValues); // Clear the form
    } else if (
      currentFloorOriginalIndex !== null && // If already editing
      currentFloorOriginalIndex > floorIndexToRemove // And a floor *before* the edited one was deleted
    ) {
      setCurrentFloorOriginalIndex(currentFloorOriginalIndex - 1);
    }
  };

  const currentEditedFloorLevel = currentFloorOriginalIndex !== null
    ? getValues(`blocks.${blockIndex}.floors.${currentFloorOriginalIndex}.level`)
    : null;

  const handleCreate = async (action: "save" | "approve") => {
    console.log(`Action: ${action} - Placeholder for API call`);
    };
  const save_and_approve_loading = async (action: "save" | "approve") => {
    console.log(`Saving and approving action: ${action} - Placeholder for API call`);
  };

  return (
    <div className="w-full h-full grid grid-rows-12 py-4 pb-10 gap-4">
      {/* Main Content Area */}
      {false ? ( // You can make this conditional based on a global loading state
        <Skeleton className="w-full row-span-12 rounded-xl" />
      ) : (
        <div className="w-full overflow-hidden overflow-y-auto lg:overflow-y-hidden row-span-12 flex flex-col lg:flex-row justify-between gap-4">
          {/* Left Side: Floor Creation/Edit Form */}
          <div className="w-full lg:min-w-[50%] lg:w-[100%] p-1 lg:h-full border rounded-lg">
            <div className="w-full p-3 h-auto lg:h-full lg:overflow-hidden lg:overflow-y-scroll lg:sm-scrollbar">
              <FormProvider {...methods}>
                <CreateBlockForm
                  duplicateError={duplicateError}
                  onClearDuplicateError={() => setDuplicateError(null)}
                  watchedHasFacilitiesFromBlock={watchedHasFacilities}
                  watchedHasRoomsFromBlock={watchedHasRooms}
                  blockIndex={blockIndex}
                  floorIndex={currentFloorOriginalIndex !== null ? currentFloorOriginalIndex : undefined}
                  onOpenChange={() => { }} 
                />
              </FormProvider>
            </div>
          </div>

          {/* Right Side: Block Preview (List of Floors) */}
          <div className="w-full lg:min-w-max p-1 bg-muted/20 border-border border">
            <BlockPreview
              blockIndex={blockIndex}
              // Pass the level of the currently edited floor to highlight it in the preview
              selectedFloorLevel={currentEditedFloorLevel}
              onEditFloor={handleEditFloor}   // Pass the handler to enable editing
              onDeleteFloor={handleDeleteFloor} // Pass the handler to enable deleting
            />
          </div>
        </div>
      )}

      {false ? ( // You can make this conditional based on a global loading state
        <Skeleton className="w-full row-span-5 rounded-xl px-4 py-2 md:px-5 lg:px-6 3xl:px-8 4xl:px-10" />
      ) : (
        <div className="w-full flex row-span-1 items-center justify-between gap-2 bg-background pt-4 lg:py-2 border-t lg:border-none">
          <CreateFloorsGeneralData
          // Pass control if this component needs to interact with the `methods` form
          // control={methods.control}
          />
          <div className="flex items-center gap-2">
            <Button
              disabled={methods.formState.disabled || !watchedMethodsFormValues}
              onClick={handleSaveFloor} // Trigger the main save/update handler
              type="button"
              variant="outline"
              size="sm"
            >
              {currentFloorOriginalIndex !== null ? "Update Floor" : "Add Floor"}
            </Button>

            {has(["property:create"]) ? (
              <Button
                onClick={() => handleCreate("approve")}
                type="button"
                size="sm"
              >
                Approve & Save
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

