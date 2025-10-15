import CRMContactOccupationInterface from "@/interfaces/crm-occupation.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios crm contact occupations curd logic

const apiURL = "crm/occupations";

// get all crm contact occupations with pagination
export const crud_get_all_crm_contact_occupations = async (
  pagination: RequestAPIPaginationInterface
): Promise<CRMContactOccupationInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<CRMContactOccupationInterface>
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
    throw Error("CRM Contact Occupations (Get-All) : Something went wrong");
  }
};
