// the room feature interface
export default interface RoomFeatureInterface {
  name: string;
  slug: string;
  icon: string;
  createdAt: string | Date;
  id: string;
}

// the create room feature interface
export interface CreateRoomFeatureInterface {
  name: string;
  slug: string;
  icon: string;
}
