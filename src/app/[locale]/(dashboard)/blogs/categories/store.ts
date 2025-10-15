import BlogCategoryInterface from "@/interfaces/blog-category.interface";
import { create } from "zustand";

// The Blogs Categories Page store (with zustand)

interface StoreType {
  categories_list: BlogCategoryInterface[];
  categories_number: number;

  // actions
  set_many: (categories: BlogCategoryInterface[]) => void;
  add_category: (category: BlogCategoryInterface) => void;
  remove_category: (id: string) => void;
  remove_many_categories: (ids: string[]) => void;
  update_category: (id: string, category: BlogCategoryInterface) => void;

  set_total: (num: number) => void;
}

const useBlogCategoriesStore = create<StoreType>((set) => ({
  categories_list: [],
  categories_number: 0,

  // set many
  set_many: (categories) =>
    set(() => ({
      categories_list: categories,
    })),

  // actions
  add_category: (category) =>
    set((old) => ({
      categories_list: [...old.categories_list, category],
      categories_number: old.categories_number + 1,
    })),

  // remove category
  remove_category: (id) =>
    set((old) => ({
      categories_list: old.categories_list.filter((e) => e.id !== id),
      categories_number: old.categories_number - 1,
    })),

  // update category
  update_category: (id, category) =>
    set((old) => ({
      categories_list: old.categories_list.map((e) =>
        e.id == id ? category : e
      ),
    })),

  // remove many categories
  remove_many_categories: (ids) =>
    set((old) => ({
      categories_list: old.categories_list.filter((e) => !ids.includes(e.id)),
      categories_number: old.categories_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      categories_number: num,
    })),
}));

export default useBlogCategoriesStore;
