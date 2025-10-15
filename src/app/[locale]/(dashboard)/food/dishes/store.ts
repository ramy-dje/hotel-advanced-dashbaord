import FoodDishInterface from "@/interfaces/food-dish.interface";
import { create } from "zustand";

// The Food Dishes Page store (with zustand)
interface StoreType {
  dishes_list: FoodDishInterface[];
  dishes_number: number;

  // actions
  set_many: (foodDishes: FoodDishInterface[]) => void;
  add_dish: (foodDish: FoodDishInterface) => void;
  remove_dish: (id: string) => void;
  remove_many_dishes: (ids: string[]) => void;
  update_dish: (id: string, foodDish: FoodDishInterface) => void;

  set_total: (num: number) => void;
}

const useFoodDishesStore = create<StoreType>((set) => ({
  dishes_list: [],
  dishes_number: 0,

  // set many
  set_many: (foodDishes) =>
    set(() => ({
      dishes_list: foodDishes,
    })),

  // actions
  add_dish: (foodDish) =>
    set((old) => ({
      dishes_list: [foodDish, ...old.dishes_list],
      dishes_number: old.dishes_number + 1,
    })),

  // remove food dish
  remove_dish: (id) =>
    set((old) => ({
      dishes_list: old.dishes_list.filter((e) => e.id !== id),
      dishes_number: old.dishes_number - 1,
    })),

  // update food dish
  update_dish: (id, foodDish) =>
    set((old) => ({
      dishes_list: old.dishes_list.map((e) => (e.id == id ? foodDish : e)),
    })),

  // remove many food dishes
  remove_many_dishes: (ids) =>
    set((old) => ({
      dishes_list: old.dishes_list.filter((e) => !ids.includes(e.id)),
      dishes_number: old.dishes_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      dishes_number: num,
    })),
}));

export default useFoodDishesStore;
