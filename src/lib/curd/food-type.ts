import FoodTypeInterface, {
  CreateFoodTypeInterface,
} from "@/interfaces/food-type.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food type curd logic

const apiURL = "food/types";

// get all food types with pagination
export const crud_get_all_food_types = async (
  pagination: RequestAPIPaginationInterface
): Promise<FoodTypeInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FoodTypeInterface>
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
    throw Error("Food Type (Get-All) : Something went wrong");
  }
};

// get food type by id
export const crud_get_food_type_by_id = async (
  id: string
): Promise<FoodTypeInterface> => {
  try {
    const res = await axiosAPI.get<FoodTypeInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Food Type (Get) : Something went wrong");
  }
};

// Create food type
export const crud_create_food_type = async (
  type_name: string
): Promise<FoodTypeInterface> => {
  // prepare the rea body
  const body: CreateFoodTypeInterface = {
    name: type_name,
  };
  try {
    const res = await axiosAPI.post<FoodTypeInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    console.log("CREATE :", err);
    throw Error("Food Type (Create) : Something went wrong");
  }
};

// Update food type
export const crud_update_food_type = async (
  id: string,
  type_name: string
): Promise<FoodTypeInterface> => {
  // prepare the rea body
  const body: Partial<CreateFoodTypeInterface> = {
    name: type_name,
  };
  try {
    const res = await axiosAPI.put<FoodTypeInterface>(`${apiURL}/${id}`, body);
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
    throw Error("Food Type (Update) : Something went wrong");
  }
};

// Delete food type
export const crud_delete_food_type = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // type is used in other dishes
    }
    console.log("DELETE :", err);
    throw Error("Food Type (Delete) : Something went wrong");
  }
};

// Delete many food types
export const crud_delete_many_food_types = async (
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
    throw Error("Food Types Many (Delete) : Something went wrong");
  }
};
