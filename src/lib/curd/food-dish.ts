import FoodDishInterface, {
  CreateFoodDishInterface,
} from "@/interfaces/food-dish.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food dish curd logic

const apiURL = "food/dishes";

// get all food dishes with pagination
export const crud_get_all_food_dishes = async (
  pagination: RequestAPIPaginationInterface
): Promise<FoodDishInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FoodDishInterface>
    >(apiURL, {
      params: { ...pagination },
    });
    if ((res.status === 200, res.data)) {
      return res.data.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    console.log("GET :", err);
    throw Error("Food Dish (Get-All) : Something went wrong");
  }
};

// get food dish by id
export const crud_get_food_dish_by_id = async (
  id: string
): Promise<FoodDishInterface> => {
  try {
    const res = await axiosAPI.get<FoodDishInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Food Dish (Get) : Something went wrong");
  }
};

// Create food dish
export const crud_create_food_dish = async (
  body: CreateFoodDishInterface
): Promise<FoodDishInterface> => {
  try {
    const res = await axiosAPI.post<FoodDishInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name
    }
    console.log("CREATE :", err);
    throw Error("Food Dish (Create) : Something went wrong");
  }
};

// Update food dish
export const crud_update_food_dish = async (
  id: string,
  body: Partial<CreateFoodDishInterface>
): Promise<FoodDishInterface> => {
  try {
    const res = await axiosAPI.put<FoodDishInterface>(`${apiURL}/${id}`, body);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name
    }
    console.log("UPDATE :", err);
    throw Error("Food Dish (Update) : Something went wrong");
  }
};

// Delete food dish
export const crud_delete_food_dish = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // dish is used in other menus
    }
    console.log("DELETE :", err);
    throw Error("Food Dish (Delete) : Something went wrong");
  }
};

// Delete many food dishes
export const crud_delete_many_food_dishes = async (
  ids: string[]
): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/many`, {
      data: {
        ids,
      },
    });
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Food Dishes Many (Delete) : Something went wrong");
  }
};
