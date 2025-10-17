import { SystemPagesPathTypes } from "@/interfaces/permissions/pages";
import { SystemPermissions } from "@/interfaces/permissions/permissions";
// Intentionally not importing permissions/network helpers in permissive mode.

// A function to check the permissions of the user and redirect's to a specific route if not

export default async function ProtectServerPagePermissions() {
  // Permissive mode: allow access to all pages.
  return;
}
