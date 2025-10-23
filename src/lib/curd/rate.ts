import { CreateRatePlanInterface, RatePlanInterface } from "@/interfaces/rate.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import { CreateRateValidationSchemaType } from "@/app/[locale]/(dashboard)/rate/(crud)/create/_component/createRateDetailsValidation.schema";


const apiURL = "rate";
export const crud_create_rate = async (
  rate
) => {
  try {
    const res = await axiosAPI.post(apiURL, rate);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("CREATE :", err);
    throw Error("Rate (Create) : Something went wrong");
  }
};

export const crud_update_rate = async (
  id: string,
  rate
) => {
  try {
    const res = await axiosAPI.put(`${apiURL}/${id}`, rate);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("UPDATE :", err);
    throw Error("Rate (Update) : Something went wrong");
  }
};  

export const crud_get_all_rates = async () => {
  try {
    const res = await axiosAPI.get(apiURL);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("CREATE :", err);
    throw Error("Rate (Create) : Something went wrong");
  }
};

export const crud_get_rate_by_code = async (rateCode: string) => {
  try {
    const res = await axiosAPI.get(`${apiURL}/code/${rateCode}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("GET BY CODE:", err);
    throw Error("Rate (Get By Code) : Something went wrong");
  }
};

export const crud_get_rate_by_id = async (id: string) => {
  try {
    const res = await axiosAPI.get(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("GET BY ID:", err);
    throw Error("Rate (Get By ID) : Something went wrong");
  }
};

// Delete Rate plan category
export const crud_delete_rate = async (id: string): Promise<200> => {
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
    throw Error("Rate (Delete) : Something went wrong");
  }
};


export const crud_delete_many_rates = async (ids: string[]) => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/many`, {
      data: { ids },
    });
    if (res.status == 200) {
      return true;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("DELETE MANY:", err);
    throw Error("Rate (Delete Many) : Something went wrong");
  }
};