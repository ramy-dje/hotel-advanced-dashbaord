import RoomBedInterface from "@/interfaces/room-bed.interface";
import { create } from "zustand";

// The Room Bed Page store (with zustand)

interface StoreType {
  beds_list: RoomBedInterface[];
  beds_number: number;

  // actions
  set_many: (beds: RoomBedInterface[]) => void;
  add_bed: (bed: RoomBedInterface) => void;
  remove_bed: (id: string) => void;
  remove_many_beds: (ids: string[]) => void;
  update_bed: (id: string, bed: RoomBedInterface) => void;

  set_total: (num: number) => void;
}

const useRoomBedsStore = create<StoreType>((set) => ({
  beds_list: [],
  beds_number: 0,

  // set many
  set_many: (beds) =>
    set(() => ({
      beds_list: beds,
    })),

  // actions
  add_bed: (bed) =>
    set((old) => ({
      beds_list: [bed, ...old.beds_list],
      beds_number: old.beds_number + 1,
    })),

  // remove bed
  remove_bed: (id) =>
    set((old) => ({
      beds_list: old.beds_list.filter((e) => e.id !== id),
      beds_number: old.beds_number - 1,
    })),

  // remove many beds
  remove_many_beds: (ids) =>
    set((old) => ({
      beds_list: old.beds_list.filter((e) => !ids.includes(e.id)),
      beds_number: old.beds_number - ids.length,
    })),

  // update bed
  update_bed: (id, bed) =>
    set((old) => ({
      beds_list: old.beds_list.map((e) => (e.id == id ? bed : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      beds_number: num,
    })),
}));

export default useRoomBedsStore;
