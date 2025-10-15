// the room category interface
export default interface RoomCategoryInterface {
  name: string;
  slug: string;
  createdAt: string | Date;
  id: string;
}

// the create room category interface
export interface CreateRoomCategoryInterface {
  name: string;
  slug: string;
}
