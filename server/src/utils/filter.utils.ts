import { User } from "../user/entity/user.entity";
import {
  DEFAULT_FILTER,
  FilterCountItem,
  UserFilterDto,
} from "../user/dto/user.dto";

export function filterUsers(users: User[], filter: UserFilterDto): User[] {
  let result = [...users];

  if (filter.search) {
    const searchTerm = filter.search.toLowerCase();
    result = result.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm)
    );
  }

  if (filter.nationality) {
    result = result.filter(
      (user) =>
        user.nationality.toLowerCase() === filter.nationality!.toLowerCase()
    );
  }

  if (filter.hobby) {
    const hobbyTerm = filter.hobby.toLowerCase();
    result = result.filter((user) =>
      user.hobbies.some((hobby: string) =>
        hobby.toLowerCase().includes(hobbyTerm)
      )
    );
  }

  const sortField = filter.sort || DEFAULT_FILTER.sort!;
  const sortOrder = filter.order || DEFAULT_FILTER.order!;

  result.sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "ASC"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "ASC" ? valueA - valueB : valueB - valueA;
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return sortOrder === "ASC"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    return 0;
  });

  return result;
}

export function countOccurrences(
  values: string[],
  limit = 20
): FilterCountItem[] {
  const counts = values.reduce(
    (acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
