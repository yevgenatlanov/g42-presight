import { User } from "../entity/user.entity";

// DTO here is for adequeate data exchange and for safety of my neural system

export interface UserFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  nationality?: string;
  hobby?: string;
  sort?: keyof User;
  order?: "ASC" | "DESC";
}

export const DEFAULT_FILTER: UserFilterDto = {
  page: 1,
  limit: 20,
  sort: "lastName",
  order: "ASC",
};

export const VALID_SORT_FIELDS: Array<keyof User> = [
  "firstName",
  "lastName",
  "age",
  "nationality",
  "createdAt",
  "updatedAt",
];

export interface PaginatedResponseDto<T> {
  success: boolean;
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FilterCountItem {
  value: string;
  count: number;
}

export interface FilterOptionsDto {
  success: boolean;
  data: {
    nationalities: FilterCountItem[];
    hobbies: FilterCountItem[];
  };
}

export interface UserResponseDto {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const mapUserToResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    avatar: user.avatar,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    nationality: user.nationality,
    hobbies: user.hobbies,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
