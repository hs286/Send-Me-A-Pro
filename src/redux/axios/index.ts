import axios from "axios";

let axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  let token = await localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token} `;
  }
  return config;
});

export { axiosInstance };
