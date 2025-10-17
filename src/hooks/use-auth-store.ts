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

const defaultFakeUser: UserInterfaceType = {
  id: "local-guest",
  role: "User",
  pic: "",
  phoneNumber: [],
  location: { country: "", state: "", city: "", zipcode: "" },
  gender: "male",
  username: "guest",
  fullName: "Guest User",
  email: "guest@example.local",
};

const useAuthStore = create<StoreType>((set) => ({
  // default to authenticated so UI renders all buttons and navigation
  auth: true,
  user: defaultFakeUser,

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
