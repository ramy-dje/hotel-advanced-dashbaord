import { cache } from "react";
import { getServerPermissions } from "@/server/permissions";

// Cache the permissions method (to be used across server components)
export const cachedGetServerPermissions = cache(getServerPermissions);
