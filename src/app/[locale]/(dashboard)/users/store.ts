import { UserInterface } from "@/interfaces/user.interfaces";
import { create } from "zustand";

// The Users Page store (with zustand)

interface StoreType {
  users_list: UserInterface[];
  users_number: number;

  // actions
  set_many: (users: UserInterface[]) => void;
  add_user: (user: UserInterface) => void;
  remove_user: (id: string) => void;
  remove_many_users: (ids: string[]) => void;
  update_user: (id: string, user: UserInterface) => void;
  update_user_active_status: (id: string, active: boolean) => void;
  set_total: (num: number) => void;
}

const useUsersStore = create<StoreType>((set) => ({
  users_list: [],
  users_number: 0,

  // set many
  set_many: (users) =>
    set(() => ({
      users_list: users,
    })),

  // actions
  add_user: (user) =>
    set((old) => ({
      users_list: [user, ...old.users_list],
      users_number: old.users_number + 1,
    })),

  // remove user
  remove_user: (id) =>
    set((old) => ({
      users_list: old.users_list.filter((e) => e.id !== id),
      users_number: old.users_number - 1,
    })),

  // remove many users
  remove_many_users: (ids) =>
    set((old) => ({
      users_list: old.users_list.filter((e) => !ids.includes(e.id)),
      users_number: old.users_number - ids.length,
    })),

  // update user
  update_user: (id, user) =>
    set((old) => ({
      users_list: old.users_list.map((e) => (e.id == id ? user : e)),
    })),

  // update user active status
  update_user_active_status: (id, active) =>
    set((old) => ({
      users_list: old.users_list.map((user) =>
        user.id == id ? { ...user, access: { ...user.access, active } } : user
      ),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      users_number: num,
    })),
}));

export default useUsersStore;
