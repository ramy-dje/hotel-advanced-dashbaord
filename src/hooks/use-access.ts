import { UserAccessInfoType } from "@/interfaces/user.interfaces";
import { AccessPermissionsCTX } from "@/providers/access-permissions.provider";
import { useCallback, useContext } from "react";

// The useAccess hook is used to get the access permissions & role info from the context

interface ReturnedType {
  role: UserAccessInfoType["role"];
  permissions: UserAccessInfoType["permissions"];
  has: (permissions: UserAccessInfoType["permissions"]) => boolean;
}

// The hasPermissions type
export type hasPermissionsMethodType = ReturnedType["has"];

// the hook function logic
const useAccess = (): ReturnedType => {
  const info = useContext(AccessPermissionsCTX);

  // has (a method for checking if the permissions exists in the user's permissions )

  const has = useCallback((permissions: UserAccessInfoType["permissions"]) => {
    const all_exist = permissions
      .map((perm) => info.permissions.includes(perm))
      .every((e) => e);

    return all_exist;
  }, []);

  return { ...info, has };
};

export default useAccess;
