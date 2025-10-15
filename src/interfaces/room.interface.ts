import { FileDetails } from "./file-manager";

// the room interface
export default interface RoomInterface {
  images_gallery: FileDetails[];
  // main image
  images_main: FileDetails | string;
  // room title
  title: string;
  // deleted
  deleted?: boolean;
  // room description
  description: string;
  // room size
  size: number;
  // room code
  code: string;
  // seo
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
  // capacity of the room
  capacity: {
    total: number;
    adults: number;
    children: number;
  };
  beds: { name: string; id: string }[]; // Note: This might need adjustment if beds is meant to be bedrooms from Zod schema
  bedsCount: number;
  createdAt: string | Date; // IOS Date
  id: string;
}

// lightweight rooms interface
export interface LightweightRoomInterface {
  code: string;
  title: string;
  category: string;
  deleted: boolean;
  createdAt: string | Date; // IOS Date
  id: string;
}
type Unit = "sqm" | "sqft";

// The interface matching your Zod schema
export interface CreateRoomInterface {
  propertyCode: string;
  propertyName: string;
  accommodation: string;
  type: string;
  roomCode: string;
  description: string;
  size: {
    value: number;
    unit: Unit;
  };
  bedsCount: number;
  bedroomsCount: number;
  bedrooms: {
    type: string;
    count: number;
  }[];
  bathroomsCount: number;
  capacity: {
    adults: number;
    children: number;
  };
  sittingAreas: number;
  kitchens: number;
  extraBeds: number;
  extraBedFee: number;
  amenities?: string[]; // Optional in Zod
  additionalFeatures?: string[]; // Optional in Zod
  suitableFor?: string[]; // Optional in Zod
  accessibleRoom: boolean;
  connectingRooms: boolean;
  balcony: boolean;
  configuration: string;
  rateCode: string;

  // --- NEW FIELD TO MATCH ZOD SCHEMA ---
  roomPricing: {
    type: string;
    views?: string[]; // Matches Zod's optional()
    smoking: boolean;
    petFriendly: boolean;
    rateCode: string;
  }[];

  frequentlyBoughtTogether?: string[]; // Optional in Zod
  policies: {
    smokingArea: boolean;
    petsAllowed: boolean;
    damageFees?: string[]; // Optional in Zod
    dipositFees?: string[]; // Optional in Zod
    minimumNightStay: number;
    includes?: {
      title?: string; // Optional in Zod
      description?: string; // Optional in Zod
    }[];
    guidlines?: { // Made optional in Zod
      title?: string; // Optional in Zod
      description?: string; // Optional in Zod
    }[];
    restrictions?: { // Made optional in Zod
      title?: string; // Optional in Zod
      description?: string; // Optional in Zod
    }[];
  };
  seo: {
    description: string;
    title: string;
    keywords: string[];
    slug: string;
  };
}

// the reservable room interface
export interface ReservableRoomInterface {
  id: string;
  code: string;
  title: string;
  deleted: boolean;
  images_main: string;
  reservations: number;
  floors: {
    id: string;
    name: string;
    level: number;
    rooms_number: number;
    range_start: number;
    range_end: number;
  }[];
}





// import { FileDetails } from "./file-manager";

// // the room interface
// export default interface RoomInterface {
//   images_gallery: FileDetails[];
//   // main image
//   images_main: FileDetails | string;
//   // room title
//   title: string;
//   // deleted
//   deleted?: boolean;
//   // room description
//   description: string;
//   // room size
//   size: number;
//   // room code
//   code: string;
//   // seo
//   seo: {
//     title: string;
//     description: string;
//     keywords: string[];
//     slug: string;
//   };
//   // capacity of the room
//   capacity: {
//     total: number;
//     adults: number;
//     children: number;
//   };
//   beds: { name: string; id: string }[];
//   bedsCount: number;
//   createdAt: string | Date; // IOS Date
//   id: string;
// }

// // lightweight rooms interface
// export interface LightweightRoomInterface {
//   code: string;
//   title: string;
//   category: string;
//   deleted: boolean;
//   createdAt: string | Date; // IOS Date
//   id: string;
// }
// type Unit = "sqm" | "sqft";
// // the create room interface
// export interface CreateRoomInterface {
//   propertyCode: string;
//   propertyName: string;
//   accommodation: string;
//   type: string;
//   roomCode: string;
//   description: string;
//   size: {
//     value: number;
//     unit: Unit;
//   };
//   bedsCount: number;
//   bedroomsCount: number;
//   bedrooms:{
//     type: string;
//     count: number;
//   }[];
//   bathroomsCount: number;
//   capacity: {
//     adults: number,
//     children: number
//   };
//   sittingAreas: number;
//   kitchens: number;
//   extraBeds: number;
//   extraBedFee: number;
//   amenities: string[];
//   additionalFeatures: string[];
//   suitableFor: string[];
//   accessibleRoom: boolean;
//   connectingRooms: boolean;
//   balcony: boolean;
//   configuration: string;
//   rateCode: string;
//   frequentlyBoughtTogether: string[];
//   policies?:{
//     smokingArea: boolean;
//     petsAllowed: boolean;
//     damageFees: string[];
//     dipositFees: string[];
//     minimumNightStay: number;
//     includes?: {
//       title: string;
//       description: string;
//     }[];
//     guidlines: {
//       title: string;
//       description: string;
//     }[];
//     restrictions: {
//       title: string;
//       description: string;
//     }[]
//   };
//   seo: {
//     description: string;
//     title: string;
//     keywords: string[];
//     slug: string;
//   };
// }

// // the reservable room interface

// export interface ReservableRoomInterface {
//   id: string;
//   code: string;
//   title: string;
//   deleted: boolean;
//   images_main: string;
//   reservations: number;
//   floors: {
//     id: string;
//     name: string;
//     level: number;
//     rooms_number: number;
//     range_start: number;
//     range_end: number;
//   }[];
// }

// import { FileDetails } from "./file-manager";

// // the room interface
// export default interface RoomInterface {
//   // images
//   images_gallery: FileDetails[];
//   // main image
//   images_main: FileDetails | string;
//   // room title
//   title: string;
//   // deleted
//   deleted?: boolean;
//   // room description
//   description: string;
//   // room size
//   size: number;
//   // room code
//   code: string;
//   // seo
//   seo: {
//     title: string;
//     description: string;
//     keywords: string[];
//     slug: string;
//   };
//   // capacity of the room
//   capacity: {
//     total: number;
//     adults: number;
//     children: number;
//   };
//   // default price
//   default_price: number;
//   // price
//   price: {
//     from: Date | string; // IOS Date
//     to: Date | string; // IOS Date
//     price: number;
//   }[];
//   // floors
//   floors: {
//     id: string;
//     name: string;
//     rooms_number: number;
//     range_start: number;
//     range_end: number;
//   }[];
//   // the category name and id
//   category: { name: string; id: string };
//   // types names and ids
//   types: { name: string; id: string }[];
//   // extra services names and ids
//   extra_services: { name: string; id: string; price: number }[];
//   // beds names and ids
//   beds: { name: string; id: string }[];
//   // features names and ids
//   features: { name: string; id: string }[];
//   // includes ids
//   includes: { id: string; name: string }[];
//   // createAt and room id
//   createdAt: string | Date; // IOS Date
//   id: string;
// }

// // lightweight rooms interface
// export interface LightweightRoomInterface {
//   code: string;
//   title: string;
//   category: string;
//   deleted: boolean;
//   createdAt: string | Date; // IOS Date
//   id: string;
// }

// // the create room interface
// export interface CreateRoomInterface {
//   // the room name
//   title: string;
//   // image gallery
//   images_gallery: string[];
//   // main image
//   images_main: string;
//   // the size of the room
//   size: number;
//   // the description of the room
//   description: string;
//   // the code of the room
//   code: string;
//   // seo metadata section
//   seo: {
//     title: string;
//     description: string;
//     keywords: string[];
//     slug: string;
//   };
//   // default price
//   default_price: number;
//   // pricing
//   price: {
//     // the price of the room in different period in the year
//     from: Date | string; // IOS date
//     to: Date | string; // IOS date
//     price: number; // price
//   }[];
//   category: string;
//   beds: string[];
//   types: string[];
//   includes: string[];
//   extra_services: string[];
//   features: string[];
//   // floor
//   floors: {
//     id: string;
//     range_start: number;
//     range_end: number;
//   }[];
//   // capacity of the room
//   capacity: {
//     adults: number;
//     children: number;
//   };
// }

// // the reservable room interface

// export interface ReservableRoomInterface {
//   id: string;
//   code: string;
//   title: string;
//   deleted: boolean;
//   images_main: string;
//   reservations: number;
//   floors: {
//     id: string;
//     name: string;
//     level: number;
//     rooms_number: number;
//     range_start: number;
//     range_end: number;
//   }[];
// }
