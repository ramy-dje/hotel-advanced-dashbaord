import FloorInterface, {
  CreateFloorInterface,
} from "@/interfaces/floor.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios floors curd logic

const apiURL = "room-details/floors";

// get all floors with pagination
export const crud_get_all_floors = async (
  pagination: RequestAPIPaginationInterface
): Promise<FloorInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<FloorInterface>
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
    throw Error("Floor (Get-All) : Something went wrong");
  }
};

// Create floor
export const crud_create_floors = async (
  payload: CreateFloorInterface
): Promise<FloorInterface> => {
  try {
    const res = await axiosAPI.post<FloorInterface>(apiURL, payload);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    throw Error("Floor (Create) : Something went wrong");
  }
};

// Update floor
export const crud_update_floors = async (
  id: string,
  payload: Partial<CreateFloorInterface>
): Promise<FloorInterface> => {
  try {
    const res = await axiosAPI.put<FloorInterface>(`${apiURL}/${id}`, payload);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    throw Error("Floor (Update) : Something went wrong");
  }
};

// Delete floor
export const crud_delete_floors = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err) {
    throw Error("Floor (Delete) : Something went wrong");
  }
};

// Can floor have this room with range
export const crud_check_floor_range = async (
  id: string,
  body: { range_start: number; range_end: number },
  not_room?: string
): Promise<{ can: boolean }> => {
  try {
    const res = await axiosAPI.post<{ can: boolean }>(
      `${apiURL}/check-range/${id}`,
      not_room ? { ...body, not_room } : { ...body }
    );
    if (res.status == 200) {
      return { can: res.data.can };
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 400) {
      throw 400; // out of range error
    } else if (err.status == 409) {
      throw 409;
    }
    throw Error("Floor (Range) : Something went wrong");
  }
};

// Delete many floors
export const crud_delete_many_floors = async (ids: string[]): Promise<200> => {
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
    throw Error("Floor Many (Delete) : Something went wrong");
  }
};
