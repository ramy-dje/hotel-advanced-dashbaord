// the room extra services interface
export default interface RoomExtraServiceInterface {
  name: string;
  booking_name: string;
  price: number;
  slug: string;
  icon: string;
  createdAt: string | Date;
  id: string;
}

// the create room extra services interface
export interface CreateRoomExtraServiceInterface {
  name: string;
  booking_name: string;
  slug: string;
  price: number;
  icon: string;
}
