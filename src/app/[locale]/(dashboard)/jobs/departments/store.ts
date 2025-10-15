import JobDepartmentInterface from "@/interfaces/job-department.interface";
import { create } from "zustand";

// The Job departments Page store (with zustand)

interface StoreType {
  departments_list: JobDepartmentInterface[];
  departments_number: number;

  // actions
  set_many: (departments: JobDepartmentInterface[]) => void;
  add_department: (department: JobDepartmentInterface) => void;
  remove_department: (id: string) => void;
  remove_many_departments: (ids: string[]) => void;
  update_department: (id: string, department: JobDepartmentInterface) => void;

  set_total: (num: number) => void;
}

const useJobDepartmentsStore = create<StoreType>((set) => ({
  departments_list: [],
  departments_number: 0,

  // set many
  set_many: (departments) =>
    set(() => ({
      departments_list: departments,
    })),

  // actions
  add_department: (department) =>
    set((old) => ({
      departments_list: [department, ...old.departments_list],
      departments_number: old.departments_number + 1,
    })),

  // remove department
  remove_department: (id) =>
    set((old) => ({
      departments_list: old.departments_list.filter((e) => e.id !== id),
      departments_number: old.departments_number - 1,
    })),

  // update department
  update_department: (id, department) =>
    set((old) => ({
      departments_list: old.departments_list.map((e) =>
        e.id == id ? department : e
      ),
    })),

  // remove many departments
  remove_many_departments: (ids) =>
    set((old) => ({
      departments_list: old.departments_list.filter((e) => !ids.includes(e.id)),
      departments_number: old.departments_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      departments_number: num,
    })),
}));

export default useJobDepartmentsStore;
