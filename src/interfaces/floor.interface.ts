// the floor interface
export default interface FloorInterface {
  name: string;
  free_space: number;
  level: number;
  range_end: number;
  roomFrom?: number;
  roomTo?: number;
  rooms: {
    room_id: number;
    rooms_number: number;
    range_start: number;
    range_end: number;
  }[];
  createdAt: string | Date;
  id: string;
  energyClass: string;
  sections: Section[];
  hasFacilities: boolean;
  facilities: Facility[];
}
// the create floor interface
export interface CreateFloorInterface {
  name: string;
  roomFrom?: number;
  roomTo?: number;
  level: number;
  energyClass: string;
  sections: Section[];
  hasFacilities: boolean;
  facilities: Facility[];
}

