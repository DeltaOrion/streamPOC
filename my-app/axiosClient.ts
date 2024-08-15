import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:5000", // Replace with your backend URL
  timeout: 10000, // Set a timeout for the requests (optional)
  headers: {
    "Content-Type": "application/json",
  },
});
