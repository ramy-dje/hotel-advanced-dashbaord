import FoodMenuInterface from "@/interfaces/food-menu.interface";
import { create } from "zustand";

// The Food Menus Page store (with zustand)

interface StoreType {
  menus_list: FoodMenuInterface[];
  menus_number: number;

  // actions
  set_many: (foodMenus: FoodMenuInterface[]) => void;
  add_menu: (foodMenu: FoodMenuInterface) => void;
  remove_menu: (id: string) => void;
  remove_many_menus: (ids: string[]) => void;
  update_menu: (id: string, foodMenu: FoodMenuInterface) => void;

  set_total: (num: number) => void;
}

const useFoodMenusStore = create<StoreType>((set) => ({
  menus_list: [],
  menus_number: 0,

  // set many
  set_many: (foodMenus) =>
    set(() => ({
      menus_list: foodMenus,
    })),

  // actions
  add_menu: (foodMenu) =>
    set((old) => ({
      menus_list: [foodMenu, ...old.menus_list],
      menus_number: old.menus_number + 1,
    })),

  // remove food menu
  remove_menu: (id) =>
    set((old) => ({
      menus_list: old.menus_list.filter((e) => e.id !== id),
      menus_number: old.menus_number - 1,
    })),

  // update food menu
  update_menu: (id, foodMenu) =>
    set((old) => ({
      menus_list: old.menus_list.map((e) => (e.id == id ? foodMenu : e)),
    })),

  // remove many food menus
  remove_many_menus: (ids) =>
    set((old) => ({
      menus_list: old.menus_list.filter((e) => !ids.includes(e.id)),
      menus_number: old.menus_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      menus_number: num,
    })),
}));

export default useFoodMenusStore;
