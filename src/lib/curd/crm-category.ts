import CRMCompanyCategoryInterface from "@/interfaces/crm-category.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios crm company categories curd logic

const apiURL = "crm/categories";

// get all crm company categories with pagination
export const crud_get_all_crm_company_categories = async (
  pagination: RequestAPIPaginationInterface
): Promise<CRMCompanyCategoryInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<CRMCompanyCategoryInterface>
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
    throw Error("CRM Company Categories (Get-All) : Something went wrong");
  }
};
