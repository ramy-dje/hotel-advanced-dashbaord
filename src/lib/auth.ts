import { AxiosError } from "axios";
import axiosAPI from "./axios";
import UserInterfaceType from "@/interfaces/user.interfaces";

// the authentication logic functions

// Login
export const auth_login = async (
  email: string,
  password: string
): Promise<200 | 400 | 403 | 500> => {
  try {
    // logging in
    const res = await axiosAPI.post("auth/login", { email, password }); // with credentials
    if (res.status == 200) {
      // in success
      return 200;
    } else if (res.status == 500) {
      return 500;
    } else {
      return 400;
    }
  } catch (err) {
    // is unsuccess
    if (
      (err as AxiosError).status == 400 ||
      (err as AxiosError).status == 404 ||
      (err as AxiosError).status == 401
    ) {
      // if the error is 401 or 400 (password is wrong or account is wrong)
      return 400;
    } else if ((err as AxiosError).status == 403) {
      return 403;
    } else {
      return 500;
    }
  }
};

// Login
export const auth_logout = async (): Promise<200 | 400> => {
  try {
    // logging out
    const res = await axiosAPI.post("auth/logout"); // with credentials
    return 200;
  } catch (err) {
    return 400;
  }
};

// is authenticated
export const auth_isAuthenticated =
  async (): Promise<UserInterfaceType | null> => {
    try {
      // checking the auth status
      const res = await axiosAPI.get<{
        authenticated: boolean;
        data: UserInterfaceType;
      }>("auth/is-authenticated"); // with credentials

      if (res.status == 200 && res?.data.authenticated && res?.data.data) {
        // returning the user
        return res.data.data;
      } else {
        // returning null if he's not authenticated
        return null;
      }
    } catch (err) {
      // returning null if he's not authenticated
      return null;
    }
  };

// refresh the token with the new user data

export const auth_refresh_token = async (): Promise<200 | 401 | 500> => {
  try {
    // logging in
    const res = await axiosAPI.get("auth/refresh"); // with credentials
    if (res.status == 200) {
      // in success
      return 200;
    } else {
      return 500;
    }
  } catch (err) {
    // is unsuccess
    if ((err as AxiosError).status == 401) {
      return 401;
    } else {
      return 500;
    }
  }
};
