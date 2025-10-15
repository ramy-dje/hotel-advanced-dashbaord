import ReservationsInterface, {
  CreateReservationsInterface,
  ReservationStatusType,
  ReservedFloorsRoomsInterface,
  UpdateReservationCheckDataInterface,
} from "@/interfaces/reservations.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios reservations curd logic

const apiURL = "reservations";

// get all reservations with pagination
export const crud_get_all_reservations = async (
  pagination: RequestAPIPaginationInterface
): Promise<ReservationsInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<ReservationsInterface>
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
    throw Error("Reservation (Get-All) : Something went wrong");
  }
};

// get all to reserve floors rooms
export const crud_get_all_to_reserve_floors_rooms = async <
  Full extends boolean = false
>(
  room_id: string,
  full: boolean = false
): Promise<ReservedFloorsRoomsInterface<Full>> => {
  try {
    const res = await axiosAPI.get<ReservedFloorsRoomsInterface<Full>>(
      `${apiURL}/floors-rooms/${room_id}`,
      {
        params: {
          full: full,
        },
      }
    );
    if ((res.status === 200, res.data)) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err) {
    console.log("GET Floor Rooms :", err);
    throw Error("Reservation (Get-All-Floors-Rooms) : Something went wrong");
  }
};

// get reservation by id
export const crud_get_reservation_by_id = async (
  reservation_id: string
): Promise<ReservationsInterface> => {
  try {
    const res = await axiosAPI.get<ReservationsInterface>(
      `${apiURL}/${reservation_id}`
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Reservation (Get One) : Something went wrong");
  }
};

// Create reservation
export const crud_create_reservation = async (
  payload: CreateReservationsInterface
): Promise<ReservationsInterface> => {
  try {
    const res = await axiosAPI.post<ReservationsInterface>(apiURL, payload);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err) {
    console.log("Create err", err);
    throw Error("Reservation (Create) : Something went wrong");
  }
};

// Update reservation
export const crud_update_reservation = async (
  id: string,
  payload: Partial<CreateReservationsInterface>
): Promise<ReservationsInterface> => {
  try {
    const res = await axiosAPI.put<ReservationsInterface>(
      `${apiURL}/${id}`,
      payload
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Reservation (Update) : Something went wrong");
  }
};

// Update reservation status
export const crud_update_reservation_status = async (
  id: string,
  status: ReservationStatusType
): Promise<string> => {
  try {
    const res = await axiosAPI.patch<{ id: string }>(`${apiURL}/status/${id}`, {
      status,
    });
    if (res.status == 200 && res.data) {
      return res.data.id;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Reservation Status (Update) : Something went wrong");
  }
};

// Update many reservations statuses
export const crud_update_many_reservations_statuses = async (
  ids: string[],
  status: ReservationStatusType
): Promise<number> => {
  try {
    const res = await axiosAPI.patch<{ id: string }>(`${apiURL}/status/many`, {
      status,
      ids,
    });
    if (res.status == 200 && res.data) {
      return 200;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Reservations Status (All Update) : Something went wrong");
  }
};

// Update all canceled reservations statuses to deleted
export const crud_update_all_canceled_reservations_statuses_to_deleted =
  async (): Promise<200> => {
    try {
      const res = await axiosAPI.patch<{ id: string }>(
        `${apiURL}/status/all/canceled-to-deleted`
      );
      if (res.status == 200) {
        return 200;
      } else {
        throw res;
      }
    } catch (err: any) {
      throw Error(
        "Reservations Status (All Canceled To Deleted Update) : Something went wrong"
      );
    }
  };

// Update all completed reservations statuses to deleted
export const crud_update_all_completed_reservations_statuses_to_deleted =
  async (): Promise<200> => {
    try {
      const res = await axiosAPI.patch<{ id: string }>(
        `${apiURL}/status/all/completed-to-deleted`
      );
      if (res.status == 200) {
        return 200;
      } else {
        throw res;
      }
    } catch (err: any) {
      throw Error(
        "Reservations Status (All Completed To Deleted Update) : Something went wrong"
      );
    }
  };

// Update reservation check data
export const crud_update_reservation_check_data = async (
  id: string,
  check_data: UpdateReservationCheckDataInterface
): Promise<string> => {
  try {
    const res = await axiosAPI.patch<{ id: string }>(
      `${apiURL}/check/${id}`,
      check_data
    );
    if (res.status == 200 && res.data) {
      return res.data.id;
    } else {
      throw res;
    }
  } catch (err: any) {
    throw Error("Reservation Check Data (Update) : Something went wrong");
  }
};

// Delete reservation
export const crud_delete_reservation = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/force/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err) {
    throw Error("Reservation (Delete) : Something went wrong");
  }
};

// Delete many reservations
export const crud_delete_many_reservations = async (
  ids: string[]
): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/force/many`, {
      data: { ids },
    });
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err) {
    throw Error("Reservation (Many Delete) : Something went wrong");
  }
};

// Delete all deleted status reservations
export const crud_delete_all_deleted_reservations = async (): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/force/all`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res;
    }
  } catch (err) {
    throw Error("Reservation (All Delete) : Something went wrong");
  }
};
