import RoomInterface from "@/interfaces/room.interface";
import { create } from "zustand";

// The Rooms Page store (with zustand)

interface StoreType {
  rooms_list: RoomInterface[];
  rooms_number: number;

  // actions
  set_many: (rooms: RoomInterface[]) => void;
  add_room: (room: RoomInterface) => void;
  remove_room: (id: string) => void;
  remove_many_rooms: (id: string[]) => void;
  update_room: (id: string, room: RoomInterface) => void;

  set_total: (num: number) => void;
}

const useRoomsStore = create<StoreType>((set) => ({
  rooms_list: [],
  rooms_number: 0,

  // set many
  set_many: (rooms) =>
    set(() => ({
      rooms_list: rooms,
    })),

  // actions
  add_room: (room) =>
    set((old) => ({
      rooms_list: [room,...old.rooms_list],
      rooms_number: old.rooms_number + 1,
    })),

  // remove room
  remove_room: (id) =>
    set((old) => ({
      rooms_list: old.rooms_list.filter((e) => e.id !== id),
      rooms_number: old.rooms_number - 1,
    })),

  // remove many room
  remove_many_rooms: (ids) =>
    set((old) => ({
      rooms_list: old.rooms_list.filter((e) => !ids.includes(e.id)),
      rooms_number: old.rooms_number - ids.length,
    })),

  // update room
  update_room: (id, room) =>
    set((old) => ({
      rooms_list: old.rooms_list.map((e) => (e.id == id ? room : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      rooms_number: num,
    })),
}));

export default useRoomsStore;
