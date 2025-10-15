// the room type interface
export default interface RoomTypeInterface {
  name: string;
  slug: string;
  createdAt: string | Date;
  id: string;
}

// the create room type interface
export interface CreateRoomTypeInterface {
  name: string;
  slug: string;
}
