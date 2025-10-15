// the room bed interface
export default interface RoomBedInterface {
  name: string;
  height: number;
  width: number;
  unite: "cm" | "inch";
  icon: string;
  createdAt: string | Date;
  id: string;
}

// the create room bed interface
export interface CreateRoomBedInterface {
  name: string;
  height: number;
  width: number;
  unite: "cm" | "inch";
  icon: string;
}
