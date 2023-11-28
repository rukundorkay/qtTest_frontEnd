import axios from "axios";
import { API_URL } from "./utils";


export const API = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });