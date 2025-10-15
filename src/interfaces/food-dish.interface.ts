// the food dish interface
export default interface FoodDishInterface {
  name: string;
  description?: string;
  image: string;
  price: number;
  type: { name: string; id: string } | null;
  ingredients: {
    name: string;
    id: string;
  }[];
  createdAt: string | Date;
  id: string;
}
// the create food dish interface
export interface CreateFoodDishInterface {
  name: string;
  description?: string;
  image: string;
  price: number;
  type?: string | null;
  ingredients: string[];
}
