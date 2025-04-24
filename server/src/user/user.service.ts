import { faker } from "@faker-js/faker";
import { User } from "./entity/user.entity";
import { countOccurrences, filterUsers } from "../utils/filter.utils";
import {
  FilterOptionsDto,
  mapUserToResponseDto,
  PaginatedResponseDto,
  UserFilterDto,
  UserResponseDto,
} from "./dto/user.dto";
import { paginate } from "../utils/pagination.utils";
import { NATIONALITIES } from "../const/nationalities.constants";
import { HOBBIES } from "../const/hobbies.constants";
import { DEFAULT_FILTER } from "./dto/user.dto";

// i've used https://fakerjs.dev/ faker version here
// also i don't like faker avatar thing so i've used gravatar and ui-avatar as alternative

export class UserService {
  private users: User[] = [];
  private readonly MAX_HOBBIES = 10;
  private readonly USERS_COUNT = 1000;
  private filterOptionsCache: FilterOptionsDto | null = null;

  constructor() {
    this.generateMockData();
  }

  regenerate(): void {
    this.users = [];
    this.generateMockData();
    this.filterOptionsCache = null;
  }

  findAll(filter: UserFilterDto): PaginatedResponseDto<UserResponseDto> {
    try {
      const normalizedFilter = this.normalizeFilter(filter);
      const filteredUsers = filterUsers(this.users, normalizedFilter);
      const paginatedRes = paginate(filteredUsers, normalizedFilter);

      return {
        ...paginatedRes,
        data: paginatedRes.data.map(mapUserToResponseDto),
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      return {
        success: false,
        data: [],
        metadata: {
          total: 0,
          page: filter.page || DEFAULT_FILTER.page!,
          limit: filter.limit || DEFAULT_FILTER.limit!,
          totalPages: 0,
        },
      };
    }
  }

  getFilterOptions(): FilterOptionsDto {
    try {
      if (this.filterOptionsCache) {
        return this.filterOptionsCache;
      }

      const allNationalities = this.users.map((user) => user.nationality);
      const allHobbies = this.users.flatMap((user) => user.hobbies);

      this.filterOptionsCache = {
        success: true,
        data: {
          nationalities: countOccurrences(allNationalities, 20),
          hobbies: countOccurrences(allHobbies, 20),
        },
      };

      return this.filterOptionsCache;
    } catch (error) {
      console.error("Error in getFilterOptions:", error);
      return {
        success: false,
        data: {
          nationalities: [],
          hobbies: [],
        },
      };
    }
  }

  private normalizeFilter(filter: UserFilterDto): UserFilterDto {
    return {
      page: filter.page || DEFAULT_FILTER.page,
      limit: filter.limit || DEFAULT_FILTER.limit,
      search: filter.search,
      nationality: filter.nationality,
      hobby: filter.hobby,
      sort: this.validateSortField(filter.sort),
      order: this.normalizeOrder(filter.order),
    };
  }

  private validateSortField(sortField?: string): keyof User {
    const validSortFields: Array<keyof User> = [
      "firstName",
      "lastName",
      "age",
      "nationality",
      "createdAt",
      "updatedAt",
    ];

    if (sortField && validSortFields.includes(sortField as keyof User)) {
      return sortField as keyof User;
    }

    return DEFAULT_FILTER.sort!;
  }

  private normalizeOrder(order?: string): "ASC" | "DESC" {
    if (order && ["asc", "desc", "ASC", "DESC"].includes(order)) {
      return order.toUpperCase() as "ASC" | "DESC";
    }

    return DEFAULT_FILTER.order!;
  }

  private generateMockData(): void {
    for (let i = 0; i < this.USERS_COUNT; i++) {
      this.users.push(this.createMockUser(i));
    }
  }

  private createMockUser(index: number): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      id: faker.string.uuid(),
      avatar: this.generateAvatar(firstName, lastName),
      firstName,
      lastName,
      age: this.randomNumber(18, 80),
      nationality: this.pickRandom(NATIONALITIES),
      hobbies: this.pickUnique(HOBBIES, this.randomNumber(0, this.MAX_HOBBIES)),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 30 }),
    };
  }

  private generateAvatar(firstName: string, lastName: string): string {
    try {
      //  Gravatar hash form email
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

      const hash = this.simpleHash(email);

      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
    } catch (error) {
      // Fallback avatar if anything fails
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${firstName.charAt(0)}${lastName.charAt(0)}`
      )}&background=random`;
    }
  }

  // just for avatar, no judgement
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    // Convert to a hex string of 32 chars (MD5-like)
    return Math.abs(hash).toString(16).padStart(32, "0");
  }

  private pickRandom<T>(arr: T[]): T {
    return arr[faker.number.int({ min: 0, max: arr.length - 1 })];
  }

  private pickUnique<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private randomNumber(min: number, max: number): number {
    return faker.number.int({ min, max });
  }
}

export const userService = new UserService();
