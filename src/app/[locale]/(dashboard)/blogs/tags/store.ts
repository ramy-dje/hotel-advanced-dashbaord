import BlogTagInterface from "@/interfaces/blog-tag.interface";
import { create } from "zustand";

// The Blogs Tags Page store (with zustand)

interface StoreType {
  tags_list: BlogTagInterface[];
  tags_number: number;

  // actions
  set_many: (tags: BlogTagInterface[]) => void;
  add_tag: (tag: BlogTagInterface) => void;
  remove_tag: (id: string) => void;
  remove_many_tags: (ids: string[]) => void;
  update_tag: (id: string, tag: BlogTagInterface) => void;

  set_total: (num: number) => void;
}

const useBlogTagsStore = create<StoreType>((set) => ({
  tags_list: [],
  tags_number: 0,

  // set many
  set_many: (tags) =>
    set(() => ({
      tags_list: tags,
    })),

  // actions
  add_tag: (tag) =>
    set((old) => ({
      tags_list: [...old.tags_list, tag],
      tags_number: old.tags_number + 1,
    })),

  // remove tag
  remove_tag: (id) =>
    set((old) => ({
      tags_list: old.tags_list.filter((e) => e.id !== id),
      tags_number: old.tags_number - 1,
    })),

  // update tag
  update_tag: (id, tag) =>
    set((old) => ({
      tags_list: old.tags_list.map((e) => (e.id == id ? tag : e)),
    })),

  // remove many tags
  remove_many_tags: (ids) =>
    set((old) => ({
      tags_list: old.tags_list.filter((e) => !ids.includes(e.id)),
      tags_number: old.tags_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      tags_number: num,
    })),
}));

export default useBlogTagsStore;
