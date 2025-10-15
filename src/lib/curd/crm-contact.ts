import CRMContactInterface, {
  CreateCRMContactInterface,
} from "@/interfaces/crm-contact.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios crm contacts curd logic

const apiURL = "crm/contacts";

// get all crm contacts with pagination
export const crud_get_all_crm_contacts = async (
  pagination: RequestAPIPaginationInterface
): Promise<CRMContactInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<CRMContactInterface>
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
    throw Error("CRM Contacts (Get-All) : Something went wrong");
  }
};

// get crm contact by id
export const crud_get_crm_contact_by_id = async (
  id: string
): Promise<CRMContactInterface> => {
  try {
    const res = await axiosAPI.get<CRMContactInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("CRM Contacts (Get) : Something went wrong");
  }
};

// Create crm contact
export const crud_create_crm_contact = async (
  body: CreateCRMContactInterface
): Promise<CRMContactInterface> => {
  try {
    const res = await axiosAPI.post<CRMContactInterface>(apiURL, body);
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
    throw Error("CRM Contacts (Create) : Something went wrong");
  }
};

// Update crm contact
export const crud_update_crm_contact = async (
  id: string,
  body: Partial<CreateCRMContactInterface>
): Promise<CRMContactInterface> => {
  try {
    const res = await axiosAPI.put<CRMContactInterface>(
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
    throw Error("CRM Contacts (Update) : Something went wrong");
  }
};

// Delete crm contact
export const crud_delete_crm_contact = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("DELETE :", err);
    throw Error("CRM Contacts (Delete) : Something went wrong");
  }
};

// Delete many crm contacts
export const crud_delete_many_crm_contacts = async (
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
    throw Error("CRM Contacts Many (Delete) : Something went wrong");
  }
};
