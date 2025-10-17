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
}: Props) {


  return (
    <div>
      {children}
    </div>
  );
}