import RoomInterface, {
  CreateRoomInterface,
  LightweightRoomInterface,
  ReservableRoomInterface,
} from "@/interfaces/room.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios room curd logic

const apiURL = "rooms";

// get all lightweight rooms with pagination
export const crud_get_all_lightweight_rooms = async (
  pagination: RequestAPIPaginationInterface
): Promise<LightweightRoomInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<LightweightRoomInterface>
    >(`${apiURL}/lightweight`, {
      params: { ...pagination },
    });
    if ((res.status === 200, res.data)) {
      return res.data.data;
    } else {
      throw res;
    }
  } catch (err) {
    console.log("GET :", err);
    throw Error("Room (Get-Lightweight-All) : Something went wrong");
  }
};

// get the reservable rooms with pagination
export const crud_get_all_reservable_rooms = async (
  pagination: RequestAPIPaginationInterface
): Promise<ReservableRoomInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<ReservableRoomInterface>
    >(`${apiURL}/reservable`, {
      params: { ...pagination },
    });
    if ((res.status === 200, res.data)) {
      return res.data.data;
    } else {
      throw res;
    }
  } catch (err) {
    console.log("GET :", err);
    throw Error("Room (Get-Reservable-All) : Something went wrong");
  }
};

// get room by id

export const crud_get_room_by_id = async (
  room_id: string,
  full?: boolean
): Promise<RoomInterface> => {
  try {
    const res = await axiosAPI.get<RoomInterface>(`${apiURL}/${room_id}`, {
      params: {
        full,
      },
    });
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Rooms (Get) : Something went wrong");
  }
};

// Create room
export const crud_create_room = async (
  payload: CreateRoomInterface
): Promise<void> => {
  try {
    const res = await axiosAPI.post<RoomInterface>(apiURL, payload);
    if (res.status == 201 && res.data) {
      return;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the code
    }
    throw Error("Rooms (Create) : Something went wrong");
  }
};

// Update room
export const crud_update_room = async (
  id: string,
  payload: Partial<CreateRoomInterface>
): Promise<void> => {
  try {
    const res = await axiosAPI.put<RoomInterface>(`${apiURL}/${id}`, payload);
    if (res.status == 200 && res.data) {
      return;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the code
    }
    throw Error("Rooms (Update) : Something went wrong");
  }
};

// Delete room
export const crud_delete_room = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // if the room has reservations
    }
    throw Error("Rooms (Delete) : Something went wrong");
  }
};

// Delete many room
export const crud_multiple_delete_rooms = async (
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
    throw Error("Rooms Many(Delete) : Something went wrong");
  }
};

// Recover room
export const crud_recover_room = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.patch(`${apiURL}/recover/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Rooms (Recover) : Something went wrong");
  }
};

// Recover many room
export const crud_multiple_recover_rooms = async (
  ids: string[]
): Promise<200> => {
  try {
    const res = await axiosAPI.patch(`${apiURL}/recover/many`, {
      ids,
    });
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Rooms Many(Recover) : Something went wrong");
  }
};

// Force Delete room
export const crud_delete_force_room = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/force/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // if the room has reservations
    }
    throw Error("Rooms Force(Delete) : Something went wrong");
  }
};

// Force Delete many room
export const crud_multiple_delete_force_rooms = async (
  ids: string[]
): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/force/many`, {
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
    throw Error("Rooms Many Force(Delete) : Something went wrong");
  }
};

// Is code taken
export const crud_is_room_code_taken = async (
  code: string,
  not_code?: string
): Promise<boolean> => {
  try {
    const res = await axiosAPI.post<{ taken: boolean }>(
      `${apiURL}/is-code-taken`,
      { code, not: not_code || "" }
    );
    if (res.status == 200 && res.data) {
      return res.data.taken;
    } else {
      throw res;
    }
  } catch (err) {
    throw Error("Rooms (Code Taken) : Something went wrong");
  }
};
