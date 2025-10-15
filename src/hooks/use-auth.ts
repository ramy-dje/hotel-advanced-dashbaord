import { useRouter } from "@/i18n/routing";
import UserInterfaceType from "@/interfaces/user.interfaces";
import {
  auth_isAuthenticated,
  auth_login,
  auth_logout,
  auth_refresh_token,
} from "@/lib/auth";
import { useState } from "react";
import useAuthStore from "./use-auth-store";

// The auth logic hook

interface ReturnedType {
  // props
  user: null | UserInterfaceType;
  isAuthenticated: boolean;
  isLoading: boolean;
  // methods
  login: (email: string, password: string) => Promise<200 | 400 | 500 | 403>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<200 | 400>;
  refreshUser: () => Promise<200 | 500>;
}

const useAuth = (): ReturnedType => {
  const { refresh, replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // auth store hook
  const { user, auth: isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // methods

  // refresh auth
  const refreshAuth: ReturnedType["refreshAuth"] = async () => {
    // setting the loading state
    setIsLoading(true);
    try {
      const res = await auth_isAuthenticated();
      // setting the loading state
      setIsLoading(false);
      if (res && res?.email) {
        // if the user exists
        // set the user in the store
        setAuth(res, true);
        return 200;
      } else {
        return 400;
      }
    } catch (err) {
      // setting the loading state
      setIsLoading(false);
      return 400;
    }
  };

  // update user data & token
  const refreshUser: ReturnedType["refreshUser"] = async () => {
    // setting the loading state
    setIsLoading(true);
    try {
      // refresh the token with the new body
      await auth_refresh_token();
      // login here
      // get new user data
      const res = await auth_isAuthenticated();
      // set the user
      if (res && res?.email) {
        // set the user in the store
        setAuth(res, true);
        return 200;
      } else {
        return 500;
      }
    } catch (err) {
      // setting the loading state
      setIsLoading(false);
      return 500;
    }
  };

  // login
  const login: ReturnedType["login"] = async (email, password) => {
    // setting the loading state
    setIsLoading(true);
    try {
      const res = await auth_login(email, password);
      // setting the loading state
      setIsLoading(false);
      if (res === 200) {
        // is auth
        await refreshAuth();
        return 200;
      } else if (res === 400 || res == 403) {
        // pass/email is wrong
        return res;
      } else {
        // server error
        return 500;
      }
    } catch (err) {
      // setting the loading state
      setIsLoading(false);
      // server error
      return 500;
    }
  };

  // logout
  const logout: ReturnedType["logout"] = async () => {
    // setting the loading state
    setIsLoading(true);
    try {
      await auth_logout();
      // setting the loading state
      setIsLoading(false);
      // clear the auth
      clearAuth();
      replace("/login");
      refresh();
    } catch (err) {
      // setting the loading state
      setIsLoading(false);
      // remove the user from the store
      clearAuth();
      replace("/login");
      refresh();
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refreshAuth,
    refreshUser,
  };
};

export default useAuth;
