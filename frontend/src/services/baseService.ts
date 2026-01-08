import axios, { AxiosResponse } from "axios";

export const API_URL = "https://flakbygg-backend-production.up.railway.app";

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
