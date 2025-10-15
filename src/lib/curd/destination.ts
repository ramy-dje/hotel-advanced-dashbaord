import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import DestinationInterface, {
  CreateDestinationInterface,
} from "@/interfaces/destination.interface";

// The axios destinations curd logic

const apiURL = "destinations";

// get all destinations with pagination
export const crud_get_all_destinations = async (
  pagination: RequestAPIPaginationInterface
): Promise<DestinationInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<DestinationInterface>
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
    throw Error("Destination (Get-All) : Something went wrong");
  }
};

// get destinations by id
export const crud_get_destination_by_id = async (
  id: string
): Promise<DestinationInterface> => {
  try {
    const res = await axiosAPI.get<DestinationInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Destination (Get) : Something went wrong");
  }
};

// Create destinations
export const crud_create_destination = async (
  destination: CreateDestinationInterface
): Promise<DestinationInterface> => {
  try {
    const res = await axiosAPI.post<DestinationInterface>(apiURL, destination);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409;
    }
    console.log("CREATE :", err);
    throw Error("Destination (Create) : Something went wrong");
  }
};

// Update destinations
export const crud_update_destination = async (
  id: string,
  destination: Partial<CreateDestinationInterface>
): Promise<DestinationInterface> => {
  try {
    const res = await axiosAPI.put<DestinationInterface>(
      `${apiURL}/${id}`,
      destination
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; //
    }
    console.log("UPDATE :", err);
    throw Error("Destination (Update) : Something went wrong");
  }
};

// Delete destinations
export const crud_delete_destination = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403;
    }
    console.log("DELETE :", err);
    throw Error("Destination (Delete) : Something went wrong");
  }
};

// Delete many destinations
export const crud_delete_many_destinations = async (
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
    throw Error("Destination Many (Delete) : Something went wrong");
  }
};
