import axios from "axios";
import handleRetryLogic from "./retry";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL; // This's in the dev;

// Handle the retrying logic
const axiosAPI = handleRetryLogic(
  axios.create({
    // base URL
    baseURL: baseURL,
    // timeout
    timeout: 5000,
    // timeout error
    timeoutErrorMessage: "ERR_TIMEOUT",
    // credentials
    withCredentials: true,
  })
);

// verify the user before the req
axiosAPI.interceptors.request.use((config) => {
  return config;
});

export default axiosAPI;
