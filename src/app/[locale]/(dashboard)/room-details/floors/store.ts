import FloorInterface from "@/interfaces/floor.interface";
import { create } from "zustand";

// The Floor Page store (with zustand)

interface StoreType {
  floors_list: FloorInterface[];
  floors_number: number;

  // actions
  set_many: (floors: FloorInterface[]) => void;
  add_floor: (floor: FloorInterface) => void;
  remove_floor: (id: string) => void;
  remove_many_floors: (ids: string[]) => void;
  update_floor: (id: string, floor: FloorInterface) => void;

  set_total: (num: number) => void;
}

const useFloorsStore = create<StoreType>((set) => ({
  floors_list: [],
  floors_number: 0,

  // set many
  set_many: (floors) =>
    set(() => ({
      floors_list: floors,
    })),

  // actions
  add_floor: (floor) =>
    set((old) => ({
      floors_list: [floor, ...old.floors_list],
      floors_number: old.floors_number + 1,
    })),

  // remove floor
  remove_floor: (id) =>
    set((old) => ({
      floors_list: old.floors_list.filter((e) => e.id !== id),
      floors_number: old.floors_number - 1,
    })),

  // remove many floors
  remove_many_floors: (ids) =>
    set((old) => ({
      floors_list: old.floors_list.filter((e) => !ids.includes(e.id)),
      floors_number: old.floors_number - ids.length,
    })),

  // update floor
  update_floor: (id, floor) =>
    set((old) => ({
      floors_list: old.floors_list.map((e) => (e.id == id ? floor : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      floors_number: num,
    })),
}));

export default useFloorsStore;
