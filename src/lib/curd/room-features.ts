import slugify from "slugify";
import axiosAPI from "../axios";
import RoomFeatureInterface, {
  CreateRoomFeatureInterface,
} from "@/interfaces/room-feature.interface";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios room features curd logic

const apiURL = "room-details/room-features";

// get all features with pagination
export const crud_get_all_roomFeatures = async (
  pagination: RequestAPIPaginationInterface
): Promise<RoomFeatureInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<RoomFeatureInterface>
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
    throw Error("RoomFeature (Get-All) : Something went wrong");
  }
};

// Create room feature
export const crud_create_roomFeature = async (
  payload: Omit<CreateRoomFeatureInterface, "slug">
): Promise<RoomFeatureInterface> => {
  // prepare the body
  const body: CreateRoomFeatureInterface = {
    name: payload.name,
    icon: payload.icon,
    slug: slugify(payload.name, { lower: true, trim: true }),
  };
  try {
    const res = await axiosAPI.post<RoomFeatureInterface>(apiURL, body);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("CREATE :", err);
    throw Error("RoomFeature (Create) : Something went wrong");
  }
};

// Update room feature
export const crud_update_roomFeature = async (
  id: string,
  payload: Partial<Omit<CreateRoomFeatureInterface, "slug">>
): Promise<RoomFeatureInterface> => {
  // prepare the rea body
  const body: Partial<CreateRoomFeatureInterface> = {
    name: payload.name,
    icon: payload.icon,
  };

  // set slug
  if (payload.name) {
    body.slug = slugify(payload.name, { lower: true, trim: true });
  }

  try {
    const res = await axiosAPI.put<RoomFeatureInterface>(
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
    throw Error("RoomFeature (Update) : Something went wrong");
  }
};

// Delete room feature
export const crud_delete_roomFeature = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err) {
    console.log("DELETE :", err);
    throw Error("RoomFeature (Delete) : Something went wrong");
  }
};

// Delete many room features
export const crud_delete_many_room_features = async (
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
    throw Error("RoomFeatures (Delete) : Something went wrong");
  }
};
