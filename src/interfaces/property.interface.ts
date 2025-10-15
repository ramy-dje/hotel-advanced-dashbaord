import PropertyDirectoryInterface from "./property-directory.interface";
import PropertyTypeInterface from "./property-type.interface";

export default interface PropertyInterface {
  id: string;
  code: string;
  slug: string;
  rating?: number; // Existing rating field
  details?: {
    totalBlocksWithRooms?: number;
    totalRooms?: number;
    // Add other details you might want to show in tooltips
  };
  roomClassification?: string; // Or a more specific type if it's an enum or object
  isOutOfOrder?: boolean;
  isOutOfService?: boolean;
  location_country: string;
  contact?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  location_state: string;
  blocks: Block[];
  propertyName: string;
  propertyOwner: string;
  directory: PropertyDirectoryInterface;
  bio?: string;
  imageGallery?: File[];
  videoText?: string;
  videoExternalLink?: string;
  videoFile?: File;
  video360?: string;
  streetAddress: string;
  addressLabel?: string;
  city: string;
  zipCode: number;
  gmapAddress?: string;
  surfaceValue?: number;
  surfaceUnit?: string;
  carPark?: boolean;
  energyClass?: EnergyClass[];
  floorPlan?: File;
  createdAt: string | Date;
  updatedAt: string | Date;
  addType: PropertyTypeInterface;
  surfaceArea: {
    value: number;
    unit: 'sqm' | string;
  };
  video?: {
    text?: string;
    externalLink?: string;
    file?: File;
  };
  features?: Feature[];
  views?: string[];
  houseViewsText?: string;
  housePolicies?: HousePolicy[];
  nearbyLocations?: NearbyLocation[];
  houseSettings?: HouseSettings;
  houseRules?: HouseRules;

  // --- START: Fields from Multi-step Popup (Added to PropertyInterface) ---
  unitType?: "single" | "multi"; // "single unit" or "multi unit"
  rooms?: number; // Number of rooms
  apartments?: number; // Number of apartments
  bedsCount?: number; // Number of beds
  bedTypes?: string[]; // Array of bed types (strings)
  bathroomsCount?: number; // Number of bathrooms
  bathroomTypes?: string[]; // Array of bathroom types (strings)
  guests?: number; // Guests number
  accommodationCategories?: { id: string; name: string; status: boolean; }[]; // Array of objects
  facilities?: {
    facilitiesCount: number;
    selectedFacilities: {pool: boolean; gym: boolean; spa: boolean; event_meeting_spaces: boolean; garden: boolean; lounge_restaurants: boolean;};
    otherFacilities:string[]
  };
  additionalInfo?:{
    parkingSpaces: number; // Number of parking spaces
    extraAreasCount: number; // Number of extra areas
    extraAreaNames: string[]; // Array of extra area names (strings)
  }
  propertyRating?: number; // Property rating out of 5 (if different from existing 'rating' field, clarify which to use or if they're related)
  roomTypes?: RoomTypes[]; // Array of room types (strings)
  roomRatings: Record<string, number>; 

  // --- END: Fields from Multi-step Popup ---
}

export interface HouseSettings {
  houseSearchParams?: {
    daysAdvance: {
      value: number;
      unit: string;
    };
    maxFuture: {
      value: number;
      unit: string;
    };
    minNights: number;
    maxNights: number;
    minRooms: number;
    maxRooms: number;
    adultsFrom: number;
    adultsTo: number;
    childrenFrom: number;
    childrenTo: number;
    closingFrom: string;
    closingTo: string;
    closingReason: string;
    closingTypes: string[];
    modificationMode: string;
  };
}


export interface HousePolicy {
  policyName: string;
  policyDescription: string;
}
export interface HouseRules {
  quietHours?: {
    start?: string;
    end?: string;
  };
  noParties?: boolean;
  smokingAllowed?: boolean;
  smokingAreas?: string; // Conditional
  petsAllowed?: boolean;
  petConditions?: string; // Conditional
  visitorsAllowed?: boolean;
  visitorHours?: string; // Conditional

  // Booking Policies
  loginRequired?: boolean;
  extraServices?: boolean;

  // Cleanliness
  guestResponsibilities?: string;
  cleaningFee?: "none" | "fixed" | "percentage";
  reportDamages?: boolean;

  // Utilities
  wifiGuidelines?: string;
  applianceRules?: string;
  sharedSpaceRules?: string;
  climateControlRules?: string;

  // Security
  accessInstructions?: string;
  lockingPolicy?: "required" | "optional";
  noUnauthorizedAccess?: boolean;
  childEquipment?: string;

  // Family & Children
  childFriendly?: boolean;
  childAgeRestrictions?: string; // Conditional
  babyEquipment?: string;
  childproofing?: "none" | "basic" | "full";
}

export interface CreatePropertyInterface {
  propertyName: string;
  propertyOwner: string;
  blocks: Block[];
  features?: Feature[];
  views?: string[];
  houseViewsText?: string;
  nearbyLocations?: NearbyLocation[];
  location_country: string;
  location_state: string;
  directory?: PropertyDirectoryInterface;
  houseSettings?: HouseSettings;
  rating?: number; // Existing rating field
  code: string;
  bio?: string;
  imageGallery?: File[];
  videoText?: string;
  videoExternalLink?: string;
  videoFile?: File;
  video360?: string;
  streetAddress: string;
  addressLabel?: string;
  city: string;
  zipCode?: string;
  gmapAddress?: string;
  addType?: {
    name: string;
    id: string;
  };
  surfaceValue?: number;
  surfaceUnit?: string;
  carPark?: boolean;
  energyClass?: EnergyClass[];
  floorPlan?: File;
  slug?: string; // Made optional as it's often generated on creation
  houseRules?: HouseRules;
  housePolicies?: HousePolicy[];
  assessmentYear?: number;
  coolingSystemType?: string;
  insulationQuality?: "Good" | "Moderate" | "Poor";
  ventilationSystem?: "Natural" | "Mechanical" | "MVHR";
  co2Emissions?: string;
  certificateNumber?: string;
  certificateExpiryDate?: string;
  epcReportFile?: File | null;
  recommendations?: string;

  // --- START: Fields from Multi-step Popup (Added to CreatePropertyInterface) ---
  propertySpecificType?: "single" | "multi";
  rooms?: number;
  apartments?: number;
  bedsCount?: number;
  bedTypes?: string[];
  bathroomsCount?: number;
  bathroomTypes?: string[];
  guests?: number;
  accommodationCategories?: { id: string; name: string; status: boolean; }[];
  facilities?: {
    facilitiesCount: number;
    selectedFacilities: {pool: boolean; gym: boolean; spa: boolean; event_meeting_spaces: boolean; garden: boolean; lounge_restaurants: boolean;};
    otherFacilities: string[]
  };
  additionalInfo?:{
    parkingSpaces: number; // Number of parking spaces
    extraAreasCount: number; // Number of extra areas
    extraAreaNames: string[]; // Array of extra area names (strings)
  }
  facilityTypes?: string[];
  propertyRating?: number;
  roomTypes?: RoomTypes[];
  roomRatings: Record<string, number>; 
}
export interface RoomTypes {
  id: string; // Unique identifier for the room type
  typeName: string; // Name of the room type (e.g., "Deluxe", "Standard")
  status: string;
}

export interface Feature {
  key: string;
  value: string;
}

export interface ViewItem {
  key: string;
  value: string;
}

export interface NearbyLocation {
  label: string;
  distance: string;
  coordinates: { lat: number; lng: number } | null;
}

export interface Section {
  name: string;
  roomFrom: number;
  roomTo: number;
}

export interface Facility {
  name: string;
  sectionName: string;
}
export interface Room {
  sectionName: string;
  number: number;
}
export interface Elevator {
  name: string;
  sectionName: string;
}
export interface ExtraArea {
  name?: string;
  usedFor?: string;
}
export interface AdditionalFeature {
  name: string;
}

export interface Floor {
  name: string;
  level: number;
  hasRooms: boolean;
  rooms?: Room[];
  roomFrom?: number;
  roomTo?: number;
  energyClass?: EnergyClass[];
  sections?: Section[];
  hasFacilities?: boolean;
  facilities?: Facility[];
  elevators?: Elevator[];
  surfaceArea?: number;
  surfaceUnit?: "sqm" | "sqft";
  AdditionalFeatures?: AdditionalFeature[];
  ExtraAreas?: ExtraArea[];
  side?: "N" | "S" | "E" | "W";
}

export interface Block {
  block_name: string;
  hasRooms?: boolean;
  hasFacilities?: boolean;
  description?: string;
  floors: Floor[];
}

export type EnergyClass =
  | 'A+++'
  | 'A++'
  | 'A+'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G';
