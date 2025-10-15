import FoodIngredientInterface from "@/interfaces/food-ingredient.interface";
import { create } from "zustand";

// The Food Ingredients Page store (with zustand)

interface StoreType {
  ingredients_list: FoodIngredientInterface[];
  ingredients_number: number;

  // actions
  set_many: (foodIngredients: FoodIngredientInterface[]) => void;
  add_ingredient: (foodIngredient: FoodIngredientInterface) => void;
  remove_ingredient: (id: string) => void;
  remove_many_ingredients: (ids: string[]) => void;
  update_ingredient: (
    id: string,
    foodIngredient: FoodIngredientInterface
  ) => void;

  set_total: (num: number) => void;
}

const useFoodIngredientsStore = create<StoreType>((set) => ({
  ingredients_list: [],
  ingredients_number: 0,

  // set many
  set_many: (foodIngredients) =>
    set(() => ({
      ingredients_list: foodIngredients,
    })),

  // actions
  add_ingredient: (foodIngredient) =>
    set((old) => ({
      ingredients_list: [foodIngredient, ...old.ingredients_list],
      ingredients_number: old.ingredients_number + 1,
    })),

  // remove food ingredient
  remove_ingredient: (id) =>
    set((old) => ({
      ingredients_list: old.ingredients_list.filter((e) => e.id !== id),
      ingredients_number: old.ingredients_number - 1,
    })),

  // update food ingredient
  update_ingredient: (id, foodIngredient) =>
    set((old) => ({
      ingredients_list: old.ingredients_list.map((e) =>
        e.id == id ? foodIngredient : e
      ),
    })),

  // remove many food ingredients
  remove_many_ingredients: (ids) =>
    set((old) => ({
      ingredients_list: old.ingredients_list.filter((e) => !ids.includes(e.id)),
      ingredients_number: old.ingredients_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      ingredients_number: num,
    })),
}));

export default useFoodIngredientsStore;
