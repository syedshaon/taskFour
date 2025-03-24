import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://your-api-url.com", // Set your API base URL
});

export default axiosInstance;
