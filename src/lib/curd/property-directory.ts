import PropertyDirectoryInterface, { CreatePropertyDirectoryInterface } from "@/interfaces/property-directory.interface";
import axiosAPI from "../axios";

const apiURL = "property/directory";

/**
 * Create a new property directory
 * @param name - directory name
 * @returns the created PropertyDirectoryInterface
 * @throws 409 if name conflict, or Error on other failures
 */
export const crud_create_propertyDirectory = async (
  payload: CreatePropertyDirectoryInterface
): Promise<PropertyDirectoryInterface> => {
  try {
    const res = await axiosAPI.post<PropertyDirectoryInterface>(apiURL, payload);
    if (res.status === 201 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw 409;
    }
    console.error("Create Property Directory:", err);
    throw Error("Property Directory (Create): Something went wrong");
  }
};

export async function crud_getAll_propertyDirectories() {
  try {
    const response = await axiosAPI.get(apiURL);
    if (response.status === 200 && response.data) {
      console.log("All dirs : ", response.data);
      return response.data;
    } else {
      throw response;
    }
  } catch (err: any) {
    console.error("Get All Property Directories:", err);
    throw Error("Property Directory (Get All): Something went wrong");
  }
}
