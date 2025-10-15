import FoodIngredientInterface, {
  CreateFoodIngredientInterface,
} from "@/interfaces/food-ingredient.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food ingredient curd logic

const apiURL = "food/ingredients";

// get all food ingredients with pagination
export const crud_get_all_food_ingredients = async (
  pagination: RequestAPIPaginationInterface
): Promise<FoodIngredientInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FoodIngredientInterface>
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
    throw Error("Food Ingredient (Get-All) : Something went wrong");
  }
};

// get food ingredient by id
export const crud_get_food_ingredient_by_id = async (
  id: string
): Promise<FoodIngredientInterface> => {
  try {
    const res = await axiosAPI.get<FoodIngredientInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Food Ingredient (Get) : Something went wrong");
  }
};

// Create food ingredient
export const crud_create_food_ingredient = async (
  ingredient_name: string
): Promise<FoodIngredientInterface> => {
  // prepare the rea body
  const body: CreateFoodIngredientInterface = {
    name: ingredient_name,
  };
  try {
    const res = await axiosAPI.post<FoodIngredientInterface>(apiURL, body);
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
    throw Error("Food Ingredient (Create) : Something went wrong");
  }
};

// Update food ingredient
export const crud_update_food_ingredient = async (
  id: string,
  ingredient_name: string
): Promise<FoodIngredientInterface> => {
  // prepare the rea body
  const body: Partial<CreateFoodIngredientInterface> = {
    name: ingredient_name,
  };
  try {
    const res = await axiosAPI.put<FoodIngredientInterface>(
      `${apiURL}/${id}`,
      body
    );
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
    throw Error("Food Ingredient (Update) : Something went wrong");
  }
};

// Delete food ingredient
export const crud_delete_food_ingredient = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // ingredient is used in other dishes
    }
    console.log("DELETE :", err);
    throw Error("Food Ingredient (Delete) : Something went wrong");
  }
};

// Delete many food ingredients
export const crud_delete_many_food_ingredients = async (
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
    throw Error("Food Ingredients Many (Delete) : Something went wrong");
  }
};
