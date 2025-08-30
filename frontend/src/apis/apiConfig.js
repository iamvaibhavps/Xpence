import axios from "axios";
import { store } from "../redux/store";
import {
  showErrorToast,
  showWarningToast,
} from "../components/ToastNotification";
import { logout } from "../redux/Slices/userSlice";

const api = axios.create({
  baseURL: "https://xpence.onrender.com/api",
});

const rateLimitedEndpoints = new Map();

let networkErrorToastShown = false;
let sessionExpiredToastShown = false;
let rateLimitToastShown = false;

api.interceptors.request.use(
  (config) => {
    const currentUser = store.getState().user.user;

    if (currentUser?.token) {
      config.headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    const endpoint = config.url;
    if (rateLimitedEndpoints.has(endpoint)) {
      const expiryTime = rateLimitedEndpoints.get(endpoint);

      if (Date.now() < expiryTime) {
        const error = new Error("Rate limit exceeded for this endpoint");
        error.isRateLimited = true;
        error.retryAfter = new Date(expiryTime);

        if (!rateLimitToastShown) {
          rateLimitToastShown = true;
          showWarningToast(
            "Rate limit exceeded. Please try again later.",
            7000
          );
          setTimeout(() => (rateLimitToastShown = false), 5000);
        }

        return Promise.reject(error);
      } else {
        rateLimitedEndpoints.delete(endpoint);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    console.error("Axios Error:", error);

    if (!response && error.code === "ERR_NETWORK") {
      if (!networkErrorToastShown) {
        networkErrorToastShown = true;
        showErrorToast(
          "No internet connection detected. Please check your network and try again.",
          7000
        );
        setTimeout(() => (networkErrorToastShown = false), 5000);
      }
      return Promise.reject(
        new Error("Network error: Please check your connection.")
      );
    }

    if (response?.status === 401 && !sessionExpiredToastShown) {
      sessionExpiredToastShown = true;
      store.dispatch(logout());
      showWarningToast("Your session has expired. Please log in again.", 7000);
      setTimeout(() => (sessionExpiredToastShown = false), 5000);
    }

    if (response?.status === 429) {
      const endpoint = error.config.url;
      let retryAfterMs = 15 * 60 * 1000;

      if (response.headers["retry-after"]) {
        retryAfterMs = parseInt(response.headers["retry-after"]) * 1000;
      }

      const expiryTime = Date.now() + retryAfterMs;
      rateLimitedEndpoints.set(endpoint, expiryTime);

      if (!rateLimitToastShown) {
        rateLimitToastShown = true;
        showWarningToast(
          response.data?.message ||
            "Rate limit exceeded. Please try again later.",
          7000
        );
        setTimeout(() => (rateLimitToastShown = false), 5000);
      }

      error.isRateLimited = true;
      error.retryAfter = new Date(expiryTime);
    }

    if (response?.status >= 500) {
      showErrorToast(
        response.data?.msg || "An unexpected server error occurred.",
        7000
      );
    }

    return Promise.reject(error);
  }
);

export { api };
