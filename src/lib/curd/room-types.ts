import slugify from "slugify";
import axiosAPI from "../axios";
import RoomTypeInterface, {
  CreateRoomTypeInterface,
} from "@/interfaces/room-type.interface";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios room types curd logic

const apiURL = "room-details/room-types";

// get all types with pagination
export const crud_get_all_roomTypes = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomTypeInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomTypeInterface>
    >(apiURL, {
      params: { ...pagination },
    });
    if ((res.status === 200, res.data)) {
      return res.data.data;
    } else {
      throw res;
    }
  } catch (err) {
    console.log("GET :", err);
    throw Error("RoomType (Get-All) : Something went wrong");
  }
};

// Create room type
export const crud_create_roomType = async (
  payload: Omit<CreateRoomTypeInterface, "slug">
): Promise<RoomTypeInterface> => {
  // prepare the body
  const body: CreateRoomTypeInterface = {
    name: payload.name,
    slug: slugify(payload.name, { lower: true, trim: true }),
  };
  try {
    const res = await axiosAPI.post<RoomTypeInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("CREATE :", err);
    throw Error("RoomType (Create) : Something went wrong");
  }
};

// Update room type
export const crud_update_roomType = async (
  id: string,
  payload: Partial<Omit<CreateRoomTypeInterface, "slug">>
): Promise<RoomTypeInterface> => {
  // prepare the rea body
  const body: Partial<CreateRoomTypeInterface> = {
    name: payload.name,
  };

  // set slug
  if (payload.name) {
    body.slug = slugify(payload.name, { lower: true, trim: true });
  }

  try {
    const res = await axiosAPI.put<RoomTypeInterface>(`${apiURL}/${id}`, body);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("UPDATE :", err);
    throw Error("RoomType (Update) : Something went wrong");
  }
};

// Delete room type
export const crud_delete_roomType = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("DELETE :", err);
    throw Error("RoomType (Delete) : Something went wrong");
  }
};

// Delete many room types
export const crud_delete_many_room_types = async (
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
    throw Error("RoomTypes (Delete) : Something went wrong");
  }
};
