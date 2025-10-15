import RoleInterface from "@/interfaces/role.interface";
import { create } from "zustand";

// The Roles Page store (with zustand)

interface StoreType {
  roles_list: RoleInterface[];
  roles_number: number;

  // actions
  set_many: (roles: RoleInterface[]) => void;
  add_role: (role: RoleInterface) => void;
  remove_role: (id: string) => void;
  remove_many_roles: (ids: string[]) => void;
  update_role: (id: string, role: RoleInterface) => void;

  set_total: (num: number) => void;
}

const useRolesStore = create<StoreType>((set) => ({
  roles_list: [],
  roles_number: 0,

  // set many
  set_many: (roles) =>
    set(() => ({
      roles_list: roles,
    })),

  // actions
  add_role: (role) =>
    set((old) => ({
      roles_list: [role, ...old.roles_list],
      roles_number: old.roles_number + 1,
    })),

  // remove role
  remove_role: (id) =>
    set((old) => ({
      roles_list: old.roles_list.filter((e) => e.id !== id),
      roles_number: old.roles_number - 1,
    })),

  // remove many roles
  remove_many_roles: (ids) =>
    set((old) => ({
      roles_list: old.roles_list.filter((e) => !ids.includes(e.id)),
      roles_number: old.roles_number - ids.length,
    })),

  // update role
  update_role: (id, role) =>
    set((old) => ({
      roles_list: old.roles_list.map((e) => (e.id == id ? role : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      roles_number: num,
    })),
}));

export default useRolesStore;
