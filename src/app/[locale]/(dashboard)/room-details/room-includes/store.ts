import RoomIncludeInterface from "@/interfaces/room-includes.interface";
import { create } from "zustand";

// The Room Include Page store (with zustand)

interface StoreType {
  includes_list: RoomIncludeInterface[];
  includes_number: number;

  // actions
  set_many: (includes: RoomIncludeInterface[]) => void;
  add_include: (include: RoomIncludeInterface) => void;
  remove_include: (id: string) => void;
  remove_many_includes: (ids: string[]) => void;
  update_include: (id: string, include: RoomIncludeInterface) => void;

  set_total: (num: number) => void;
}

const useRoomIncludesStore = create<StoreType>((set) => ({
  includes_list: [],
  includes_number: 0,

  // set many
  set_many: (includes) =>
    set(() => ({
      includes_list: includes,
    })),

  // actions
  add_include: (include) =>
    set((old) => ({
      includes_list: [include, ...old.includes_list],
      includes_number: old.includes_number + 1,
    })),

  // remove include
  remove_include: (id) =>
    set((old) => ({
      includes_list: old.includes_list.filter((e) => e.id !== id),
      includes_number: old.includes_number - 1,
    })),

  // remove many includes
  remove_many_includes: (ids) =>
    set((old) => ({
      includes_list: old.includes_list.filter((e) => !ids.includes(e.id)),
      includes_number: old.includes_number - ids.length,
    })),

  // update include
  update_include: (id, include) =>
    set((old) => ({
      includes_list: old.includes_list.map((e) => (e.id == id ? include : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      includes_number: num,
    })),
}));

export default useRoomIncludesStore;
