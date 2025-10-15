import UserInterfaceType from "@/interfaces/user.interfaces";
import { create } from "zustand";

// The auth store (with zustand)

interface StoreType {
  user: UserInterfaceType | null;
  auth: boolean;

  // setAuth
  setAuth: (user: UserInterfaceType | null, auth: boolean) => void;

  // clear auth
  clearAuth: () => void;
}

const useAuthStore = create<StoreType>((set) => ({
  auth: false,
  user: null,

  //   methods

  //   set the auth
  setAuth: (user, auth) =>
    set(() => ({
      auth,
      user,
    })),

  //   clear the auth
  clearAuth: () =>
    set(() => ({
      auth: false,
      user: null,
    })),
}));

export default useAuthStore;
