import BlogInterface from "@/interfaces/blog.interface";
import { create } from "zustand";

// The Blogs Page store (with zustand)

interface StoreType {
  blogs_list: BlogInterface[];
  blogs_number: number;

  // actions
  set_many: (blogs: BlogInterface[]) => void;
  add_blog: (blog: BlogInterface) => void;
  remove_blog: (id: string) => void;
  remove_many_blogs: (ids: string[]) => void;
  update_blog: (id: string, blog: BlogInterface) => void;

  set_total: (num: number) => void;
}

const useBlogsStore = create<StoreType>((set) => ({
  blogs_list: [],
  blogs_number: 0,

  // set many
  set_many: (blogs) =>
    set(() => ({
      blogs_list: blogs,
    })),

  // actions
  add_blog: (blog) =>
    set((old) => ({
      blogs_list: [blog, ...old.blogs_list],
      blogs_number: old.blogs_number + 1,
    })),

  // remove blog
  remove_blog: (id) =>
    set((old) => ({
      blogs_list: old.blogs_list.filter((e) => e.id !== id),
      blogs_number: old.blogs_number - 1,
    })),

  // update blog
  update_blog: (id, blog) =>
    set((old) => ({
      blogs_list: old.blogs_list.map((e) => (e.id == id ? blog : e)),
    })),

  // remove many blogs
  remove_many_blogs: (ids) =>
    set((old) => ({
      blogs_list: old.blogs_list.filter((e) => !ids.includes(e.id)),
      blogs_number: old.blogs_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      blogs_number: num,
    })),
}));

export default useBlogsStore;
