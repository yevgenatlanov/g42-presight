export interface User {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface FilterCountItem {
  value: string;
  count: number;
}

export interface FilterOptions {
  nationalities: FilterCountItem[];
  hobbies: FilterCountItem[];
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  metadata: PaginationMetadata;
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptions;
}

export interface UserFilter {
  page: number;
  limit: number;
  search?: string;
  nationality?: string;
  hobby?: string;
  sort?: keyof User;
  order?: "ASC" | "DESC";
}
