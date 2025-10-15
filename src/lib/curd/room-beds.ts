import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import axiosAPI from "../axios";
import RoomBedInterface, {
  CreateRoomBedInterface,
} from "@/interfaces/room-bed.interface";

// The axios room bed curd logic

const apiURL = "room-details/room-beds";

// get all beds with pagination
export const crud_get_all_roomBeds = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomBedInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomBedInterface>
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
    throw Error("RoomBed (Get-All) : Something went wrong");
  }
};

// Create room bed
export const crud_create_roomBed = async (
  payload: CreateRoomBedInterface
): Promise<RoomBedInterface> => {
  // prepare the body
  const body: CreateRoomBedInterface = {
    name: payload.name,
    icon: payload.icon,
    height: payload.height,
    unite: payload.unite,
    width: payload.width,
  };
  try {
    const res = await axiosAPI.post<RoomBedInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("CREATE :", err);
    throw Error("RoomBed (Create) : Something went wrong");
  }
};

// Update room bed
export const crud_update_roomBed = async (
  id: string,
  payload: Partial<CreateRoomBedInterface>
): Promise<RoomBedInterface> => {
  // prepare the body
  const body: Partial<CreateRoomBedInterface> = {
    name: payload.name,
    icon: payload.icon,
    height: payload.height,
    unite: payload.unite,
    width: payload.width,
  };

  try {
    const res = await axiosAPI.put<RoomBedInterface>(`${apiURL}/${id}`, body);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("UPDATE :", err);
    throw Error("RoomBed (Update) : Something went wrong");
  }
};

// Delete room bed
export const crud_delete_roomBed = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("DELETE :", err);
    throw Error("RoomBed (Delete) : Something went wrong");
  }
};

// Delete many room beds
export const crud_delete_many_room_beds = async (
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
    throw Error("RoomBed (Delete) : Something went wrong");
  }
};
