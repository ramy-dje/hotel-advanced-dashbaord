import RatePlanCategoryInterface, {
  CreateRatePlanCategoryInterface,
} from "@/interfaces/rate-category.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food category curd logic

const apiURL = "rate-category";

// get all Rate plan categories with pagination
export const crud_get_all_rate_categories = async (
  pagination: RequestAPIPaginationInterface
): Promise<RatePlanCategoryInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RatePlanCategoryInterface>
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
    throw Error("Rate Category (Get-All) : Something went wrong");
  }
};

// get Rate plan category by id
export const crud_get_rate_category_by_id = async (
  id: string
): Promise<RatePlanCategoryInterface> => {
  try {
    const res = await axiosAPI.get<RatePlanCategoryInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Rate Category (Get) : Something went wrong");
  }
};

// Create Rate plan category
export const crud_create_rate_category = async (
  category_name: string
): Promise<RatePlanCategoryInterface> => {
  // prepare the rea body
  const body: CreateRatePlanCategoryInterface = {
    name: category_name,
  };
  try {
    const res = await axiosAPI.post<RatePlanCategoryInterface>(apiURL, body);
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
    throw Error("Rate Category (Create) : Something went wrong");
  }
};

// Update Rate plan category
export const crud_update_rate_category = async (
  id: string,
  category_name: string
): Promise<RatePlanCategoryInterface> => {
  // prepare the rea body
  const body: Partial<CreateRatePlanCategoryInterface> = {
    name: category_name,
  };
  try {
    const res = await axiosAPI.put<RatePlanCategoryInterface>(
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
    throw Error("Rate Category (Update) : Something went wrong");
  }
};

// Delete Rate plan category
export const crud_delete_rate_category = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // category is used in other dishes
    }
    console.log("DELETE :", err);
    throw Error("Rate Category (Delete) : Something went wrong");
  }
};

// Delete many Rate plan categories
export const crud_delete_many_rate_categories = async (
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
    throw Error("Rate Category Many (Delete) : Something went wrong");
  }
};
