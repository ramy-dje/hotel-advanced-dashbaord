import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios crm industries curd logic

const apiURL = "crm/industries";

// get all crm industries with pagination
export const crud_get_all_crm_industries = async (
  pagination: RequestAPIPaginationInterface
): Promise<CRMIndustryInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<CRMIndustryInterface>
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
    throw Error("CRM Industries (Get-All) : Something went wrong");
  }
};
