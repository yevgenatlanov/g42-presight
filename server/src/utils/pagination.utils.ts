import {
  DEFAULT_FILTER,
  PaginatedResponseDto,
  UserFilterDto,
} from "../user/dto/user.dto";

export function paginate<T>(
  items: T[],
  filters: UserFilterDto
): PaginatedResponseDto<T> {
  const page = filters.page || DEFAULT_FILTER.page!;
  const limit = filters.limit || DEFAULT_FILTER.limit!;

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  const data = items.slice(startIndex, endIndex);

  return {
    success: true,
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
