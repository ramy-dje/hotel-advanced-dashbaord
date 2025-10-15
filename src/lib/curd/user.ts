import {
  UserInterface,
  CreateUserInterface,
  UpdateUserInterface,
} from "@/interfaces/user.interfaces";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios role curd logic

const apiURL = "user";

// get all users with pagination
export const crud_get_all_users = async (
  pagination: RequestAPIPaginationInterface
): Promise<UserInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<UserInterface>
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
    throw Error("User (Get-All) : Something went wrong");
  }
};

// get user by id
export const crud_get_user_by_id = async (
  id: string
): Promise<UserInterface> => {
  try {
    const res = await axiosAPI.get<UserInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("User (Get) : Something went wrong");
  }
};

// Create user
export const crud_create_user = async (
  body: CreateUserInterface
): Promise<{ id: string }> => {
  try {
    const res = await axiosAPI.post<{ id: string; message?: string }>(
      apiURL,
      body
    );
    if (res.status == 201 && res.data) {
      return { id: res.data.id };
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the email
    }
    console.log("CREATE :", err);
    throw Error("User (Create) : Something went wrong");
  }
};

// Update user
export const crud_update_user = async (
  id: string,
  body: Partial<UpdateUserInterface>
): Promise<{ id: string }> => {
  try {
    const res = await axiosAPI.put<{ id: string; message?: string }>(
      `${apiURL}/${id}`,
      body
    );
    if (res.status == 200 && res.data) {
      return { id: res.data.id };
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the email
    }
    console.log("UPDATE :", err);
    throw Error("User (Update) : Something went wrong");
  }
};

// Update user activation status
export const crud_update_user_activation_status = async (
  id: string,
  active: boolean
): Promise<200> => {
  try {
    const res = await axiosAPI.patch(`${apiURL}/activation/${id}`, {
      active,
    });
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("ACTIVE :", err);
    throw Error("User (Active) : Something went wrong");
  }
};

// Delete user
export const crud_delete_user = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // user can not be deleted
    }
    console.log("DELETE :", err);
    throw Error("User (Delete) : Something went wrong");
  }
};

// Delete many users
export const crud_delete_many_users = async (ids: string[]): Promise<200> => {
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
    throw Error("Users Many (Delete) : Something went wrong");
  }
};
