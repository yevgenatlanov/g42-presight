import axios from "axios";
import {
  PaginatedResponse,
  User,
  FilterOptionsResponse,
  UserFilter,
} from "../types";

const API_URL = (import.meta.env.VITE_API_URL || "") + "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsersApi = async (
  filters: UserFilter
): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams();

  // filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      data: [],
      metadata: {
        total: 0,
        page: filters.page,
        limit: filters.limit,
        totalPages: 0,
      },
    };
  }
};

export const getFilterOptionsApi = async (): Promise<FilterOptionsResponse> => {
  try {
    const response = await api.get<FilterOptionsResponse>("/filters");
    return response.data;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      success: false,
      data: {
        nationalities: [],
        hobbies: [],
      },
    };
  }
};
