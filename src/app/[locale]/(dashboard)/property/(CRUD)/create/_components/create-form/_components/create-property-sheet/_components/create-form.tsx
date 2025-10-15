"use client";
import { useController, useFormContext, useWatch, useFieldArray, useForm, Controller, Path } from "react-hook-form";
import { CreateReservationValidationSchemaType } from "./create-form.schema";
import RoomInterface, {
  LightweightRoomInterface,
} from "@/interfaces/room.interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import ToggleCard from "@/components/toggle-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiExclamation, HiOutlineCalendar, HiOutlineX } from "react-icons/hi";
import { format, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { startHoursArray } from "@/lib/data";
import { CreatePropertyInterface, Floor, Facility, Room, Elevator, AdditionalFeature, ExtraArea, Section } from "@/interfaces/property.interface"; // Added Section import

interface CreateBlockFormProps {
  blockIndex: number; // Still needed to identify which block in the parent
  floorIndex?: number; // Still needed to identify if editing an existing floor
  onOpenChange: (open: boolean) => void;
  // Renamed to avoid collision with floor's hasFacilities
  watchedHasFacilitiesFromBlock?: boolean;
  // Renamed to avoid collision with floor's hasRooms
  watchedHasRoomsFromBlock?: boolean;
  // This prop will be removed as the parent will control the "save"
  // setSaveData: (data: { formState: Floor }) => void;
  duplicateError: string | null;
  onClearDuplicateError: () => void;
}

const energyA = ['A+++', 'A++', 'A+', 'A'];
const energyBC = ['B', 'C'];
const energyD = ['D'];
const energyEFG = ['E', 'F', 'G'];

const CreateBlockForm = ({
  blockIndex,
  floorIndex,
  onOpenChange,
  watchedHasFacilitiesFromBlock,
  watchedHasRoomsFromBlock,
  duplicateError, // Keep this prop for displaying error
  onClearDuplicateError // Keep this prop for clearing error
}: CreateBlockFormProps) => {
  // *** CRITICAL CHANGE: Use useFormContext<Floor>() here! ***
  // This hook now correctly accesses the 'methods' form context passed from the parent.
  const { control, register, setValue, getValues, watch, formState: { errors, disabled } } = useFormContext<Floor>();

  // You no longer need to construct 'currentFloorPath' based on the parent's structure.
  // The current form context already represents the 'Floor' object.
  // For nested arrays within Floor, the name will be directly "sections", "rooms", etc.

  // Local state for new entries (these are fine)
  const [newRoomsSection, setNewRoomsSection] = useState<string>("");
  const [newRoomsFrom, setNewRoomsFrom] = useState<number>(0);
  const [newRoomsTo, setNewRoomsTo] = useState<number>(0);

  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilitySection, setNewFacilitySection] = useState("");

  const [newElevatorName, setNewElevatorName] = useState("");
  const [newElevatorSection, setNewElevatorSection] = useState("");

  const [newFeatureName, setNewFeatureName] = useState("");

  const [newExtraAreaName, setNewExtraAreaName] = useState("");
  const [newExtraAreaUsedFor, setNewExtraAreaUsedFor] = useState("");

  // Use useFieldArray directly on the Floor's properties
  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "sections", // Direct path within the Floor form
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({
    control,
    name: "rooms", // Direct path within the Floor form
  });

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control,
    name: "facilities", // Direct path within the Floor form
  });

  const { fields: elevatorFields, append: appendElevator, remove: removeElevator } = useFieldArray({
    control,
    name: "elevators", // Direct path within the Floor form
  });

  const { fields: additionalFields, append: appendAdditional, remove: removeAdditional } = useFieldArray({
    control,
    name: "AdditionalFeatures", // Direct path within the Floor form
  });

  const { fields: extraAreaFields, append: appendExtraArea, remove: removeExtraArea } = useFieldArray({
    control,
    name: "ExtraAreas", // Direct path within the Floor form
  });

  // Controller for the energyClass array
  const energyCtrl = useController({
    control,
    name: "energyClass", // Direct path within the Floor form
    defaultValue: [],
  });

  // Helper to toggle energy classes
  const toggleClass = (cls: string) => {
    const current: string[] = energyCtrl.field.value || [];
    const next = current.includes(cls)
      ? current.filter(c => c !== cls)
      : [...current, cls];
    energyCtrl.field.onChange(next);
  };

  // Helper to render energy class buttons (no changes needed)
  const renderButtons = (classes: string[], onCls: string, offCls: string) =>
    classes.map((cls) => {
      const selected = (energyCtrl.field.value || []).includes(cls);
      return (
        <button
          key={cls}
          type="button"
          onClick={() => toggleClass(cls)}
          disabled={disabled}
          className={`w-full py-2 rounded text-center ${selected ? onCls : offCls}`}
        >
          {cls}
        </button>
      );
    });

  // Watch for changes in hasFacilities and hasRooms on the *current floor*
  // These now watch the 'Floor' context directly
  const floorHasRooms = useWatch({
    control,
    name: "hasRooms",
    defaultValue: watchedHasRoomsFromBlock ?? false
  });

  const floorHasFacilities = useWatch({
    control,
    name: "hasFacilities",
    defaultValue: watchedHasFacilitiesFromBlock ?? false
  });

  // Sync floor's hasRooms and hasFacilities with parent block's settings on mount
  // This useEffect is still important as it sets the initial values based on the block's config
  useEffect(() => {
    if (watchedHasRoomsFromBlock !== undefined) {
      setValue(
        "hasRooms", // Direct path within the Floor form
        watchedHasRoomsFromBlock,
        { shouldValidate: true, shouldDirty: true }
      );
    }

    if (watchedHasFacilitiesFromBlock !== undefined) {
      setValue(
        "hasFacilities", // Direct path within the Floor form
        watchedHasFacilitiesFromBlock,
        { shouldValidate: true, shouldDirty: true }
      );
    }
  }, [watchedHasRoomsFromBlock, watchedHasFacilitiesFromBlock, setValue]);


  // Watch sections to populate dropdowns for rooms, facilities, elevators
  const sections = watch("sections") as { name: string }[] || []; // Direct path within the Floor form

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Basic Information */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="floorName">Floor Name</Label>
        <Input
          id="floorName"
          {...register("name")} // Direct path
          placeholder="Enter floor name"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2 items-center">
        <div className="w-full">
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            type="number"
            placeholder="Enter level"
            {...register("level", { // Direct path
              valueAsNumber: true,
            })}
            min={-2}
            max={50}
            disabled={disabled}
          />
        </div>
        <div className="w-full">
          <Label htmlFor="surfaceArea">Surface Area</Label>
          <Input
            id="surfaceArea"
            type="number"
            {...register("surfaceArea", { // Direct path
              valueAsNumber: true,
            })}
            placeholder="Enter surface area"
            min={0}
            disabled={disabled}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="surfaceUnit">Surface Unit</Label>
          <Controller
            control={control}
            name="surfaceUnit" // Direct path
            defaultValue="sqm"
            render={({ field }) => (
              <Select
                disabled={disabled}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="surfaceUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqm">sqm</SelectItem>
                  <SelectItem value="sqft">sqft</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Energy Class */}
      <div className="space-y-2">
        <Label>Energy Classes</Label>
        <div className="flex">
          {renderButtons(energyA, 'bg-green-600 text-white rounded-none', 'bg-green-200 text-green-800 rounded-none')}
          {renderButtons(energyBC, 'bg-yellow-500 text-white rounded-none', 'bg-yellow-200 text-yellow-800 rounded-none')}
          {renderButtons(energyD, 'bg-orange-500 text-white rounded-none', 'bg-orange-200 text-orange-800 rounded-none')}
          {renderButtons(energyEFG, 'bg-red-500 text-white rounded-none', 'bg-red-200 text-red-800 rounded-none')}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <Label className="font-medium">Sections</Label>
        <div className="space-y-2">
          {sectionFields.map((sectionField, index) => (
            <div key={sectionField.id} className="flex gap-2 items-center">
              <Input
                {...register(`sections.${index}.name`)}
                placeholder="Section name"
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
                disabled={disabled}
              >
                <HiOutlineTrash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => appendSection({ name: "", roomFrom: 0, roomTo: 0 })}
            disabled={disabled}
          >
            <HiOutlinePlus className="mr-2 h-4 w-4" /> Add Section
          </Button>
        </div>
      </div>

      <hr className="my-4" />

      <h2 className="text-lg font-semibold">Floor Configuration</h2>
      <p className="text-accent-foreground/90 text-sm">Does your Floor have rooms or facilities?</p>


      <div className="grid grid-cols-2 gap-4">
        {
          watchedHasRoomsFromBlock && (

            <Controller
              name="hasRooms" // Direct path
              control={control}
              defaultValue={watchedHasRoomsFromBlock ?? false}
              render={({ field }) => (
                <ToggleCard
                  title="Includes rooms"
                  subtitle="Customize this floor with rooms"
                  selected={field.value}
                  onToggle={() => {
                    const newValue = !field.value;
                    field.onChange(newValue);
                    if (!newValue) {
                      // Clear rooms if hasRooms is toggled off
                      setValue("rooms", []); // Direct path
                    }
                  }}
                  // disabled={disabled || !watchedHasRoomsFromBlock}
                />
              )}
            />)}
        {
          watchedHasFacilitiesFromBlock && (


            <Controller
              name="hasFacilities" // Direct path
              control={control}
              defaultValue={watchedHasFacilitiesFromBlock ?? false}
              render={({ field }) => (
                <ToggleCard
                  title="Includes facilities"
                  subtitle="Customize this floor with facilities"
                  selected={field.value}
                  onToggle={() => {
                    const newValue = !field.value;
                    field.onChange(newValue);
                    if (!newValue) {
                      // Clear facilities if hasFacilities is toggled off
                      setValue("facilities", []); // Direct path
                    }
                  }}
                  // disabled={disabled || !watchedHasFacilitiesFromBlock}
                />
              )}
            />)}
      </div>

      {/* Rooms Section */}
      {floorHasRooms && watchedHasRoomsFromBlock && (
        <div className="space-y-4">
          <h3 className="font-medium">Rooms</h3>

          {/* Preview grouped by section */}
          <div className="flex flex-wrap gap-2 py-2">
            {(() => {
              const grouped = roomFields.reduce((acc, room) => {
                (acc[room.sectionName] ||= []).push(room.number);
                return acc;
              }, {} as Record<string, number[]>);

              if (Object.keys(grouped).length === 0) {
                return (
                  <h3 className="text-sm text-gray-500 italic w-full">
                    No rooms added yet.
                  </h3>
                );
              }

              return Object.entries(grouped).map(([sectionName, numbers]) => (
                <div
                  key={sectionName}
                  className="flex items-center bg-gray-100 rounded px-3 py-1 space-x-2"
                >
                  <span className="font-medium">{sectionName}:</span>
                  <span className="text-sm">{numbers.sort((a, b) => a - b).join(", ")}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="p-0"
                    onClick={() =>
                      // remove *all* rooms in this section
                      roomFields
                        .map((r, idx) =>
                          r.sectionName === sectionName ? idx : -1
                        )
                        .filter(idx => idx >= 0)
                        .reverse() // remove from highest index so offsets don’t shift
                        .forEach(idx => removeRoom(idx))
                    }
                    disabled={disabled}
                  >
                    <HiOutlineTrash className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ));
            })()}
          </div>

          {/* Batch Add Form */}
          <div className="flex gap-2 items-end">
            <div className="space-y-2 flex-1">
              <Label>Section</Label>
              <Select
                value={newRoomsSection}
                onValueChange={setNewRoomsSection}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections
                    .filter(s => s.name.trim() !== '')
                    .map((s, idx) => (
                      <SelectItem key={idx} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>From</Label>
              <Input
                type="number"
                value={newRoomsFrom}
                onChange={e => setNewRoomsFrom(Number(e.target.value))}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>To</Label>
              <Input
                type="number"
                value={newRoomsTo}
                onChange={e => setNewRoomsTo(Number(e.target.value))}
                disabled={disabled}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (!newRoomsSection || newRoomsFrom > newRoomsTo || newRoomsFrom < 0) return;
                Array.from(
                  { length: newRoomsTo - newRoomsFrom + 1 },
                  (_, i) => newRoomsFrom + i
                ).forEach(number =>
                  appendRoom({ sectionName: newRoomsSection, number })
                );
                setNewRoomsSection("");
                setNewRoomsFrom(0);
                setNewRoomsTo(0);
              }}
              disabled={disabled || !newRoomsSection || newRoomsFrom > newRoomsTo}
            >
              <HiOutlinePlus className="mr-2 h-4 w-4" /> Add Rooms
            </Button>
          </div>
        </div>
      )}

      {/* Facilities Section */}
      {floorHasFacilities && watchedHasFacilitiesFromBlock && (
        <div className="space-y-4">
          <h3 className="font-medium">Facilities</h3>

          {/* List existing */}
          <div className="space-y-2">
            {facilityFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center">
                <Input
                  {...register(`facilities.${idx}.name`)}
                  placeholder="Facility name"
                  disabled={disabled}
                />
                <Controller
                  control={control}
                  name={`facilities.${idx}.sectionName`}
                  defaultValue={field.sectionName}
                  render={({ field: selectField }) => (
                    <Select
                      disabled={disabled}
                      value={selectField.value}
                      onValueChange={selectField.onChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections
                          .filter(s => s.name.trim() !== '')
                          .map((s, i) => (
                            <SelectItem key={i} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFacility(idx)}
                  disabled={disabled}
                >
                  <HiOutlineTrash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            {/* Add new facility */}
            <div className="flex gap-2 items-center">
              <Input
                value={newFacilityName}
                onChange={e => setNewFacilityName(e.target.value)}
                placeholder="New facility name"
                disabled={disabled}
              />
              <Select
                value={newFacilitySection}
                onValueChange={setNewFacilitySection}
                disabled={disabled}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections
                    .filter(s => s.name.trim() !== '')
                    .map((s, idx) => (
                      <SelectItem key={idx} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  if (!newFacilityName.trim() || !newFacilitySection) return;
                  appendFacility({ name: newFacilityName.trim(), sectionName: newFacilitySection });
                  setNewFacilityName("");
                  setNewFacilitySection("");
                }}
                disabled={disabled || !newFacilityName.trim() || !newFacilitySection}
              >
                <HiOutlinePlus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Elevators Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Elevators</h3>

        {/* List existing */}
        <div className="space-y-2">
          {elevatorFields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                {...register(`elevators.${idx}.name`)}
                placeholder="Elevator name"
                disabled={disabled}
              />
              <Controller
                control={control}
                name={`elevators.${idx}.sectionName`}
                defaultValue={field.sectionName}
                render={({ field: selectField }) => (
                  <Select
                    disabled={disabled}
                    value={selectField.value}
                    onValueChange={selectField.onChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections
                        .filter(s => s.name.trim() !== '')
                        .map((s, i) => (
                          <SelectItem key={i} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeElevator(idx)}
                disabled={disabled}
              >
                <HiOutlineTrash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {/* Add new elevator */}
          <div className="flex gap-2 items-center">
            <Input
              value={newElevatorName}
              onChange={e => setNewElevatorName(e.target.value)}
              placeholder="New elevator name"
              disabled={disabled}
            />
            <Select
              value={newElevatorSection}
              onValueChange={setNewElevatorSection}
              disabled={disabled}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections
                  .filter(s => s.name.trim() !== '')
                  .map((s, idx) => (
                    <SelectItem key={idx} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                if (!newElevatorName.trim() || !newElevatorSection) return;
                appendElevator({ name: newElevatorName.trim(), sectionName: newElevatorSection });
                setNewElevatorName("");
                setNewElevatorSection("");
              }}
              disabled={disabled || !newElevatorName.trim() || !newElevatorSection}
            >
              <HiOutlinePlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Additional Features</h3>

        {/* List existing features */}
        <div className="space-y-2">
          {additionalFields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                {...register(`AdditionalFeatures.${idx}.name`)}
                placeholder="Feature name"
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAdditional(idx)}
                disabled={disabled}
              >
                <HiOutlineTrash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {/* Add new feature */}
          <div className="flex gap-2 items-center">
            <Input
              value={newFeatureName}
              onChange={e => setNewFeatureName(e.target.value)}
              placeholder="New feature name"
              disabled={disabled}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (!newFeatureName.trim()) return;
                appendAdditional({ name: newFeatureName.trim() });
                setNewFeatureName("");
              }}
              disabled={disabled || !newFeatureName.trim()}
            >
              <HiOutlinePlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Extra Areas Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Extra Areas</h3>

        {/* List existing extra areas */}
        <div className="space-y-2">
          {extraAreaFields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                {...register(`ExtraAreas.${idx}.name`)}
                placeholder="Area Name"
                disabled={disabled}
              />
              <Input
                {...register(`ExtraAreas.${idx}.usedFor`)}
                placeholder="Reserved For"
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExtraArea(idx)}
                disabled={disabled}
              >
                <HiOutlineTrash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {/* Add new extra area */}
          <div className="flex gap-2 items-center">
            <Input
              value={newExtraAreaName}
              onChange={e => setNewExtraAreaName(e.target.value)}
              placeholder="New area name"
              disabled={disabled}
            />
            <Input
              value={newExtraAreaUsedFor}
              onChange={e => setNewExtraAreaUsedFor(e.target.value)}
              placeholder="Used for"
              disabled={disabled}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (!newExtraAreaName.trim() || !newExtraAreaUsedFor.trim()) return;
                appendExtraArea({ name: newExtraAreaName.trim(), usedFor: newExtraAreaUsedFor.trim() });
                setNewExtraAreaName("");
                setNewExtraAreaUsedFor("");
              }}
              disabled={disabled || !newExtraAreaName.trim() || !newExtraAreaUsedFor.trim()}
            >
              <HiOutlinePlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Add a save button for the form, though the parent will trigger the actual save */}
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="secondary"
          onClick={() => onOpenChange(false)} // Close the form/modal
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            // No need to trigger a save from here, the parent will handle it.
            // Just close the form.
            onOpenChange(false);
          }}
          disabled={disabled}
        >
          {floorIndex !== undefined ? "Update Floor" : "Add Floor"}
        </Button>
      </div>
    </div>
  );
};

export default CreateBlockForm;

