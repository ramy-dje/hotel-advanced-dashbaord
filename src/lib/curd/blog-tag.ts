import BlogTagInterface, {
  CreateBlogTagInterface,
} from "@/interfaces/blog-tag.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios blog tag curd logic

const apiURL = "blogs-tags";

// get all blog tags with pagination
export const crud_get_all_blog_tags = async (
  pagination: RequestAPIPaginationInterface
): Promise<BlogTagInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<BlogTagInterface>
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
    throw Error("Blog Tag (Get-All) : Something went wrong");
  }
};

// get blog tag by id
export const crud_get_blog_tag_by_id = async (
  id: string
): Promise<BlogTagInterface> => {
  try {
    const res = await axiosAPI.get<BlogTagInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Blog Tag (Get) : Something went wrong");
  }
};

// Create blog tag
export const crud_create_blog_tag = async (
  tag_name: string
): Promise<BlogTagInterface> => {
  // prepare the rea body
  const body: CreateBlogTagInterface = {
    name: tag_name,
  };
  try {
    const res = await axiosAPI.post<BlogTagInterface>(apiURL, body);
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
    throw Error("Blog Tag (Create) : Something went wrong");
  }
};

// Update blog tag
export const crud_update_blog_tag = async (
  id: string,
  tag_name: string
): Promise<BlogTagInterface> => {
  // prepare the rea body
  const body: Partial<CreateBlogTagInterface> = {
    name: tag_name,
  };
  try {
    const res = await axiosAPI.put<BlogTagInterface>(`${apiURL}/${id}`, body);
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
    throw Error("Blog Tag (Update) : Something went wrong");
  }
};

// Delete blog tag
export const crud_delete_blog_tag = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // tag is used in other dishes
    }
    console.log("DELETE :", err);
    throw Error("Blog Tag (Delete) : Something went wrong");
  }
};

// Delete many blog tags
export const crud_delete_many_blog_tags = async (
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
    throw Error("Blog Tag Many (Delete) : Something went wrong");
  }
};
