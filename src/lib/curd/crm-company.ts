import CRMCompanyInterface, {
  CreateCRMCompanyInterface,
} from "@/interfaces/crm-company.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios crm companies curd logic

const apiURL = "crm/companies";

// get all crm companies with pagination
export const crud_get_all_crm_companies = async (
  pagination: RequestAPIPaginationInterface
): Promise<CRMCompanyInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<CRMCompanyInterface>
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
    throw Error("CRM Companies (Get-All) : Something went wrong");
  }
};

// get crm company by id
export const crud_get_crm_company_by_id = async (
  id: string
): Promise<CRMCompanyInterface> => {
  try {
    const res = await axiosAPI.get<CRMCompanyInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("CRM Companies (Get) : Something went wrong");
  }
};

// Create crm company
export const crud_create_crm_company = async (
  body: CreateCRMCompanyInterface
): Promise<CRMCompanyInterface> => {
  try {
    const res = await axiosAPI.post<CRMCompanyInterface>(apiURL, body);
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
    throw Error("CRM Companies (Create) : Something went wrong");
  }
};

// Update crm company
export const crud_update_crm_company = async (
  id: string,
  body: Partial<CreateCRMCompanyInterface>
): Promise<CRMCompanyInterface> => {
  try {
    const res = await axiosAPI.put<CRMCompanyInterface>(
      `${apiURL}/${id}`,
      body
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("UPDATE :", err);
    throw Error("CRM Companies (Update) : Something went wrong");
  }
};

// Delete crm company
export const crud_delete_crm_company = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("DELETE :", err);
    throw Error("CRM Companies (Delete) : Something went wrong");
  }
};

// Delete many crm companies
export const crud_delete_many_crm_companies = async (
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
    throw Error("CRM Companies Many (Delete) : Something went wrong");
  }
};
