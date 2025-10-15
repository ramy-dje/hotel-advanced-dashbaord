import JobPositionInterface from "@/interfaces/job.interface";
import { create } from "zustand";

// The Job positions Page store (with zustand)

interface StoreType {
  positions_list: JobPositionInterface[];
  positions_number: number;

  // actions
  set_many: (positions: JobPositionInterface[]) => void;
  add_position: (position: JobPositionInterface) => void;
  remove_position: (id: string) => void;
  remove_many_positions: (ids: string[]) => void;
  update_position: (id: string, position: JobPositionInterface) => void;

  set_total: (num: number) => void;
}

const useJobPositionsStore = create<StoreType>((set) => ({
  positions_list: [],
  positions_number: 0,

  // set many
  set_many: (positions) =>
    set(() => ({
      positions_list: positions,
    })),

  // actions
  add_position: (position) =>
    set((old) => ({
      positions_list: [position, ...old.positions_list],
      positions_number: old.positions_number + 1,
    })),

  // remove position
  remove_position: (id) =>
    set((old) => ({
      positions_list: old.positions_list.filter((e) => e.id !== id),
      positions_number: old.positions_number - 1,
    })),

  // update position
  update_position: (id, position) =>
    set((old) => ({
      positions_list: old.positions_list.map((e) =>
        e.id == id ? position : e
      ),
    })),

  // remove many positions
  remove_many_positions: (ids) =>
    set((old) => ({
      positions_list: old.positions_list.filter((e) => !ids.includes(e.id)),
      positions_number: old.positions_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      positions_number: num,
    })),
}));

export default useJobPositionsStore;
