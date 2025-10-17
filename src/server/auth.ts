import UserInterfaceType from "@/interfaces/user.interfaces";
import { cookies } from "next/headers";

// The server side auth

// Provide a default fake user for server components so pages render freely
const defaultServerUser: UserInterfaceType = {
  id: "server-guest",
  role: "User",
  pic: "",
  phoneNumber: [],
  location: { country: "", state: "", city: "", zipcode: "" },
  gender: "male",
  username: "guest",
  fullName: "Guest User",
  email: "guest@example.local",
};

// Get Server Auth
export const getServerAuth = async (): Promise<UserInterfaceType | null> => {
  try {
    // Do not call external auth API; return a permissive fake user so UI is visible
  // If needed, cookies could be inspected, but in permissive mode we ignore them
  await cookies();
  // Return the default permissive user
    return defaultServerUser;
  } catch {
    return defaultServerUser;
  }
};
