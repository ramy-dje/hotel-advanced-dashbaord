import JobSubmissionInterface, {
  CreateJobSubmissionInterface,
} from "@/interfaces/job-submission.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios job submissions curd logic

const apiURL = "jobs/submissions";

// get all job submissions with pagination
export const crud_get_all_job_submissions = async (
  pagination: RequestAPIPaginationInterface
): Promise<JobSubmissionInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<JobSubmissionInterface>
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
    throw Error("Job Submissions (Get-All) : Something went wrong");
  }
};

// get job submission by id
export const crud_get_job_submission_by_id = async (
  id: string
): Promise<JobSubmissionInterface> => {
  try {
    const res = await axiosAPI.get<JobSubmissionInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Job Submissions (Get) : Something went wrong");
  }
};

// Create job submission
export const crud_create_job_submission = async (
  submission: CreateJobSubmissionInterface
): Promise<JobSubmissionInterface> => {
  try {
    const res = await axiosAPI.post<JobSubmissionInterface>(apiURL, submission);
    if (res.status == 201 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    console.log("CREATE :", err);
    throw Error("Job Submissions (Create) : Something went wrong");
  }
};

// Delete job department
export const crud_delete_job_submission = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // department is used in other jobs
    }
    console.log("DELETE :", err);
    throw Error("Job Submissions (Delete) : Something went wrong");
  }
};

// Delete many job submissions
export const crud_delete_many_job_submissions = async (
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
    throw Error("Job Submissions Many (Delete) : Something went wrong");
  }
};
