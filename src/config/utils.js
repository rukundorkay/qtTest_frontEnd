import Cookies from "js-cookie";

export const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL
export const token = Cookies.get("token");
export const apiConfig = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  