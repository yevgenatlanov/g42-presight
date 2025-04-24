import { UserService } from "./user.service";
import { UserFilterDto } from "./dto/user.dto";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("findAll", () => {
    it("should return users with default pagination", () => {
      const result = userService.findAll({});

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.metadata.page).toBe(1);
      expect(result.metadata.limit).toBe(20);
      expect(result.metadata.total).toBeGreaterThan(0);
    });

    it("should apply custom pagination", () => {
      const filter: UserFilterDto = { page: 2, limit: 10 };
      const result = userService.findAll(filter);

      expect(result.success).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.metadata.page).toBe(2);
      expect(result.metadata.limit).toBe(10);
    });

    it("should apply search filter", () => {
      const allUsers = userService.findAll({});
      const searchUser = allUsers.data[0];
      const searchTerm = searchUser.firstName.substring(0, 3);

      const result = userService.findAll({ search: searchTerm });

      expect(result.success).toBe(true);

      if (result.data.length > 0) {
        const hasMatch = result.data.some(
          (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        expect(hasMatch).toBe(true);
      }
    });

    it("should apply nationality filter", () => {
      const allUsers = userService.findAll({});
      const nationality = allUsers.data[0].nationality;

      const result = userService.findAll({ nationality });

      expect(result.success).toBe(true);

      result.data.forEach((user) => {
        expect(user.nationality).toBe(nationality);
      });
    });
  });

  describe("getFilterOptions", () => {
    it("should return filter options", () => {
      const result = userService.getFilterOptions();

      expect(result.success).toBe(true);
      expect(result.data.nationalities.length).toBeGreaterThan(0);
      expect(result.data.hobbies.length).toBeGreaterThan(0);

      if (result.data.nationalities.length > 0) {
        expect(result.data.nationalities[0]).toHaveProperty("value");
        expect(result.data.nationalities[0]).toHaveProperty("count");
      }
    });

    it("should cache filter options", () => {
      const result1 = userService.getFilterOptions();
      const result2 = userService.getFilterOptions();

      expect(result1).toBe(result2);
    });
  });

  describe("regenerate", () => {
    it("should regenerate users with new data", () => {
      const beforeUsers = userService.findAll({ limit: 5 });
      const beforeIds = new Set(beforeUsers.data.map((u) => u.id));

      // Regen users
      userService.regenerate();

      // Fetch after regen
      const afterUsers = userService.findAll({ limit: 5 });
      const afterIds = afterUsers.data.map((u) => u.id);

      // Just in case ID's will no be unique, in prod uuid will prevent this for sure
      let differentIdsFound = false;
      for (const id of afterIds) {
        if (!beforeIds.has(id)) {
          differentIdsFound = true;
          break;
        }
      }

      expect(differentIdsFound).toBe(true);
      expect(afterUsers.metadata.total).toBe(1000);
      expect(userService["filterOptionsCache"]).toBeNull();
    });
  });
});
