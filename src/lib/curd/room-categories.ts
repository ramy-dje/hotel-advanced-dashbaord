import RoomCategoryInterface, {
  CreateRoomCategoryInterface,
} from "@/interfaces/room-category.interface";
import slugify from "slugify";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios room category curd logic

const apiURL = "room-details/room-categories";

// get all categories with pagination
export const crud_get_all_roomCategory = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomCategoryInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomCategoryInterface>
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
    throw Error("RoomCategory (Get-All) : Something went wrong");
  }
};

// Create room category
export const crud_create_roomCategory = async (
  categoryName: string
): Promise<RoomCategoryInterface> => {
  // prepare the rea body
  const body: CreateRoomCategoryInterface = {
    name: categoryName,
    slug: slugify(categoryName, { lower: true, trim: true }),
  };
  try {
    const res = await axiosAPI.post<RoomCategoryInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    console.log("CREATE :", err);
    throw Error("RoomCategory (Create) : Something went wrong");
  }
};

// Update room category
export const crud_update_roomCategory = async (
  id: string,
  categoryName: string
): Promise<RoomCategoryInterface> => {
  // prepare the rea body
  const body: Partial<CreateRoomCategoryInterface> = {
    name: categoryName,
    slug: slugify(categoryName, { lower: true, trim: true }),
  };
  try {
    const res = await axiosAPI.put<RoomCategoryInterface>(
      `${apiURL}/${id}`,
      body
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    console.log("UPDATE :", err);
    throw Error("RoomCategory (Update) : Something went wrong");
  }
};

// Delete room category
export const crud_delete_roomCategory = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // category is used in other rooms
    }
    console.log("DELETE :", err);
    throw Error("RoomCategory (Delete) : Something went wrong");
  }
};
