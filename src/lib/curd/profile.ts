import {
  UpdateUserInterface,
  UserAccessInfoType,
} from "@/interfaces/user.interfaces";
import axiosAPI from "../axios";
import { SystemPermissions } from "@/interfaces/permissions/permissions";

// The axios user's profile crud logic

const apiURL = "user";

// get the profile's permissions
export const crud_get_all_profile_permissions = async (): Promise<
  SystemPermissions[]
> => {
  try {
    const res = await axiosAPI.get<Omit<UserAccessInfoType, "active">>(
      `${apiURL}/access`
    );
    if (res.status == 200 && res.data) {
      return res.data.permissions;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Profile (Get Permissions) : Something went wrong");
  }
};

// Update user's profile
export const crud_update_profile = async (
  body: Partial<UpdateUserInterface>
): Promise<200> => {
  try {
    const res = await axiosAPI.put<string>(`${apiURL}`, body);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    console.log("UPDATE Profile :", err);
    throw Error("Profile (Update) : Something went wrong");
  }
};
