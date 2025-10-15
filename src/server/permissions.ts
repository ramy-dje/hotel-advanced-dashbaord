import { UserAccessInfoType } from "@/interfaces/user.interfaces";
import axios from "axios";
import { cookies } from "next/headers";

// the server side roles & permissions logic

// server url
const serverURL = process.env.NEXT_PUBLIC_BASE_URL;
const access_bearer_token = process.env.NEXTSERVER_AUTH_BEARER_TOKEN;

// Get Server Permissions
export const getServerPermissions =
  async (): Promise<UserAccessInfoType | null> => {
    const coo = await cookies();

    // get the tokens
    const acc_token = coo.get("acc-t")?.value || null;
    const ref_token = coo.get("ref-t")?.value || null;

    // if of the tokens doesn't exist

    if (!acc_token || !ref_token) {
      return null;
    }

    // check the token from the main server
    try {
      // send req to validate the cookies of the user
      const res = await axios.post<{
        authenticated: boolean;
        access: UserAccessInfoType;
      }>(
        "auth/server/access",
        {
          access_token: acc_token,
          refresh_token: ref_token,
        },
        {
          baseURL: serverURL,
          headers: {
            Authorization: `Bearer ${access_bearer_token}`,
          },
        }
      );
      // if the cookies are valid
      if (res.status == 200 && res.data.authenticated && res.data) {
        return res.data.access;
      } else {
        return null;
      }
    } catch (err) {
      console.log("AUTH-CHECK ERROR :", err);
      return null;
    }
  };
