import axios, { AxiosResponse } from "axios";

export const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleRequest = async <T>(request: Promise<AxiosResponse<T>>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    console.error("API request failed:", error.response?.data || error.message);
    throw error;
  }
};
