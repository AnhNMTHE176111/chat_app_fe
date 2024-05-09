import axios, { AxiosError, AxiosResponse } from "axios";
import { URI } from "../constants/uri.constants";

const client = axios.create({
  baseURL: URI.DOMAIN,
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
