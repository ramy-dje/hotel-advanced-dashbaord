import FoodDishInterface from "./food-dish.interface";

// the food menu interface
export default interface FoodMenuInterface {
  name: string;

  sections: {
    title: string;
    description: string;
    dishes: FoodDishInterface[];
    notes: string[];
    sub_title: string;
    featured_dish: string | null;
  }[];
  createdAt: string | Date;
  id: string;
}
// the create food menu interface
export interface CreateFoodMenuInterface {
  name: string;
  sections: {
    title: string;
    description: string;
    notes: string[];
    sub_title: string;
    dishes: string[];
    featured_dish: string | null;
  }[];
}
