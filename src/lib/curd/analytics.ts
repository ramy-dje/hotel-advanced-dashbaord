import axiosAPI from "../axios";
import {
  BlogsAnalyticsInterface,
  CRMContactAnalyticsInterface,
  DestinationsAnalyticsInterface,
  JobsAnalyticsInterface,
  ReservationsAnalyticsInterface,
  RoomAnalyticsInterface,
} from "@/interfaces/analytics";

// The axios analytics fetch logic

const apiURL = "analytics";

// get rooms analytics
export const crud_get_analytics_rooms =
  async (): Promise<RoomAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<RoomAnalyticsInterface>(`${apiURL}/rooms`);

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics Rooms:", err);
      throw Error("Analytics Rooms (Get) : Something went wrong");
    }
  };

// get reservations analytics
export const crud_get_analytics_reservations =
  async (): Promise<ReservationsAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<ReservationsAnalyticsInterface>(
        `${apiURL}/reservations`
      );

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics Reservations:", err);
      throw Error("Analytics Reservations (Get) : Something went wrong");
    }
  };

// get blogs analytics
export const crud_get_analytics_blogs =
  async (): Promise<BlogsAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<BlogsAnalyticsInterface>(
        `${apiURL}/blogs`
      );

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics Blogs:", err);
      throw Error("Analytics Blogs (Get) : Something went wrong");
    }
  };

// get destinations analytics
export const crud_get_analytics_destinations =
  async (): Promise<DestinationsAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<DestinationsAnalyticsInterface>(
        `${apiURL}/destinations`
      );

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics Destinations:", err);
      throw Error("Analytics Destinations (Get) : Something went wrong");
    }
  };

// get jobs analytics
export const crud_get_analytics_jobs =
  async (): Promise<JobsAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<JobsAnalyticsInterface>(`${apiURL}/jobs`);

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics Jobs:", err);
      throw Error("Analytics Jobs (Get) : Something went wrong");
    }
  };

// get crm contacts analytics
export const crud_get_analytics_crm_contacts =
  async (): Promise<CRMContactAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<CRMContactAnalyticsInterface>(
        `${apiURL}/crm-contacts`
      );

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics CRM Contacts:", err);
      throw Error("Analytics CRM Contacts (Get) : Something went wrong");
    }
  };

// get crm companies analytics
export const crud_get_analytics_crm_companies =
  async (): Promise<CRMContactAnalyticsInterface> => {
    try {
      // fetch the data
      const res = await axiosAPI.get<CRMContactAnalyticsInterface>(
        `${apiURL}/crm-companies`
      );

      if ((res.status === 200, res.data)) {
        return res.data;
      } else {
        throw res;
      }
    } catch (err: any) {
      console.log("GET Analytics CRM Companies:", err);
      throw Error("Analytics CRM Companies (Get) : Something went wrong");
    }
  };
