import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlinePlus } from 'react-icons/hi';
import Portal from '@/components/ui/portal';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog as DialogHeadless } from '@headlessui/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InlineAlert from '@/components/ui/inline-alert';
import { HiOutlineBuildingOffice, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreatePropertyDirectoryValidationSchema,
  CreatePropertyDirectoryValidationSchemaType,
} from '../create-property-directory.schema';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import VeritasCheckbox from '@/components/ui/veristasCheckbox';
import TagInput from '@/components/ui/tag-input';
import { FileInput } from 'lucide-react';
import Rating from '@/components/rating';
import RoomsRating from '@/components/rating/rooms-rating';
import EditPropertyTypesPopup from './rooms-rating-dnd';
import { RoomType } from '@/interfaces/property.interface';
import CreatePropertyTypePopup from '../create-type-popup';
import EditRoomTypePopup from './rooms-rating-popup';
import { useFormContext, Control, FieldValues, Controller, useWatch } from 'react-hook-form';


const getIconDisplayName = (path: string): string => {
  // Extracts "pool.svg" from "/icons/pool.svg"
  const filename = path.split('/').pop() || '';
  // Removes ".svg" extension
  const nameWithoutExtension = filename.replace(/\.svg$/i, '');
  // Converts "swimming-pool" to "Swimming Pool"
  return nameWithoutExtension
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
const BATHROOMS_ICON_PATHS = [
  "/bathrooms-icons/bathtub.svg",
  "/bathrooms-icons/hammam.svg",
  "/bathrooms-icons/hot tub.svg",
  "/bathrooms-icons/sensory shower.svg",
  "/bathrooms-icons/shower.svg",
  "/bathrooms-icons/whirlpool tub.svg",

]
const BED_ICONS_PATHS = [
  "/beds-icons/king bed.svg",
  "/beds-icons/queen bed.svg",
  "/beds-icons/Double bed.svg",
  "/beds-icons/single bed.svg",
  "/beds-icons/Twin bed.svg",
  "/beds-icons/toddler bed.svg",
  "/beds-icons/Baby crib.svg",
  "/beds-icons/floor mattress.svg",
  "/beds-icons/sofa bed.svg",
  "/beds-icons/sofa.svg",
  "/beds-icons/bunk bed.svg",
  "/beds-icons/hammock.svg",
];
// Generate unique ID for room types
const generateId = () => Math.random().toString(36).substr(2, 9);
const PropertyToggleCard = ({ title, subtitle, selected, onToggle }: { title: string; subtitle: string; selected: boolean; onToggle: () => void }) => {
  return (
    <div
      className={`w-full h-[120px] p-8 border rounded-lg cursor-pointer ${selected ? 'border-primary' : 'border-gray-200'}`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-[520] pb-2">{title}</h3>
      </div>
      <p className="text-base text-muted-foreground">{subtitle}</p>
    </div>
  );
};

// Reusable Step Components
function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-4 flex flex-col items-center justify-center w-full h-[300px]">
      <h1 className="text-3xl font-bold ">Creating fastly!</h1>
      <p className="text-center">What does your property have to offer?</p>
      <Button onClick={onNext} variant="yes_no" className="w-[100px] h-[50px]">Get Started</Button>
    </div>
  );
}
function Step2({
  control,
  onNext,
  onBack,
}: {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Controller
      control={control}
      name="propertySpecificType"
      defaultValue={null}
      render={({ field: { value, onChange } }) => {
        const handleToggle = (option: 'single' | 'multi') => {
          const newValue = value === option ? null : option;
          onChange(newValue);
        };

        return (
          <div className="space-y-4 flex flex-col w-full h-[500px] justify-between">
            <div className="mb-10">
              <h3 className="text-xl font-[520] mb-10 flex items-center gap-2 justify-between">
                Start a New Listing
                <span className="text-sm text-muted-foreground">Step 1 out of 8</span>
              </h3>
              <div className="flex h-full justify-center gap-2 flex-col items-center mt-4">
                <PropertyToggleCard
                  title="Single unit property"
                  subtitle="This kind of property is rented out as a single independent entity."
                  selected={value === 'single'}
                  onToggle={() => handleToggle('single')}
                />
                <PropertyToggleCard
                  title="Multi unit property"
                  subtitle="This kind of property is divided into multiple independent entities."
                  selected={value === 'multi'}
                  onToggle={() => handleToggle('multi')}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>Back</Button>
              <Button variant="yes_no" onClick={onNext} disabled={!value}>
                Next
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    console.log('NumberInput: Input changed, raw:', e.target.value, 'parsed:', val); // ADD THIS
    onChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className="flex items-center space-x-2">
      <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded" onClick={() => { console.log('NumberInput: Minus button clicked, new value:', Math.max(0, value - 1)); onChange(Math.max(0, value - 1)); }}>-</button> {/* ADD THIS */}
      <Input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        className="w-12 text-center border-none rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={handleInput}
      />
      <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded" onClick={() => { console.log('NumberInput: Plus button clicked, new value:', value + 1); onChange(value + 1); }}>+</button> {/* ADD THIS */}
    </div>
  );
}

function Step3({ control, onNext, onBack }: { control: Control<any>; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col w-full h-full justify-between">
      <h3 className="text-xl font-[520] mb-10 flex items-center gap-2 justify-between">
        Basic Information
        <span className="text-sm text-muted-foreground">Step 2 out of 8</span>
      </h3>

      <div className="space-y-4 mb-10">
        {['rooms', 'apartments'].map((field) => (
          <div key={field} className="border rounded-lg p-8 flex items-center gap-2 justify-between">
            <Label className="text-xl font-[520] pb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <Controller
              name={field}
              control={control}
              defaultValue={0}
              render={({ field: { value, onChange } }) => (
                <NumberInput value={value} onChange={onChange} />
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="yes_no" onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

type Step4Props = {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
};

function Step4({ control, onNext, onBack }: Step4Props) {
  // watch the values
  const bedsCount = useWatch({ control, name: 'bedsCount', defaultValue: 0 });
  const bathroomsCount = useWatch({ control, name: 'bathroomsCount', defaultValue: 0 });
  const bedTypes = useWatch({ control, name: 'bedTypes', defaultValue: [] as string[] });
  const bathroomTypes = useWatch({ control, name: 'bathroomTypes', defaultValue: [] as string[] });
  const guests = useWatch({ control, name: 'guests', defaultValue: 0 });

  // local icon state
  const [bedIcons, setBedIcons] = useState<{ path: string; name: string }[]>([]);
  const [bathroomIcons, setBathroomIcons] = useState<{ path: string; name: string }[]>([]);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [loadingBaths, setLoadingBaths] = useState(false);

  useEffect(() => {
    const load = (
      paths: string[],
      setter: typeof setBedIcons | typeof setBathroomIcons,
      flagSetter: typeof setLoadingBeds | typeof setLoadingBaths
    ) => {
      flagSetter(true);
      setTimeout(() => {
        setter(paths.map(path => ({ path, name: getIconDisplayName(path) })));
        flagSetter(false);
      }, 800);
    };

    load(BED_ICONS_PATHS, setBedIcons, setLoadingBeds);
    load(BATHROOMS_ICON_PATHS, setBathroomIcons, setLoadingBaths);
  }, []);

  const renderIcons = (
    icons: { path: string; name: string }[],
    selected: string[],
    onChange: (newArr: string[]) => void
  ) => (
    <div className="flex flex-wrap gap-4">
      {icons.map(icon => {
        const isSel = selected.includes(icon.name);
        return (
          <div
            key={icon.path}
            onClick={() =>
              onChange(
                isSel
                  ? selected.filter(n => n !== icon.name)
                  : [...selected, icon.name]
              )
            }
            className={
              `cursor-pointer p-2 border rounded-md transition ` +
              (isSel
                ? 'border-blue-500 bg-blue-50 shadow'
                : 'border-gray-200 hover:bg-gray-100')
            }
          >
            <img src={icon.path} width={40} height={40} alt={icon.name} />
            <div className="text-xs text-center">{icon.name}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Bed & Bathroom Details
          <span className="text-sm text-muted-foreground ml-2">
            Step 4 of 8
          </span>
        </h3>

        {/* Beds count */}
        <div className="border rounded-lg p-6 mb-6">
          <Label>Bedrooms</Label>
          <Controller
            name="bedsCount"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput value={value} onChange={onChange} />
            )}
          />

          {bedsCount > 0 && (
            <div className="mt-4">
              <Label>Select Bed Types</Label>
              {loadingBeds
                ? <p>Loading bed icons…</p>
                : <Controller
                  name="bedTypes"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { value, onChange } }) =>
                    renderIcons(bedIcons, value, onChange)
                  }
                />
              }
            </div>
          )}
        </div>

        {/* Bathrooms count */}
        <div className="border rounded-lg p-6 mb-6">
          <Label>Bathrooms</Label>
          <Controller
            name="bathroomsCount"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput value={value} onChange={onChange} />
            )}
          />

          {bathroomsCount > 0 && (
            <div className="mt-4">
              <Label>Select Bathroom Types</Label>
              {loadingBaths
                ? <p>Loading bathroom icons…</p>
                : <Controller
                  name="bathroomTypes"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { value, onChange } }) =>
                    renderIcons(bathroomIcons, value, onChange)
                  }
                />
              }
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="border rounded-lg p-6 mb-6 flex items-center justify-between">
          <Label>Guests</Label>
          <Controller
            name="guests"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput value={value} onChange={onChange} />
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext} variant="yes_no">Next</Button>
      </div>
    </div>
  );
}

interface Step5RoomTypesProps {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}

function Step5_RoomTypes({ control, onNext, onBack }: Step5RoomTypesProps) {
  // watch current roomTypes array
  const roomTypes: RoomType[] = useWatch({ control, name: 'roomTypes', defaultValue: [] });

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="mb-10">
        <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
          Accommodation Categories
          <span className="text-sm text-muted-foreground">Step 4 out of 8</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Available room or apartment types (comma-separated)
        </p>
      </div>

      <Controller
        name="roomTypes"
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => {
          // derive string tags for TagInput
          const tags = (value as RoomType[]).map(rt => rt.typeName);
          return (
            <TagInput
              tags={tags}
              onTagsChange={(newTags) => {
                const newRoomTypes: RoomType[] = newTags.map(tag => ({
                  id: generateId(),
                  typeName: tag,
                  status: 'class2',
                }));
                onChange(newRoomTypes);
              }}
              placeholder="e.g., Standard, Deluxe, Suite"
            />
          );
        }}
      />

      <div className="mt-auto flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="yes_no" onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

// Updated Step5_RoomsRating component
interface Step5Props {
  data: any;
  setData: (data: any) => void;
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}


interface Step5RoomsRatingProps {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}
interface RoomRating {
  id: string;
  title: string;
  color: string;
  secondary: string;
}

function Step5_RoomsRating({ control, onNext, onBack }: Step5RoomsRatingProps) {
  const { setValue } = useFormContext();
  // watch types and ratings
  const roomTypes: RoomType[] = useWatch({ control, name: 'roomTypes', defaultValue: [] });
  const ratingsObj: Record<string, number> = useWatch({ control, name: 'roomRatings', defaultValue: {} });

  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Define rating tiers
  const tiers: RoomRating[] = [
    { id: 'class1', title: 'Entry Level', color: '#2196f3', secondary: '#bbdefb' },
    { id: 'class2', title: 'Mid Range', color: '#4caf50', secondary: '#c8e6c9' },
    { id: 'class3', title: 'High End', color: '#ff9800', secondary: '#ffe082' },
  ];

  // Initialize missing ratings
  useEffect(() => {
    const newRatings = { ...ratingsObj };
    roomTypes.forEach(type => {
      if (newRatings[type.id] == null) {
        const idx = tiers.findIndex(r => r.id === type.status);
        newRatings[type.id] = idx + 1;
      }
    });
    setValue('roomRatings', newRatings);
  }, [roomTypes]);

  const openDialog = (rt: RoomType) => {
    setCurrentRoomType(rt);
    setDialogOpen(true);
  };

  const handleBulkSave = (updated: RoomType[]) => {
    setValue('roomTypes', updated);
    const newRatings = { ...ratingsObj };
    updated.forEach(t => {
      const idx = tiers.findIndex(r => r.id === t.status);
      newRatings[t.id] = idx + 1;
    });
    setValue('roomRatings', newRatings);
  };

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="mb-10">
        <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
          Room Ratings
          <span className="text-sm text-muted-foreground">Step 5 out of 8</span>
        </h3>
        <p className="text-sm text-muted-foreground">Rate your property's room types</p>
      </div>

      <div className="overflow-auto mb-6">
        {roomTypes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roomTypes.map(rt => (
              <div key={rt.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="font-medium select-none">{rt.typeName}</span>
                  <EditRoomTypePopup
                    roomType={rt}
                    onSave={updated => handleBulkSave(roomTypes.map(t => t.id === updated.id ? updated : t))}
                    ratings={tiers}
                  />
                </div>

                <Controller
                  name={`roomRatings.${rt.id}`}
                  control={control}
                  defaultValue={ratingsObj[rt.id] || tiers.findIndex(r => r.id === rt.status) + 1}
                  render={({ field: { value, onChange } }) => (
                    <RoomsRating
                      initialRating={value}
                      onRatingChange={onChange}
                      className="mx-1 select-none"
                      maxStars={3}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No room types added yet. Please add types first.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="flex gap-2">
          <EditPropertyTypesPopup
            roomTypes={roomTypes}
            onSave={handleBulkSave}
          />
          <Button
            variant="yes_no"
            onClick={onNext}
            disabled={roomTypes.length === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Single Rating Dialog */}
      {currentRoomType && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Rate {currentRoomType.typeName}</DialogTitle>
            </DialogHeader>

            <div className="py-6 flex justify-center">
              <Controller
                name={`roomRatings.${currentRoomType.id}`}
                control={control}
                defaultValue={ratingsObj[currentRoomType.id] || tiers.findIndex(r => r.id === currentRoomType.status) + 1}
                render={({ field: { value, onChange } }) => (
                  <RoomsRating
                    initialRating={value}
                    onRatingChange={onChange}
                    className="mx-1 select-none"
                    maxStars={3}
                  />
                )}
              />
            </div>

            <div className="text-center text-lg font-medium select-none">
              {(ratingsObj[currentRoomType.id] || tiers.findIndex(r => r.id === currentRoomType.status) + 1)} out of 3 trophies
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="yes_no">Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}



interface Step6Props {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}

function Step6({ control, onNext, onBack }: Step6Props) {
  // Watch nested facilities object
  const facilitiesObj = useWatch({
    control, name: 'facilities', defaultValue: {
      facilitiesCount: 0,
      selectedFacilities: {},
      otherFacilities: [],
    }
  });
  const { facilitiesCount, selectedFacilities, otherFacilities } = facilitiesObj;

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="mb-10">
        <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
          Property Facilities
          <span className="text-sm text-muted-foreground">Step 5 out of 8</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Does your property have any facilities?
        </p>
      </div>

      {/* Number of Facilities */}
      <div className="space-y-4 mb-6">
        <div className="border rounded-lg p-8 flex items-center gap-2 justify-between">
          <Label className="text-xl font-[520] pb-2">
            Number of Facilities
          </Label>
          <Controller
            name="facilities.facilitiesCount"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput value={value} onChange={onChange} />
            )}
          />
        </div>
      </div>

      {/* Detailed Facilities Options */}
      {facilitiesCount > 0 && (
        <div className="grid grid-cols-2 w-full gap-x-8 gap-y-4 mb-8">
          <p className="text-sm text-muted-foreground mb-1 col-span-2">
            Some facilities are built as native systems.
          </p>

          <Controller
            name="facilities.selectedFacilities"
            control={control}
            defaultValue={{}}
            render={({ field: { value, onChange } }) => (
              <>
                {['event_meeting_spaces', 'lounge_restaurants', 'spa', 'pool', 'gym', 'garden'].map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 w-full justify-between"
                  >
                    <Label htmlFor={id} className="text-medium font-[520] pb-2">
                      {id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Label>
                    <VeritasCheckbox
                      id={id}
                      checked={!!value[id]}
                      onCheckedChange={(checked: boolean) =>
                        onChange({ ...value, [id]: checked })
                      }
                    />
                  </div>
                ))}
              </>
            )}
          />

          <p className="text-sm text-muted-foreground mt-4 col-span-2">
            Specify other facilities (comma-separated values)
          </p>

          <Controller
            name="facilities.otherFacilities"
            control={control}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => (
              <TagInput
                className="col-span-2 w-full"
                tags={value}
                onTagsChange={onChange}
                placeholder="E.g. Sauna, Game Room..."
              />
            )}
          />
        </div>
      )}

      <div className="flex justify-between bottom-0">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="yes_no" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}


const AVAILABLE_VIEWS = [
  'North View', 'South View', 'East View', 'West View', 'Sunset View', 'Sunrise View',
  'Beach View', 'Mountain View', 'City View', 'Garden View', 'Courtyard View',
  'Street View', 'Ocean View', 'Lake View', 'Forest View', 'Park View',
  'Skyline View',
  'Pool View',
  'Golf Course View',
  'River View'
];
import {
  Eye, Mountain, CloudSun, Building, Trees, Waves, Compass,
  Activity,
  Flag
} from 'lucide-react';

const getViewIcon = (viewName: string) => {
  if (viewName.includes('Mountain')) return <Mountain size={20} />;
  if (viewName.includes('Sun')) return <CloudSun size={20} />;
  if (viewName.includes('Beach') || viewName.includes('Ocean') || viewName.includes('Lake') || viewName.includes('River')) return <Waves size={20} />;
  if (viewName.includes('City') || viewName.includes('Street') || viewName.includes('Skyline')) return <Building size={20} />;
  if (viewName.includes('Garden') || viewName.includes('Forest') || viewName.includes('Park') || viewName.includes('Courtyard')) return <Trees size={20} />;
  if (viewName.includes('North') || viewName.includes('South') || viewName.includes('East') || viewName.includes('West')) return <Compass size={20} />;
  if (viewName.includes('Pool')) return <Activity size={20} />;
  if (viewName.includes('Golf Course')) return <Flag size={20} />;
  return <Eye size={20} />;
};

interface ViewsStepProps {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}

// Helper function to create a unique array (as you cannot use Set iteration)
const getUniqueStrings = (arr: string[]): string[] => {
  const uniqueMap: { [key: string]: boolean } = {};
  const result: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!uniqueMap[item]) {
      uniqueMap[item] = true;
      result.push(item);
    }
  }
  return result;
};

function ViewsStep({ control, onNext, onBack }: ViewsStepProps) {
  const currentViews: string[] = useWatch({ control, name: 'views', defaultValue: [] });

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="mb-8">
        <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
          Properties Views
          <span className="text-sm text-muted-foreground">Step 6 out of 8</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Select common views from the options below or add your own custom views.
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Section for System Included Views (Cards with Icons) */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h4 className="text-base font-semibold text-gray-800 mb-3">Common Views</h4>
          {/* Changed from flex-wrap to grid for better card layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {AVAILABLE_VIEWS.map((view) => (
              <Controller
                key={view}
                name="views"
                control={control}
                render={({ field: { onChange } }) => {
                  const isSelected = currentViews.includes(view);
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          onChange(currentViews.filter(v => v !== view));
                        } else {
                          const newViews = currentViews.concat([view]);
                          onChange(getUniqueStrings(newViews));
                        }
                      }}
                      className={`
                        flex flex-col items-center justify-center text-center p-3 rounded-lg border-2
                        transition-all duration-200 ease-in-out h-24
                        ${isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-gray-50'}
                      `}
                    >
                      <div className="mb-1">
                         {getViewIcon(view)} {/* Render icon here */}
                      </div>
                      <span className="text-xs font-medium leading-tight">{view}</span>
                    </button>
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Section for Custom Views (Your Existing TagInput) */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 mb-2">Custom Views</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Type custom views, separated by commas or by pressing Enter.
          </p>
          <Controller
            name="views"
            control={control}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => {
              return (
                <TagInput
                  tags={value as string[]}
                  onTagsChange={(updatedTagsFromTagInput) => {
                    onChange(getUniqueStrings(updatedTagsFromTagInput));
                  }}
                  placeholder="e.g., Rare Art View, Private Lake Access"
                  className="w-full"
                />
              );
            }}
          />
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="yes_no" onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}



interface Step7Props {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
}


function Step7({ control, onNext, onBack }: Step7Props) {
  const { setValue } = useFormContext();

  // Watch images array field
  const images: File[] = useWatch({ control, name: 'images', defaultValue: [] });

  // Local preview URL state
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Update previews whenever images change
  useEffect(() => {
    const urls = images.map(img => URL.createObjectURL(img));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  // Handlers
  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setValue('images', [...images, ...newFiles], { shouldValidate: true, shouldDirty: true });
  };

  const removeImage = (index: number) => {
    const newImgs = images.filter((_, i) => i !== index);
    setValue('images', newImgs, { shouldValidate: true, shouldDirty: true });
    if (previewIndex !== null) {
      setPreviewIndex(prev => (prev! > index ? prev! - 1 : prev === index ? null : prev));
    }
  };

  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setPreviewIndex(idx => idx! > 0 ? idx! - 1 : previewUrls.length - 1); };
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setPreviewIndex(idx => idx! < previewUrls.length - 1 ? idx! + 1 : 0); };

  return (
    <div className="flex flex-col w-full h-full justify-between space-y-6">
      <div>
        <div className="mb-10">
          <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
            Add Property Photos
            <span className="text-sm text-muted-foreground">Step 7 out of 8</span>
          </h3>
          <p className="text-sm text-muted-foreground">Make the best impression with only some photos</p>
        </div>

        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition-colors duration-200">
          <div className="relative w-14 h-14 mb-2">
            <Image src="/icons/upload-file.png" alt="upload file" fill className="object-contain" priority />
          </div>
          <p className="text-sm mb-2">Drop your files here or click to upload</p>
          <input type="file" accept="image/*" multiple onChange={e => handleFilesChange(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>

        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Uploaded Images ({images.length})</h4>
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-full h-28 cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:ring-2 hover:ring-blue-400" onClick={() => setPreviewIndex(idx)}>
                  <img src={url} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                  <button onClick={e => { e.stopPropagation(); removeImage(idx); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100">&times;</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="yes_no" onClick={onNext} disabled={images.length === 0}>Next</Button>
      </div>

      {previewIndex !== null && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90" onClick={() => setPreviewIndex(null)}>
            {previewUrls.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all" onClick={prevImage}>&larr;</button>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all" onClick={nextImage}>&rarr;</button>
              </>
            )}
            <div className="relative max-w-[90vw] max-h-[80vh]">
              <img src={previewUrls[previewIndex]} alt="Preview" className="max-w-[90vw] max-h-[80vh] object-contain" onClick={e => e.stopPropagation()} />
            </div>
            <button onClick={() => setPreviewIndex(null)} className="absolute top-4 right-4 text-white text-4xl font-bold z-50 hover:text-gray-300 transition-colors">&times;</button>
            {previewUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className={`w-12 h-12 cursor-pointer border-2 rounded transition-all ${idx === previewIndex ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`} onClick={e => { e.stopPropagation(); setPreviewIndex(idx); }}>
                    <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}


interface Step8Props {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

function Step8({ control, onNext, onBack, onSubmit }: Step8Props) {
  // Watch nested additionalInfo object
  const additional = useWatch({
    control,
    name: 'additionalInfo',
    defaultValue: {
      propertyRating: 0,
      parkingSpaces: 0,
      extraAreasCount: 0,
      extraAreasList: [] as string[],
    },
  });
  const { propertyRating, parkingSpaces, extraAreasCount, extraAreasList } = additional;

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="mb-10">
        <h3 className="text-xl font-[520] flex items-center gap-2 justify-between">
          Additional Information
          <span className="text-sm text-muted-foreground">Step 8 out of 8</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Final details about your property
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {/* Rating */}
        <div className="border rounded-lg p-8 flex flex-col items-center gap-2">
          <Label className="text-xl font-[520] pb-2">Property Rating</Label>
          <Controller
            name="propertyRating"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <Rating
                className="w-10 h-10"
                initialRating={value}
                onRatingChange={onChange}
              />
            )}
          />
        </div>

        {/* Parking */}
        <div className="border rounded-lg p-8 flex items-center gap-2 justify-between">
          <Label className="text-xl font-[520] pb-2">Parking Spaces</Label>
          <Controller
            name="additionalInfo.parkingSpaces"
            control={control}
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput value={value} onChange={onChange} />
            )}
          />
        </div>

        {/* Extra Areas */}
        <div className="border rounded-lg p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <Label className="text-xl font-[520] pb-2">Extra Areas</Label>
            <Controller
              name="additionalInfo.extraAreasCount"
              control={control}
              defaultValue={0}
              render={({ field: { value, onChange } }) => (
                <NumberInput value={value} onChange={onChange} />
              )}
            />
          </div>

          {extraAreasCount > 0 && (
            <div className="mt-4 w-full">
              <Label className="text-lg font-[520] mb-2">Specify Extra Areas</Label>
              <Controller
                name="additionalInfo.extraAreasList"
                control={control}
                defaultValue={[]}
                render={({ field: { value, onChange } }) => (
                  <TagInput
                    tags={value}
                    onTagsChange={onChange}
                    placeholder="E.g. Rooftop, Garden, Terrace"
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="yes_no" onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
}

function Step9({
  control,
  onNext,
  onBack,
  onViewResponse,
}: {
  control: Control<any>;
  onNext: () => void;
  onBack: () => void;
  onViewResponse: () => void;
}) {
  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="flex flex-col justify-center items-center mb-8">
        <div className="relative w-[500px] h-[350px] mb-4">
          <Image
            src="/property-icons/hat-confetti.jpg"
            alt="upload file"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h3 className="text-2xl font-[600]">Congratulations on Adding Your Property!</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">Thank you for entrusting us with your property. Get ready for a journey filled with new connections, incredible experiences, and the joy of hosting guests from around the world.</p>
        <Button variant="outline" onClick={onViewResponse} className="mt-4">View Responses</Button>
      </div>
      <div className="flex justify-end">
        <Button variant="yes_no" onClick={onNext}>Close</Button>
      </div>
    </div>
  );
}

function Step10({
  data,
  setData,
  onBack,
  onClose,
}: {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onBack: () => void;
  onClose: () => void;
}) {
  const handleTogglePropertyType = (type: 'single' | 'multi') => {
    setData((prev: any) => ({
      ...prev,
      propertyType: prev.propertyType === type ? null : type
    }));
  };

  const handleNumberInputChange = (value: number, field: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setData((prev: any) => {
      const newSelectedFacilities = { ...prev.selectedFacilities, [id]: checked };
      return { ...prev, selectedFacilities: newSelectedFacilities };
    });
  };

  const handleTagInputChange = (tags: string[]) => {
    setData((prev: any) => ({ ...prev, otherFacilities: tags }));
  };

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="space-y-6 overflow-y-auto pr-4">
        <h3 className="text-2xl font-bold mb-4">Your Property Data</h3>

        {/* Property Type Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Property Type</h4>
          <div className="flex flex-col gap-4">
            <PropertyToggleCard
              title="Single unit property"
              subtitle="Rented as a single independent entity"
              selected={data.propertyType === 'single'}
              onToggle={() => handleTogglePropertyType('single')}
            />
            <PropertyToggleCard
              title="Multi unit property"
              subtitle="Divided into multiple independent entities"
              selected={data.propertyType === 'multi'}
              onToggle={() => handleTogglePropertyType('multi')}
            />
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Basic Information</h4>
          <div className="space-y-4">
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Bedrooms</Label>
              <NumberInput
                value={data.bedrooms || 0}
                onChange={(val) => handleNumberInputChange(val, 'bedrooms')}
              />
            </div>
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Apartments</Label>
              <NumberInput
                value={data.apartments || 0}
                onChange={(val) => handleNumberInputChange(val, 'apartments')}
              />
            </div>
          </div>
        </div>

        {/* Bed & Bath Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Bed & Bath</h4>
          <div className="space-y-4">
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Beds</Label>
              <NumberInput
                value={data.bedsCount || 0}
                onChange={(val) => handleNumberInputChange(val, 'beds')}
              />
            </div>
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Bathrooms</Label>
              <NumberInput
                value={data.bathroomsCount || 0}
                onChange={(val) => handleNumberInputChange(val, 'bathrooms')}
              />
            </div>
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Guests</Label>
              <NumberInput
                value={data.guests || 0}
                onChange={(val) => handleNumberInputChange(val, 'guests')}
              />
            </div>
          </div>
        </div>

        {/* Room Types Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Room Types</h4>
          {data.roomTypes?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.roomTypes.map((type: RoomType, idx: number) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {type.typeName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No room types specified</p>
          )}
        </div>

        {/* Facilities Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Facilities</h4>
          <div className="space-y-4">
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Number of Facilities</Label>
              <NumberInput
                value={data.facilities || 0}
                onChange={(val) => handleNumberInputChange(val, 'facilities')}
              />
            </div>

            {data.facilities > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(data.selectedFacilities || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <VeritasCheckbox
                      id={key}
                      checked={!!value}
                      onCheckedChange={(checked: boolean) => handleCheckboxChange(key, checked)}
                    />
                    <Label htmlFor={key} className="font-medium">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                ))}

                <div className="col-span-2 mt-4">
                  <Label className="font-medium">Other Facilities</Label>
                  <TagInput
                    tags={data.otherFacilities || []}
                    onTagsChange={handleTagInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Property Images ({data.images?.length || 0})</h4>
          {data.images?.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {data.images.map((image: File, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property Image ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No images added</p>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="border rounded-lg p-6">
          <h4 className="text-xl font-[520] mb-4">Additional Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Parking Spaces</Label>
              <NumberInput
                value={data.parkings || 0}
                onChange={(val) => handleNumberInputChange(val, 'parkings')}
              />
            </div>
            <div className="border rounded-lg p-6 flex items-center justify-between">
              <Label className='text-xl font-[520]'>Extra Areas</Label>
              <NumberInput
                value={data.extraAreas || 0}
                onChange={(val) => handleNumberInputChange(val, 'extraAreas')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="yes_no" onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import useFormContext if not already imported
import { CreatePropertyInterface } from "@/interfaces/property.interface"; // Import your interface

// interface CreatePropertyListingPopupProps {
//     formControl: Control<CreatePropertyInterface>;
// }

// export default function CreatePropertyListingPopup({ formControl }: CreatePropertyListingPopupProps) {
//     const [step, setStep] = useState(1);
//     const [open, setOpen] = useState(false);
//     const next = () => setStep(s => s + 1);
//     const back = () => setStep(s => s - 1);

//     const closePopup = () => {
//         setOpen(false);
//         setStep(1);
//     };

//     const viewResponse = () => { setStep(11) };

//     const submit = () => {
//         next();
//         toast.success("Property added successfully!");
//     };

//     return (

export default function CreatePropertyListingPopup() {
  const { control: formControl } = useFormContext<CreatePropertyInterface>();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const closePopup = () => {
    setOpen(false);
    setStep(1);
  };
  const viewResponse = () => setStep(11);

  const submit = () => {
    next();
    toast.success("Property added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <HiOutlinePlus /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-[100vh] max-w-8xl p-0 overflow-hidden rounded-none" style={{ borderRadius: '0px' }}>
        <div className="relative bg-white bg-opacity-90 h-full flex flex-col">
          <DialogHeader className="p-6">
            <DialogTitle>Create Property Listing</DialogTitle>
          </DialogHeader>
          <div className="absolute top-20 w-full h-[420px]">
            <Image
              src="/images/backgrounds/multistep-bg.png"
              alt="Multi-step background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex-1 overflow-y-auto mt-4 p-10 z-10 bg-white rounded-lg shadow-xl w-[45%] max-h-[90vh] overflow-y-scroll ">

            {{
              1: <Step1 onNext={next} />,
              2: <Step2
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              3: <Step3
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              4: <Step4
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              5: <Step5_RoomTypes
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              6: <Step5_RoomsRating
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              7: <Step6
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              8: <ViewsStep
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              9: <Step7
                control={formControl}
                onNext={next}
                onBack={back}
              />,
              10: <Step8
                control={formControl}
                onNext={next}
                onBack={back}
                onSubmit={submit}
              />,
              11: <Step9
                control={formControl}
                onNext={closePopup}
                onBack={back}
                onViewResponse={viewResponse}
              />,
              // 5: <Step10
              //     data={currentFormData}

              //     onBack={back}
              //     onClose={closePopup}
              // />
            }[step]}

          </div>
          <DialogFooter className='p-6'>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
