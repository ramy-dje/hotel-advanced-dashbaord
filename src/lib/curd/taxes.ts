import {
    TaxInterface,
  CreateTaxInterface,
} from "@/interfaces/taxes.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios taxes curd logic

const apiURL = "taxes";

// get all taxes with pagination
export const crud_get_all_taxes = async (
  pagination: RequestAPIPaginationInterface
): Promise<TaxInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<TaxInterface>
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
    throw Error("Tax (Get-All) : Something went wrong");
  }
};

// get tax by id
export const crud_get_tax_by_id = async (
  id: string
): Promise<TaxInterface> => {
  try {
    const res = await axiosAPI.get<TaxInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Tax (Get) : Something went wrong");
  }
};

// Create tax
export const crud_create_tax = async (
  tax_name: string,
  tax_type: TaxInterface['type'],
  tax_amount: number
): Promise<TaxInterface> => {
  // prepare the rea body
  const body: CreateTaxInterface = {
    name: tax_name,
    type: tax_type,
    amount: tax_amount,
  };
  try {
    const res = await axiosAPI.post<TaxInterface>(apiURL, body);
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
    throw Error("Tax (Create) : Something went wrong");
  }
};

// Update tax
export const crud_update_tax = async (
  id: string,
  tax_name: string,
  tax_type: TaxInterface['type'],
  tax_amount: number
): Promise<TaxInterface> => {
  // prepare the rea body
  const body: Partial<CreateTaxInterface> = {
    name: tax_name,
    type: tax_type,
    amount: tax_amount,
  };
  try {
    const res = await axiosAPI.put<TaxInterface>(
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
    throw Error("Tax (Update) : Something went wrong");
  }
};

// Delete tax
export const crud_delete_tax = async (id: string): Promise<200> => {
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
    throw Error("Tax (Delete) : Something went wrong");
  }
};

// Delete many taxes
export const crud_delete_many_taxes = async (
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
    throw Error("Tax Many (Delete) : Something went wrong");
  }
};
