// The reservation status type
export type ReservationStatusType =
  | "pending"
  | "canceled"
  | "approved"
  | "deleted"
  | "completed";

// the reservations interface
export default interface ReservationsInterface {
  reserve: {
    room: {
      id: string;
      title: string;
      images_main: string;
      category: string;
      code: string;
      capacity: {
        total: number;
        adults: number;
        children: number;
      };
      extra_services: {
        id: string;
        icon: string;
        price: number;
        name: string;
      }[];
    };
    capacity: {
      total: number;
      adults: number;
      children: number;
    };
    rooms_number: number;
    extra_services: {
      service: string;
      guests: number;
    }[];
    check_in: Date;
    check_out: Date;
    days: number;
    start_hour?: string;
  };
  checked_data?: {
    rooms: {
      room_number: number;
      floor: {
        id: string;
        name: string;
        level: number;
      };
    }[];
  };
  pricing: {
    extra_services: number;
    rooms: number;
    total: number;
  };
  process: {
    status: ReservationStatusType;
    validated: boolean;
  };
  person: {
    fullName: string;
    phoneNumber: string[];
    state: string;
    country: string;
    city?: string;
    zipcode?: string;
    gender: "male" | "female";
    note: string;
    email: string;
  };
  createdAt: string | Date; // IOS Date
  id: string;
}

// reserved floors rooms interface
export type ReservedFloorsRoomsInterface<full extends boolean = false> =
  full extends true
    ? {
        room: string;
        details: {
          title: string;
          code: string;
          id: string;
          images_main: string;
          deleted: boolean;
        };
        floors: {
          id: string;
          title: string;
          level: number;
          range_start: number;
          range_end: number;
          room_range: {
            end: number;
            start: number;
          };
          // rooms
          rooms: {
            number: number;
            reserved: boolean;
            check?: {
              in: Date | string;
              out: Date | string;
            };
            reservation_id: string;
          }[];
        }[];
      }
    : {
        room: string;
        floors: {
          id: string;
          title: string;
          level: number;
          // rooms
          rooms: {
            number: number;
            reserved: boolean;
            check?: {
              in: Date | string;
              out: Date | string;
            };
          }[];
        }[];
      };

// the create Reservations interface
export interface CreateReservationsInterface {
  person: {
    fullName: string;
    phoneNumber: string[];
    email: string;
    state: string;
    country: string;
    city?: string;
    zipcode?: string;
    gender: "male" | "female";
    note: string;
  };
  room_id: string;
  capacity: {
    adults: number;
    children: number;
  };
  rooms_number: number;
  start_hour?: string;
  extra_services: {
    service: string;
    guests: number;
  }[];
  check_in: Date;
  check_out: Date;
}

// update reservation check data interface

export interface UpdateReservationCheckDataInterface {
  rooms: {
    floor: string; // id of the floor
    room_number: number;
  }[];
}
