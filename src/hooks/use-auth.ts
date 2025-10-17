import UserInterfaceType from "@/interfaces/user.interfaces";
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
  // router not needed in permissive mode
  const [isLoading, setIsLoading] = useState(false);
  // auth store hook
  const { user, auth: isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // methods

  // refresh auth - make permissive / no-op to avoid network calls
  const refreshAuth: ReturnedType["refreshAuth"] = async () => {
    setIsLoading(false);
    // pretend success
    setAuth(user ?? null, true);
    return 200;
  };

  // update user data & token
  const refreshUser: ReturnedType["refreshUser"] = async () => {
    // no-op, pretend refreshed
    setIsLoading(false);
    return 200;
  };

  // login
  const login: ReturnedType["login"] = async () => {
    // fake login success
    setIsLoading(false);
    setAuth(user ?? null, true);
    return 200;
  };

  // logout
  const logout: ReturnedType["logout"] = async () => {
    // no-op logout: clear auth but don't redirect
    setIsLoading(false);
    clearAuth();
    return;
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
