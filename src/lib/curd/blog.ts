import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";
import BlogInterface, {
  CreateBlogInterface,
} from "@/interfaces/blog.interface";

// The axios blogs curd logic

const apiURL = "blogs";

// get all blogs with pagination
export const crud_get_all_blogs = async (
  pagination: RequestAPIPaginationInterface
): Promise<BlogInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<BlogInterface>
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
    throw Error("Blogs (Get-All) : Something went wrong");
  }
};

// get blog by id
export const crud_get_blog_by_id = async (
  id: string
): Promise<BlogInterface> => {
  try {
    const res = await axiosAPI.get<BlogInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Blogs (Get) : Something went wrong");
  }
};

// Create blog
export const crud_create_blog = async (
  blog: CreateBlogInterface
): Promise<BlogInterface> => {
  try {
    const res = await axiosAPI.post<BlogInterface>(apiURL, blog);
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
    throw Error("Blogs (Create) : Something went wrong");
  }
};

// Update blog
export const crud_update_blog = async (
  id: string,
  blog: Partial<CreateBlogInterface>
): Promise<BlogInterface> => {
  try {
    const res = await axiosAPI.put<BlogInterface>(`${apiURL}/${id}`, blog);
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
    throw Error("Blogs (Update) : Something went wrong");
  }
};

// Delete blog
export const crud_delete_blog = async (id: string): Promise<200> => {
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
    throw Error("Blogs (Delete) : Something went wrong");
  }
};

// Delete many blogs
export const crud_delete_many_blogs = async (ids: string[]): Promise<200> => {
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
    throw Error("Blogs Many (Delete) : Something went wrong");
  }
};
