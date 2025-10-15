import JobDepartmentInterface, {
  CreateJobDepartmentInterface,
} from "@/interfaces/job-department.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios job departments curd logic

const apiURL = "jobs/departments";

// get all job departments with pagination
export const crud_get_all_job_departments = async (
  pagination: RequestAPIPaginationInterface
): Promise<JobDepartmentInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<JobDepartmentInterface>
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
    throw Error("Job Departments (Get-All) : Something went wrong");
  }
};

// get job department by id
export const crud_get_job_department_by_id = async (
  id: string
): Promise<JobDepartmentInterface> => {
  try {
    const res = await axiosAPI.get<JobDepartmentInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Job Departments (Get) : Something went wrong");
  }
};

// Create job department
export const crud_create_job_department = async (
  department_name: string
): Promise<JobDepartmentInterface> => {
  // prepare the rea body
  const body: CreateJobDepartmentInterface = {
    name: department_name,
  };
  try {
    const res = await axiosAPI.post<JobDepartmentInterface>(apiURL, body);
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
    throw Error("Job Departments (Create) : Something went wrong");
  }
};

// Update job department
export const crud_update_job_department = async (
  id: string,
  department_name: string
): Promise<JobDepartmentInterface> => {
  // prepare the rea body
  const body: Partial<CreateJobDepartmentInterface> = {
    name: department_name,
  };
  try {
    const res = await axiosAPI.put<JobDepartmentInterface>(
      `${apiURL}/${id}`,
      body
    );
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 409) {
      throw 409; // conflict in the name or the level
    }
    console.log("UPDATE :", err);
    throw Error("Job Departments (Update) : Something went wrong");
  }
};

// Delete job department
export const crud_delete_job_department = async (id: string): Promise<200> => {
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
    throw Error("Job Departments (Delete) : Something went wrong");
  }
};

// Delete many job departments
export const crud_delete_many_job_departments = async (
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
    throw Error("Job Departments Many (Delete) : Something went wrong");
  }
};
