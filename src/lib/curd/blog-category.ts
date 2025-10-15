import BlogCategoryInterface, {
  CreateBlogCategoryInterface,
} from "@/interfaces/blog-category.interface";
import axiosAPI from "../axios";
import {
  RequestAPIPaginationInterface,
  ResponseAPIPaginationInterface,
} from "@/interfaces/pagination.interface";

// The axios food category curd logic

const apiURL = "blogs-categories";

// get all blog categories with pagination
export const crud_get_all_blog_categories = async (
  pagination: RequestAPIPaginationInterface
): Promise<BlogCategoryInterface[]> => {
  try {
    const res = await axiosAPI.get<
      ResponseAPIPaginationInterface<BlogCategoryInterface>
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
    throw Error("Blog Category (Get-All) : Something went wrong");
  }
};

// get blog category by id
export const crud_get_blog_category_by_id = async (
  id: string
): Promise<BlogCategoryInterface> => {
  try {
    const res = await axiosAPI.get<BlogCategoryInterface>(`${apiURL}/${id}`);
    if (res.status == 200 && res.data) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: any) {
    if (err.status == 404) {
      throw 404;
    }
    throw Error("Blog Category (Get) : Something went wrong");
  }
};

// Create blog category
export const crud_create_blog_category = async (
  category_name: string
): Promise<BlogCategoryInterface> => {
  // prepare the rea body
  const body: CreateBlogCategoryInterface = {
    name: category_name,
  };
  try {
    const res = await axiosAPI.post<BlogCategoryInterface>(apiURL, body);
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
    throw Error("Blog Category (Create) : Something went wrong");
  }
};

// Update blog category
export const crud_update_blog_category = async (
  id: string,
  category_name: string
): Promise<BlogCategoryInterface> => {
  // prepare the rea body
  const body: Partial<CreateBlogCategoryInterface> = {
    name: category_name,
  };
  try {
    const res = await axiosAPI.put<BlogCategoryInterface>(
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
      throw 409; // conflict in the name
    }
    console.log("UPDATE :", err);
    throw Error("Blog Category (Update) : Something went wrong");
  }
};

// Delete blog category
export const crud_delete_blog_category = async (id: string): Promise<200> => {
  try {
    const res = await axiosAPI.delete(`${apiURL}/${id}`);
    if (res.status == 200) {
      return 200;
    } else {
      throw res.status;
    }
  } catch (err: any) {
    if (err.status == 403) {
      throw 403; // category is used in other dishes
    }
    console.log("DELETE :", err);
    throw Error("Blog Category (Delete) : Something went wrong");
  }
};

// Delete many blog categories
export const crud_delete_many_blog_categories = async (
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
    throw Error("Blog Category Many (Delete) : Something went wrong");
  }
};
