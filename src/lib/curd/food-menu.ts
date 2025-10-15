import FoodMenuInterface, {
  CreateFoodMenuInterface,
} from "@/interfaces/food-menu.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food menu curd logic

const apiURL = "food/menus";

// get all food menus with pagination
export const crud_get_all_food_menus = async (
  pagination: RequestAPIPaginationInterface
): Promise<FoodMenuInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FoodMenuInterface>
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
    throw Error("Food Menu (Get-All) : Something went wrong");
  }
};

// get food menu by id
export const crud_get_food_menu_by_id = async (
  id: string
): Promise<FoodMenuInterface> => {
  try {
    const res = await axiosAPI.get<FoodMenuInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Food Menu (Get) : Something went wrong");
  }
};

// Create food menu
export const crud_create_food_menu = async (
  body: CreateFoodMenuInterface
): Promise<FoodMenuInterface> => {
  try {
    const res = await axiosAPI.post<FoodMenuInterface>(apiURL, body);
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
    throw Error("Food Menu (Create) : Something went wrong");
  }
};

// Update food menu
export const crud_update_food_menu = async (
  id: string,
  body: Partial<CreateFoodMenuInterface>
): Promise<FoodMenuInterface> => {
  try {
    const res = await axiosAPI.put<FoodMenuInterface>(`${apiURL}/${id}`, body);
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
    throw Error("Food Menu (Update) : Something went wrong");
  }
};

// Delete food menu
export const crud_delete_food_menu = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("DELETE :", err);
    throw Error("Food Menu (Delete) : Something went wrong");
  }
};

// Delete many food menus
export const crud_delete_many_food_menus = async (
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
    throw Error("Food Menus Many (Delete) : Something went wrong");
  }
};
