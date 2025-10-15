import PropertyTypeInterface, {
    CreatePropertyTypeInterface,
  } from "@/interfaces/property-type.interface";
  import axiosAPI from "../axios";
  
  const apiURL = "property/type";
  
  /**
   * Create a new property type
   * @param payload - object with property type name
   * @returns the created PropertyTypeInterface
   * @throws 409 if name conflict, or Error on other failures
   */
  export const crud_create_propertyType = async (
    payload: CreatePropertyTypeInterface
  ): Promise<PropertyTypeInterface> => {
    try {
      const res = await axiosAPI.post<PropertyTypeInterface>(apiURL, payload);
      if (res.status === 201 && res.data) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        throw 409;
      }
      console.error("Create Property Type:", err);
      throw Error("Property Type (Create): Something went wrong");
    }
  };
  
  /**
   * Get all property types
   * @returns list of PropertyTypeInterface
   */
  export async function crud_getAll_propertyTypes(): Promise<PropertyTypeInterface[]> {
    try {
      const response = await axiosAPI.get(apiURL);
      if (response.status === 200 && response.data) {
        console.log("All Property Types:", response.data);
        return response.data;
      } else {
        throw response;
      }
    } catch (err: any) {
      console.error("Get All Property Types:", err);
      throw Error("Property Type (Get All): Something went wrong");
    }
  }
  