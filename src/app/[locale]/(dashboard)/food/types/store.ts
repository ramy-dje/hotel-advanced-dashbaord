import FoodTypeInterface from "@/interfaces/food-type.interface";
import { create } from "zustand";

// The Food Types Page store (with zustand)

interface StoreType {
  types_list: FoodTypeInterface[];
  types_number: number;

  // actions
  set_many: (foodTypes: FoodTypeInterface[]) => void;
  add_type: (foodType: FoodTypeInterface) => void;
  remove_type: (id: string) => void;
  remove_many_types: (ids: string[]) => void;
  update_type: (id: string, foodType: FoodTypeInterface) => void;

  set_total: (num: number) => void;
}

const useFoodTypesStore = create<StoreType>((set) => ({
  types_list: [],
  types_number: 0,

  // set many
  set_many: (foodTypes) =>
    set(() => ({
      types_list: foodTypes,
    })),

  // actions
  add_type: (foodType) =>
    set((old) => ({
      types_list: [foodType, ...old.types_list],
      types_number: old.types_number + 1,
    })),

  // remove food type
  remove_type: (id) =>
    set((old) => ({
      types_list: old.types_list.filter((e) => e.id !== id),
      types_number: old.types_number - 1,
    })),

  // update food type
  update_type: (id, foodType) =>
    set((old) => ({
      types_list: old.types_list.map((e) => (e.id == id ? foodType : e)),
    })),

  // remove many food types
  remove_many_types: (ids) =>
    set((old) => ({
      types_list: old.types_list.filter((e) => !ids.includes(e.id)),
      types_number: old.types_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      types_number: num,
    })),
}));

export default useFoodTypesStore;
