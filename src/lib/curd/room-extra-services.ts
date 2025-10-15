import slugify from "slugify";
import axiosAPI from "../axios";
import RoomExtraServiceInterface, {
  CreateRoomExtraServiceInterface,
} from "@/interfaces/room-extra-services";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios room extra services curd logic

const apiURL = "room-details/room-extra-services";

// get all extra services with pagination
export const crud_get_all_roomExtraServices = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomExtraServiceInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomExtraServiceInterface>
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
    throw Error("RoomExtraService (Get-All) : Something went wrong");
  }
};

// Create room extra service
export const crud_create_roomExtraService = async (
  payload: Omit<CreateRoomExtraServiceInterface, "slug">
): Promise<RoomExtraServiceInterface> => {
  // prepare the rea body
  const body: CreateRoomExtraServiceInterface = {
    name: payload.name,
    icon: payload.icon,
    booking_name: payload.booking_name,
    price: payload.price,
    slug: slugify(payload.name, { lower: true, trim: true }),
  };
  try {
    const res = await axiosAPI.post<RoomExtraServiceInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("CREATE :", err);
    throw Error("RoomExtraServices (Create) : Something went wrong");
  }
};

// Update room extra service
export const crud_update_roomExtraService = async (
  id: string,
  payload: Partial<Omit<CreateRoomExtraServiceInterface, "slug">>
): Promise<RoomExtraServiceInterface> => {
  // prepare the rea body
  const body: Partial<CreateRoomExtraServiceInterface> = {
    name: payload.name,
    icon: payload.icon,
    booking_name: payload.booking_name,
    price: payload.price,
  };

  // set slug
  if (payload.name) {
    body.slug = slugify(payload.name, { lower: true, trim: true });
  }

  try {
    const res = await axiosAPI.put<RoomExtraServiceInterface>(
      `${apiURL}/${id}`,
      body
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("UPDATE :", err);
    throw Error("RoomExtraServices (Update) : Something went wrong");
  }
};

// Delete room extra service
export const crud_delete_roomExtraService = async (
  id: string
): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("DELETE :", err);
    throw Error("RoomExtraServices (Delete) : Something went wrong");
  }
};

// Delete many room extra_services
export const crud_delete_many_room_extra_services = async (
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
    throw Error("RoomExtraServices (Delete) : Something went wrong");
  }
};
