import RoomTypeInterface from "@/interfaces/room-type.interface";
import { create } from "zustand";

// The Room Type Page store (with zustand)

interface StoreType {
  types_list: RoomTypeInterface[];
  types_number: number;

  // actions
  set_many: (types: RoomTypeInterface[]) => void;
  add_type: (type: RoomTypeInterface) => void;
  remove_type: (id: string) => void;
  remove_many_types: (ids: string[]) => void;
  update_type: (id: string, type: RoomTypeInterface) => void;

  set_total: (num: number) => void;
}

const useRoomTypesStore = create<StoreType>((set) => ({
  types_list: [],
  types_number: 0,

  // set many
  set_many: (types) =>
    set(() => ({
      types_list: types,
    })),

  // actions
  add_type: (type) =>
    set((old) => ({
      types_list: [type, ...old.types_list],
      types_number: old.types_number + 1,
    })),

  // remove type
  remove_type: (id) =>
    set((old) => ({
      types_list: old.types_list.filter((e) => e.id !== id),
      types_number: old.types_number - 1,
    })),

  // remove many types
  remove_many_types: (ids) =>
    set((old) => ({
      types_list: old.types_list.filter((e) => !ids.includes(e.id)),
      types_number: old.types_number - ids.length,
    })),

  // update type
  update_type: (id, type) =>
    set((old) => ({
      types_list: old.types_list.map((e) => (e.id == id ? type : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      types_number: num,
    })),
}));

export default useRoomTypesStore;
