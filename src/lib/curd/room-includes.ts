import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import axiosAPI from "../axios";
import RoomIncludesInterface, {
  CreateRoomIncludesInterface,
} from "@/interfaces/room-includes.interface";

// The axios room includes curd logic

const apiURL = "room-details/room-includes";

// get all includes with pagination
export const crud_get_all_roomIncludes = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomIncludesInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomIncludesInterface>
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
    throw Error("RoomIncludes (Get-All) : Something went wrong");
  }
};

// Create room include
export const crud_create_roomInclude = async (
  payload: CreateRoomIncludesInterface
): Promise<RoomIncludesInterface> => {
  // prepare the body
  const body: CreateRoomIncludesInterface = {
    name: payload.name,
  };
  try {
    const res = await axiosAPI.post<RoomIncludesInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("CREATE :", err);
    throw Error("RoomIncludes (Create) : Something went wrong");
  }
};

// Update room include
export const crud_update_roomInclude = async (
  id: string,
  payload: Partial<CreateRoomIncludesInterface>
): Promise<RoomIncludesInterface> => {
  // prepare the rea body
  const body: Partial<CreateRoomIncludesInterface> = {
    name: payload.name,
  };

  try {
    const res = await axiosAPI.put<RoomIncludesInterface>(
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
    throw Error("RoomIncludes (Update) : Something went wrong");
  }
};

// Delete room include
export const crud_delete_roomInclude = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("DELETE :", err);
    throw Error("RoomIncludes (Delete) : Something went wrong");
  }
};

// Delete many room includes
export const crud_delete_many_room_includes = async (
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
    throw Error("RoomIncludes (Delete) : Something went wrong");
  }
};
