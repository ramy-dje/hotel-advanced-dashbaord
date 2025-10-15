import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import JobInterface, { CreateJobInterface } from "@/interfaces/job.interface";

// The axios jobs curd logic

const apiURL = "jobs";

// get all jobs with pagination
export const crud_get_all_jobs = async (
  pagination: RequestAPIPaginationInterface
): Promise<JobInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<JobInterface>
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
    throw Error("Job (Get-All) : Something went wrong");
  }
};

// get job by id
export const crud_get_job_by_id = async (id: string): Promise<JobInterface> => {
  try {
    const res = await axiosAPI.get<JobInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Jobs (Get) : Something went wrong");
  }
};

// Create job
export const crud_create_job = async (
  job: CreateJobInterface
): Promise<JobInterface> => {
  try {
    const res = await axiosAPI.post<JobInterface>(apiURL, job);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name
    }
    console.log("CREATE :", err);
    throw Error("Jobs (Create) : Something went wrong");
  }
};

// Update job
export const crud_update_job = async (
  id: string,
  job: Partial<CreateJobInterface>
): Promise<JobInterface> => {
  try {
    const res = await axiosAPI.put<JobInterface>(`${apiURL}/${id}`, job);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name
    }
    console.log("UPDATE :", err);
    throw Error("Jobs (Update) : Something went wrong");
  }
};

// Delete job
export const crud_delete_job = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // job has submissions
    }
    console.log("DELETE :", err);
    throw Error("Jobs (Delete) : Something went wrong");
  }
};

// Delete many jobs
export const crud_delete_many_jobs = async (ids: string[]): Promise<200> => {
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
    throw Error("Jobs Many (Delete) : Something went wrong");
  }
};
