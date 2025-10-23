import {
    FeeInterface,
  CreateFeeInterface,
} from "@/interfaces/fees.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import { CreateFeesValidationSchemaType } from "@/app/[locale]/(dashboard)/fees/_components/create-fees-popup/create-fees.schema";

// The axios taxes curd logic

const apiURL = "fees";

// get all taxes with pagination
export const crud_get_all_fees = async (
  pagination: RequestAPIPaginationInterface
): Promise<FeeInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FeeInterface>
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
    throw Error("Fee (Get-All) : Something went wrong");
  }
};

// get tax by id
export const crud_get_fee_by_id = async (
  id: string
): Promise<FeeInterface> => {
  try {
    const res = await axiosAPI.get<FeeInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Fee (Get) : Something went wrong");
  }
};

// Create fee
export const crud_create_fee = async (
  fee_name: string,
  fee_type: CreateFeesValidationSchemaType['type'],
  fee_amount: number
): Promise<FeeInterface> => {
  // prepare the rea body
  const body: CreateFeesValidationSchemaType = {
    name: fee_name,
    type: fee_type,
    amount: fee_amount,
  };
  try {
    const res = await axiosAPI.post<FeeInterface>(apiURL, body);
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
    throw Error("Fee (Create) : Something went wrong");
  }
};

// Update fee
export const crud_update_fee = async (
  id: string,
  fee_name: string,
  fee_type: FeeInterface['type'],
  fee_amount: number
): Promise<FeeInterface> => {
  // prepare the rea body
  const body: Partial<CreateFeeInterface> = {
    name: fee_name,
    type: fee_type,
    amount: fee_amount,
  };
  try {
    const res = await axiosAPI.put<FeeInterface>(
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
    throw Error("Fee (Update) : Something went wrong");
  }
};

// Delete fee
export const crud_delete_fee = async (id: string): Promise<200> => {
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
    throw Error("Fee (Delete) : Something went wrong");
  }
};

// Delete many fees
export const crud_delete_many_fees = async (
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
    throw Error("Fee Many (Delete) : Something went wrong");
  }
};
