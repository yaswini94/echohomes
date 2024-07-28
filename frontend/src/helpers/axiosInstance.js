import axios from "axios";
import { supabase } from "../supabase";

// Function to get the JWT token from Supabase authentication
const getAuthToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
  return data?.session?.access_token;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // your API base URL
});

// List of routes that don't require authorization
const excludedRoutes = ["/login", "/register"];

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if the request URL is not in the excluded routes
    if (!excludedRoutes.includes(config.url)) {
      const token = await getAuthToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
