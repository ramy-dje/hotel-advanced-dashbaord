"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useMemo } from "react"; // Import useEffect, useMemo
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

// --- Zod Schema (re-defined here for self-containment, but ideally imported from its own file) ---
import { z } from "zod";

/**
 * Defines the validation schema for creating a new house accommodation feature.
 * @property {string} name - The name of the feature (e.g., "Swimming Pool", "Balcony"). Must be at least 1 character long.
 * @property {string} icon - The path to the icon image representing the feature (e.g., "/icons/pool.svg"). Must be a non-empty string.
 * @property {"room" | "apartment" | "facility"} accommodationType - The type of accommodation this feature applies to.
 * Must be one of "room", "apartment", or "facility".
 */
export const CreateHouseFeatureValidationSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  icon: z.string().min(1, "Feature icon is required"),
  accommodationType: z.enum(["room", "apartment", "facility"], {
    errorMap: () => ({ message: "Please select an accommodation type" }),
  }),
});

/**
 * TypeScript type inferred from the CreateHouseFeatureValidationSchema.
 * This type defines the expected shape of data when creating a house feature.
 */
export type CreateHouseFeatureValidationSchemaType = z.infer<typeof CreateHouseFeatureValidationSchema>;
// --- End Zod Schema ---

// --- InlineAlert Component (for self-containment) ---
interface InlineAlertProps {
  type: "error" | "info" | "success";
  children: React.ReactNode;
}

const InlineAlert: React.FC<InlineAlertProps> = ({ type, children }) => {
  let bgColorClass = "";
  let textColorClass = "";
  switch (type) {
    case "error":
      bgColorClass = "bg-red-100";
      textColorClass = "text-red-700";
      break;
    case "info":
      bgColorClass = "bg-blue-100";
      textColorClass = "text-blue-700";
      break;
    case "success":
      bgColorClass = "bg-green-100";
      textColorClass = "text-green-700";
      break;
    default:
      bgColorClass = "bg-gray-100";
      textColorClass = "text-gray-700";
  }

  return (
    <div
      className={`p-2 rounded-md text-sm ${bgColorClass} ${textColorClass}`}
      role="alert"
    >
      {children}
    </div>
  );
};
// --- End InlineAlert Component ---

// Mock CRUD function for creating a house feature (replace with your actual backend call)
interface HouseFeature {
  id: string;
  name: string;
  icon: string;
  accommodationType: string;
}

const crud_create_houseFeature = async (
  name: string,
  icon: string,
  accommodationType: string
): Promise<HouseFeature | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a conflict
      if (name.toLowerCase() === "balcony" && accommodationType === "room") {
        reject(409); // Conflict error
      } else {
        const newFeature: HouseFeature = {
          id: `feature-${Date.now()}`,
          name,
          icon,
          accommodationType,
        };
        resolve(newFeature);
      }
    }, 1000); // Simulate network delay
  });
};

// Mock store for house features (replace with your actual store or remove if not needed)
const useHouseFeaturesStore = () => {
  // This is a placeholder. In a real app, you'd integrate with your global state management.
  const add_feature = (feature: HouseFeature) => {
    console.log("Adding feature to store:", feature);
    // e.g., update a Zustand/Redux store here
  };
  return { add_feature };
};

// Helper function to derive icon name from path
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

// Mock list of available icon paths (simulate fetching from 'public/house-features-icons')
// In a real application, this would be fetched from an API endpoint
// that lists files in your 'public/house-features-icons' directory.
const MOCK_ICON_PATHS = [
  "/house-features-icons/air-conditioner.svg",
  "/house-features-icons/bath.svg",
  "/house-features-icons/bed.svg",
  "/house-features-icons/breakfast.svg",
  "/house-features-icons/crib.svg",
  "/house-features-icons/hair-dryer.svg",
  "/house-features-icons/kettle.svg",
  "/house-features-icons/laundry-machine.svg",
  "/house-features-icons/maximize.svg",
  "/house-features-icons/refrigerator.svg",
  "/house-features-icons/serving-dish.svg",
  "/house-features-icons/shampoo.svg",
  "/house-features-icons/strongbox.svg",
  "/house-features-icons/television.svg",
  "/house-features-icons/towel-01.svg",
  "/house-features-icons/user.svg",
  "/house-features-icons/weights.svg",
  "/house-features-icons/wifi-signal.svg",

  // Existing mock paths
  // "/house-features-icons/pool.svg",
  // "/house-features-icons/wifi.svg",
  // "/house-features-icons/parking.svg",
  // "/house-features-icons/ac.svg",
  // "/house-features-icons/heating.svg",
  // "/house-features-icons/balcony.svg",
  // "/house-features-icons/kitchen.svg",
  // "/house-features-icons/gym.svg",
  // "/house-features-icons/pet-friendly.svg",
  // "/house-features-icons/garden.svg",
  // "/house-features-icons/tv.svg",
  // "/house-features-icons/washing-machine.svg",
  // "/house-features-icons/elevator.svg",
  // "/house-features-icons/concierge.svg",
  // "/house-features-icons/restaurant.svg",
  // "/house-features-icons/spa.svg",
  // "/house-features-icons/meeting-room.svg",
  // "/house-features-icons/playground.svg",
  // "/house-features-icons/barbecue.svg",
  // "/house-features-icons/fireplace.svg",
  // "/house-features-icons/hot-tub.svg",
  // "/house-features-icons/private-beach.svg",
  // "/house-features-icons/valet-parking.svg",
  // "/house-features-icons/security.svg",

  // // Mock additional icons
  // ...Array.from({ length: 50 }, (_, i) => `/house-features-icons/icon-${i + 1}.svg`),
];



interface Props {} // Keep interface Props if it's used elsewhere for consistency

export default function CreateHouseFeaturePopup({}: Props) {
  // house features store hook
  const { add_feature } = useHouseFeaturesStore();

  const {
    handleSubmit,
    register,
    reset,
    setValue, // Added setValue to programmatically set form values
    watch, // Added watch to observe form values
    formState: { errors },
  } = useForm<CreateHouseFeatureValidationSchemaType>({
    resolver: zodResolver(CreateHouseFeatureValidationSchema),
    defaultValues: {
      name: "",
      icon: "",
      accommodationType: undefined, // Initialize with undefined for proper validation
    },
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [iconDialogOpen, setIconDialogOpen] = useState(false); // State for the icon selection dialog
  const [iconSearchTerm, setIconSearchTerm] = useState(""); // State for icon search input

  const [iconList, setIconList] = useState<{ path: string; name: string }[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(true);

  // Simulate fetching icon paths from a "backend"
  useEffect(() => {
    setIsLoadingIcons(true);
    // In a real app, you would fetch from an API endpoint like '/api/icons'
    setTimeout(() => {
      const formattedIcons = MOCK_ICON_PATHS.map(path => ({
        path,
        name: getIconDisplayName(path),
      }));
      setIconList(formattedIcons);
      setIsLoadingIcons(false);
    }, 1500); // Simulate network delay
  }, []);

  // Filter icons based on search term
  const filteredIconList = useMemo(() => {
    if (!iconSearchTerm) {
      return iconList;
    }
    const lowercasedSearchTerm = iconSearchTerm.toLowerCase();
    return iconList.filter(icon =>
      icon.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [iconList, iconSearchTerm]);

  // Watch for changes in accommodationType and icon to display them
  const selectedAccommodation = watch("accommodationType");
  const selectedIconPath = watch("icon");

  const handleCreate = async (data: CreateHouseFeatureValidationSchemaType) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await crud_create_houseFeature(
        data.name,
        data.icon,
        data.accommodationType
      );
      // add the new feature to the store
      if (res) {
        add_feature(res);
      }
      // closing the dialog
      setOpen(false);
      // resetting the form
      reset({ name: "", icon: "", accommodationType: undefined });
      // adding a toast
      toast.success("Feature Was Created Successfully!");
    } catch (err) {
      if (err === 409) {
        setError("This feature name already exists for this accommodation type. Please try another one.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 font-normal w-1/2 md:w-auto">
            {/* Replaced HiOutlinePlus with inline SVG for self-containment */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New House Feature
          </Button>
        </DialogTrigger>
        <DialogContent
          preventOutsideClose={isLoading}
          closeButtonDisabled={isLoading}
          className="max-h-[30em] overflow-y-auto" // Increased max-height for grid display
          onEscapeKeyDown={
            isLoading
              ? (e) => {
                  e.preventDefault();
                }
              : undefined
          }
        >
          <div className="w-full h-full">
            <form
              spellCheck={false}
              onSubmit={handleSubmit(handleCreate)}
              className="h-full flex flex-col gap-6 justify-between"
            >
              <DialogHeader>
                <DialogTitle>Create New House Accommodation Feature</DialogTitle>
              </DialogHeader>
              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col md:flex-row md:gap-4">
                  {/* Feature Name */}
                  <div className="grid gap-2 flex-1"> {/* flex-1 allows it to take available space */}
                    <Label htmlFor="featureName">Feature Name</Label>
                    <Input
                      disabled={isLoading}
                      id="featureName"
                      placeholder="e.g., Swimming Pool, WiFi"
                      {...register("name", { required: true })}
                    />
                    {errors?.name ? (
                      <InlineAlert type="error">{errors.name.message}</InlineAlert>
                    ) : null}
                  </div>

                  {/* Icon Selection Trigger */}
                  <div className="grid gap-2 flex-1 mt-4 md:mt-0">
                    <Label htmlFor="featureIcon">Feature Icon</Label>
                    <div
                      className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors h-12" // Fixed height for consistency
                      onClick={() => setIconDialogOpen(true)} // Opens the icon selection dialog
                    >
                      {selectedIconPath ? (
                        <img
                          src={selectedIconPath}
                          alt="Selected Icon"
                          width={30}
                          height={30}
                          className="rounded-sm"
                        />
                      ) : (
                        <span className="text-gray-500">Click to Select Icon</span>
                      )}
                      <span className="text-sm text-gray-700">
                        {selectedIconPath ? getIconDisplayName(selectedIconPath) : ""}
                      </span>
                    </div>
                    {errors?.icon ? (
                      <InlineAlert type="error">{errors.icon.message}</InlineAlert>
                    ) : null}
                  </div>
                </div>

                {/* Accommodation Type Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="accommodationType">Applies To Accommodation Type</Label>
                  <Select
                    value={selectedAccommodation}
                    onValueChange={(value) => setValue("accommodationType", value as "room" | "apartment" | "facility", { shouldValidate: true })}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="accommodationType" className="w-full">
                      <SelectValue placeholder="Choose Accommodation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.accommodationType ? (
                    <InlineAlert type="error">{errors.accommodationType.message}</InlineAlert>
                  ) : null}
                </div>

                {/* The creation error */}
                {error ? <InlineAlert type="error">{error}</InlineAlert> : null}
              </div>

              {/* The footer */}
              <DialogFooter className="justify-end">
                <DialogClose asChild>
                  <Button
                    className="w-[6em]"
                    disabled={isLoading}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="w-[6em]"
                  disabled={isLoading}
                  isLoading={isLoading}
                  type="submit"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Dialog for Icon Selection Grid */}
      <Dialog open={iconDialogOpen} onOpenChange={setIconDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-11/12 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select an Icon</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Search icons..."
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          {isLoadingIcons ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading icons...</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 p-2">
              {filteredIconList.length > 0 ? (
                filteredIconList.map((icon) => (
                  <div
                    key={icon.path}
                    onClick={() => {
                      setValue("icon", icon.path, { shouldValidate: true });
                      setIconDialogOpen(false); // Close dialog on selection
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer
                                hover:bg-gray-100 transition-colors
                                ${selectedIconPath === icon.path ? "border-2 border-blue-500 bg-blue-50" : "border border-transparent"}`}
                  >
                    <img
                      src={icon.path}
                      alt={icon.name}
                      width={30}
                      height={30}
                      className="rounded-sm"
                    />
                    <span className="text-xs text-gray-500 text-center mt-1">
                      {icon.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600 p-4">
                  No icons found for "{iconSearchTerm}".
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIconDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

