import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://10.138.219.222:8000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      config.headers.Authorizationr = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
