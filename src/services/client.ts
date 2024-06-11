import axios, { AxiosError, AxiosResponse } from "axios";
import { URI } from "../constants/uri.constants";

const client = axios.create({
  baseURL: URI.DOMAIN,
  withCredentials: true,
  timeout: 20000,
  timeoutErrorMessage: "The connection has timed out",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin":
      "https://tuananh-test.d18jf58l2w76jl.amplifyapp.com",
  },
});

client.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { client };
