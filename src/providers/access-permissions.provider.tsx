"use client";
import { UserAccessInfoType } from "@/interfaces/user.interfaces";
import { createContext, useMemo } from "react";

// The is the provider that will be used to provide the access permissions to the components

// CTX logic

interface CTX {
  permissions: UserAccessInfoType["permissions"];
  role: UserAccessInfoType["role"];
}

export const AccessPermissionsCTX = createContext<CTX>({} as CTX);

// Provider logic

interface Props {
  children: React.ReactNode;
  access_info: UserAccessInfoType; // will come from the server side component
}

export default function AccessPermissionsProvider({
  children,
  access_info,
}: Props) {
  // the access info memoized
  const access = useMemo(() => {
    return access_info;
  }, []);

  return (
    <AccessPermissionsCTX.Provider value={access}>
      {children}
    </AccessPermissionsCTX.Provider>
  );
}
