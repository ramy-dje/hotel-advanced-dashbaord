"use client";

import React, { useState, forwardRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import useAccess from "@/hooks/use-access";
import CreatePropertySheet from "./create-property-sheet/sheet";
import { Switch } from "@/components/ui/switch";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import BasicTable from "@/components/basic-table";
import ToggleCard from "@/components/toggle-card";
import { useFormContext, useFieldArray, useController, Controller, Path, useWatch } from "react-hook-form"; // Import useWatch
import { CreatePropertyInterface, Floor, Facility, Room } from "@/interfaces/property.interface";

import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";

import TextEditor from "@/components/text-editor";
interface Props { id: string; }


const energyOptions = ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"];

const FloorTableColumns = (onEdit: (floor: Floor) => void): ColumnDef<Floor>[] => [
  {
    accessorKey: "name",
    header: "Floor Name",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    header: "Rooms",
    cell: ({ row }) => true
      ? `${row.original.rooms?.length} rooms`
      : "N/A",
  },
  {
    header: "Sections",
    cell: ({ row }) => row.original.sections?.map(s => s.name).join(", ") || "None",
  },
  {
    header: "Facilities",
    cell: ({ row }) => row.original.facilities?.[0]?.name || "None",
  },
  {
    header: "Surface Area",
    cell: ({ row }) => `${row.original.surfaceArea} ${row.original.surfaceUnit}`,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
        <HiOutlinePencil className="h-4 w-4" />
      </Button>
    ),
  },
];

const FloorTable = ({ data, onEdit }: { data: Floor[], onEdit: (floor: Floor) => void }) => {
  const table = useReactTable({
    data,
    columns: FloorTableColumns(onEdit),
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} isLoading={false} className="w-full" length={data.length} />;
};

type BlockProps = {
  onCreate: (
    name: string,
    hasRooms: boolean,
    hasFacilities: boolean,
    description: string,
    floors: Floor[]
  ) => void;
};

const CreateBlockDialog: React.FC<BlockProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);

  const { control, setValue, formState: { errors, disabled } } = useFormContext<CreatePropertyInterface>();

  const [blockName, setBlockName] = useState("");
  const [hasRooms, setHasRooms] = useState(false);
  const [hasFacilities, setHasFacilities] = useState(false);
  const [description, setDescription] = useState("");

  const hasRoomsCtrl = useController({
    control,
    name: "tempHasRooms" as any,
    defaultValue: false
  });

  const hasFacilitiesCtrl = useController({
    control,
    name: "tempHasFacilities" as any,
    defaultValue: false
  });

  // `useFieldArray` in CreateBlockDialog is not strictly necessary as you're not
  // directly manipulating the `blocks` array *within* this dialog, but rather
  // calling `onCreate` which then `appendBlock` in `BlocksManager`.
  // However, keeping it doesn't harm.
  const { fields: blocks, append: appendBlock, remove: removeBlock, update: updateBlock } = useFieldArray({
    control,
    name: `blocks`,
  });

  const handleCreate = () => {
    const name = blockName.trim();
    if (!name) return;
    const floors: Floor[] = [];
    console.log("hasFacilities: ", hasFacilities)
    onCreate(
      name,
      hasRooms,
      hasFacilities,
      description,
      floors
    );
    setBlockName("");
    setDescription("");
    setHasRooms(false);
    setHasFacilities(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><HiOutlinePlus /> Add Block</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[84vh] overflow-y-auto w-[50vw]">
        <div className="flex items-center justify-center">
          <Image
            src={`/property-icons/resort.svg`}
            alt="Building Icon"
            width={50}
            height={50}
            loading="lazy"
            className="aspect-square"
            decoding="async"
          />
        </div>
        <DialogHeader className="flex flex-col items-center mb-4">
          <DialogTitle className="text-lg font-semibold ">Tell Us What You Have To Offer In This Block!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Block Name</Label>
            <Input
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Enter block name"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter block description"
              disabled={disabled}
            />
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="mb-0">Block Configuration</label>
            <p className="text-accent-foreground/90 text-sm">Does your block have rooms or facilities?</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <ToggleCard
                title="Includes rooms"
                subtitle="Customize this floor with rooms"
                selected={hasRooms}
                onToggle={() => {
                  setHasRooms(!hasRooms);
                }}
              />
              <ToggleCard
                title="Includes facilities"
                subtitle="Customize this floor with facilities"
                selected={hasFacilities}
                onToggle={() => {
                  setHasFacilities(!hasFacilities);
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BlocksManager = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      register,
      // We need setValue here to manually trigger updates if necessary,
      // although useWatch should handle most cases.
      setValue,
      getValues // Useful for getting the current state if needed for update logic
    } = useFormContext<CreatePropertyInterface>();

    // ********* THE CRUCIAL CHANGE IS HERE *********
    // Use useWatch to directly watch the entire 'blocks' array for re-renders.
    // This `watchedBlocks` array will always be the most up-to-date representation
    // of the blocks in your form state, regardless of where the change originated.
    const watchedBlocks = useWatch<CreatePropertyInterface, "blocks">({
      control,
      name: "blocks",
      defaultValue: [], // Important: provide a default value
    });

    // We still need the useFieldArray for append/remove/update functions,
    // but we'll ensure we use `watchedBlocks` for rendering and for
    // getting the *current* state when building new objects for `updateBlock`.
    const { append: appendBlock, remove: removeBlock, update: updateBlock } = useFieldArray({
      control,
      name: "blocks",
    });

    const { has } = useAccess();

    const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);
    const [floorDialogState, setFloorDialogState] = useState<{
      blockIndex: number;
      floorIndex?: number;
      open: boolean;
    } | null>(null);

    const handleBlockNameUpdate = (index: number, newName: string) => {
      // Use setValue directly to update the block name in the form state.
      // This is generally more reliable than `updateBlock` for a single field
      // when you're already watching the whole array.
      setValue(`blocks.${index}.block_name`, newName, { shouldDirty: true });
      setEditingBlockIndex(null); // Exit editing mode
    };

    // The handleFloorUpdate might not be strictly necessary if all floor modifications
    // are done via `CreatePropertySheet` which uses react-hook-form directly.
    // However, if it's called for some reason (e.g., if you had direct buttons here to add/edit floors),
    // ensure it's using the latest `watchedBlocks`.
    const handleFloorUpdate = (blockIndex: number, floor: Floor, floorIndex?: number) => {
      // Get the *current* state of the block from the form using getValues
      // This is important because `watchedBlocks` is for rendering, and `getValues`
      // gives you the absolute latest before you attempt to modify it.
      const currentBlocks = getValues("blocks");
      const blockToUpdate = currentBlocks[blockIndex];

      if (!blockToUpdate) return; // Should not happen if blockIndex is valid

      const newFloors = floorIndex !== undefined
        ? blockToUpdate.floors.map((f, i) => i === floorIndex ? floor : f)
        : [...blockToUpdate.floors, floor];

      // Update the entire block object in the form state using `updateBlock`
      // or `setValue` for the whole block if that fits your use case better.
      updateBlock(blockIndex, {
        ...blockToUpdate,
        floors: newFloors
      });
      setFloorDialogState(null);
      setEditingBlockIndex(null);
    };

    return (
      <CreationFormSection ref={ref} id={`${id}-floors`} className="flex w-full ">
        <CreationFormSectionContent className="w-full flex flex-col gap-4">
          <div className="w-full ">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Building Manager</h1>
              <CreateBlockDialog onCreate={(block_name, hasRooms, hasFacilities, description, floors) => appendBlock({ block_name, hasRooms, hasFacilities, description, floors })} />
            </div>
            {/* Render based on watchedBlocks */}
            {watchedBlocks.length === 0 && (
              <CreationFormSectionInfo className="w-full flex flex-col items-center justify-center">
                <CreationFormSectionInfoTitle className="text-lg font-semibold">No Blocks Available</CreationFormSectionInfoTitle>
                <CreationFormSectionInfoDescription>
                  No blocks have been added yet. Click the button above to add a new block.
                </CreationFormSectionInfoDescription>
              </CreationFormSectionInfo>
            )}
            {/* Iterate over watchedBlocks for rendering */}
            {watchedBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="border rounded-lg p-4 shadow-sm w-full mb-4">
                <div className="flex justify-between items-center mb-4 ">
                  <div className="flex items-center gap-2">
                    {editingBlockIndex === blockIndex ? (
                      (() => {
                        const {
                          onBlur: reactHookFormOnBlur,
                          ...restRegister
                        } = register(`blocks.${blockIndex}.block_name` as Path<CreatePropertyInterface>);
                        // Use handleBlockNameUpdate for updating the name
                        return (
                          <Input
                            defaultValue={block.block_name}
                            autoFocus
                            className="w-48"
                            onBlur={(e) => {
                              reactHookFormOnBlur(e);
                              handleBlockNameUpdate(blockIndex, e.target.value);
                            }}
                            {...restRegister}
                          />
                        );
                      })()
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold">{block.block_name}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingBlockIndex(blockIndex)}
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete block "${block.block_name}" and all its floors?`)) {
                              removeBlock(blockIndex); // Direct call to remove the block
                            }
                          }}
                        >
                          <HiOutlineTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>

                  {has(["property:create"]) ? (
                    <CreatePropertySheet blockIndex={blockIndex} hasRooms={block.hasRooms} hasFacilities={block.hasFacilities} />
                  ) : null}

                </div>

                {/* This `block.floors` reference comes from the `watchedBlocks` array,
                    which is always up-to-date due to `useWatch`. */}
                {Array.isArray(block.floors) && block.floors.length > 0 ? (
                  <FloorTable
                    data={block.floors}
                    onEdit={floor => {
                      // Find the index of the floor within the current block's floors array
                      const floorIndex = block.floors.findIndex(f => f.level === floor.level); // Use a unique identifier like 'level' or a generated ID if available
                      setFloorDialogState({ blockIndex, floorIndex, open: true });
                    }}
                  />
                ) : (
                  <div className="py-4 text-center text-gray-500">No floors added yet</div>
                )}
              </div>
            ))}

          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  });

export default BlocksManager;
