import axios from "axios";
import { api_url } from "./ApiHandler";

let AxiosInstance = axios.create({
  baseURL: api_url,
  headers: {
    'Content-Type': 'application/json', // Ensure correct Content-Type
  }
});

AxiosInstance.interceptors.request.use(
  async function (config) {
    // Retrieve token from sessionStorage
    let token = window.localStorage.getItem("token");
    // console.log("Token: ",token);
    

    if (token) {
      // Set the token in the request header 'x-access-token'
      config.headers["x-access-token"] = token;
    }
    return config;
  },

  function (err) {
    return Promise.reject(err);
  }
);

export default AxiosInstance;
