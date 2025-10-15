import slugify from "slugify";
import axiosAPI from "../axios";
import PropertyInterface, { CreatePropertyInterface } from "@/interfaces/property.interface";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// Base URL for property types CRUD
const apiURL = "property/";

/**
 * Fetch all property types with pagination
 */
export const crud_get_property_by_id = async (
  id: string
): Promise<PropertyInterface> => {
  try {
    const res = await axiosAPI.get<PropertyInterface>(`${apiURL}${id}`);
    if (res.status === 200 && res.data) {
      return res.data;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("GET Property by ID:", err);
    throw new Error("Property (Get by ID): Something went wrong");
  }
};

export const crud_get_all_propertyTypes = async (
  pagination: RequestAPIPaginationInterface
): Promise<PropertyInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<PropertyInterface>
    >(apiURL, { params: pagination });

    if (res.status === 200 && res.data) {
      return res.data.data;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("GET Property Types:", err);
    throw new Error("PropertyTypes (Get-All): Something went wrong");
  }
};

/**
 * Create a new property type
 */
export const crud_create_propertyType = async (
  payload: Omit<CreatePropertyInterface, "slug">
): Promise<PropertyInterface> => {
  // Spread all payload properties and add slug
  const body: CreatePropertyInterface = {
    ...payload,  // This includes all required properties from the interface
    slug: slugify(payload.propertyName, { lower: true, trim: true }),
  };
  
  try {
    const res = await axiosAPI.post<PropertyInterface>(apiURL, body);
    if (res.status === 201 && res.data) {
      return res.data;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("CREATE Property Type:", err);
    throw new Error("PropertyTypes (Create): Something went wrong");
  }
};

/**
 * Update an existing property type
 */
export const crud_update_propertyType = async (
  id: string,
  payload: Partial<Omit<CreatePropertyInterface, "slug">>
): Promise<PropertyInterface> => {
  const body: Partial<CreatePropertyInterface> = {};
  if (payload.propertyName) {
    body.propertyName = payload.propertyName;
    body.slug = slugify(payload.propertyName, { lower: true, trim: true });
  }

  try {
    const res = await axiosAPI.put<PropertyInterface>(`${apiURL}${id}`, body);
    if (res.status === 200 && res.data) {
      return res.data;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("UPDATE Property Type:", err);
    throw new Error("PropertyTypes (Update): Something went wrong");
  }
};

/**
 * Delete a single property type
 */
export const crud_delete_propertyType = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status === 200) {
      return 200;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("DELETE Property Type:", err);
    throw new Error("PropertyTypes (Delete): Something went wrong");
  }
};

/**
 * Delete multiple property types
 */
export const crud_delete_many_propertyTypes = async (
  ids: string[]
): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/many`, { data: { ids } });
    if (res.status === 200) {
      return 200;
    }
    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("DELETE MANY Property Types:", err);
    throw new Error("PropertyTypes (Delete Many): Something went wrong");
  }
};
