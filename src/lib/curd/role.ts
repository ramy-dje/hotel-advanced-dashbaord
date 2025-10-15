import RoleInterface, {
  CreateRoleInterface,
} from "@/interfaces/role.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios role curd logic

const apiURL = "roles";

// get all roles with pagination
export const crud_get_all_roles = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoleInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoleInterface>
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
    throw Error("Role (Get-All) : Something went wrong");
  }
};

// get role by id
export const crud_get_role_by_id = async (
  id: string
): Promise<RoleInterface> => {
  try {
    const res = await axiosAPI.get<RoleInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Role (Get) : Something went wrong");
  }
};

// Create role
export const crud_create_role = async (
  body: CreateRoleInterface
): Promise<RoleInterface> => {
  try {
    const res = await axiosAPI.post<RoleInterface>(apiURL, body);
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
    throw Error("Role (Create) : Something went wrong");
  }
};

// Update role
export const crud_update_role = async (
  id: string,
  body: Partial<CreateRoleInterface>
): Promise<RoleInterface> => {
  try {
    const res = await axiosAPI.put<RoleInterface>(`${apiURL}/${id}`, body);
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
    throw Error("Role (Update) : Something went wrong");
  }
};

// Delete role
export const crud_delete_role = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // role can not be deleted
    }
    console.log("DELETE :", err);
    throw Error("Role (Delete) : Something went wrong");
  }
};

// Delete many roles
export const crud_delete_many_roles = async (ids: string[]): Promise<200> => {
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
    throw Error("Roles Many (Delete) : Something went wrong");
  }
};
