import { SystemPagesPathTypes } from "@/interfaces/permissions/pages";
import { SystemPermissions } from "@/interfaces/permissions/permissions";
import { cachedGetServerPermissions } from "@/utils/permissions-utils";
import { redirect } from "next/navigation";

// A function to check the permissions of the user and redirect's to a specific route if not

export default async function ProtectServerPagePermissions(
  permission: SystemPermissions[],
  redirectRoute: SystemPagesPathTypes
) {
  // fetch the cached server permissions
  const access_info = await cachedGetServerPermissions()!;

  // check if the access_info exists
  if (access_info) {
    // check the permissions if they exist in the user's permissions array
    const all_exist = permission
      .map((e) => access_info.permissions.includes(e))
      .every((e) => e);

    // if all exist
    if (all_exist) {
      // return the children
    } else {
      // redirect to the passed route
      return redirect(redirectRoute);
    }
  } else {
    // redirect to the login page
    return redirect("/login");
  }
}
