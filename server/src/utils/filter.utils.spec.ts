import { filterUsers, countOccurrences } from "./filter.utils";
import { User } from "../user/entity/user.entity";
import { UserFilterDto } from "../user/dto/user.dto";

describe("Filter Utils", () => {
  const mockUsers: User[] = [
    {
      id: "1",
      avatar: "avatar1",
      firstName: "John",
      lastName: "Doe",
      age: 25,
      nationality: "American",
      hobbies: ["Reading", "Cycling"],
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: "2",
      avatar: "avatar2",
      firstName: "Jane",
      lastName: "Smith",
      age: 30,
      nationality: "British",
      hobbies: ["Swimming", "Yoga"],
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-02-01"),
    },
    {
      id: "3",
      avatar: "avatar3",
      firstName: "Mike",
      lastName: "Johnson",
      age: 35,
      nationality: "American",
      hobbies: ["Cooking", "Reading"],
      createdAt: new Date("2023-03-01"),
      updatedAt: new Date("2023-03-01"),
    },
  ];

  describe("filterUsers", () => {
    it("should filter users by specific search term", () => {
      // Using a search term that only matches John Doe's last name
      const filter: UserFilterDto = { search: "Doe" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("should match multiple users with common search term", () => {
      // This test acknowledges that "john" will match both "John" and "Johnson"
      const filter: UserFilterDto = { search: "john" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("3");
    });

    it("should filter users by nationality", () => {
      const filter: UserFilterDto = { nationality: "american" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(2);
      expect(result.every((user) => user.nationality === "American")).toBe(
        true
      );
    });

    it("should filter users by hobby", () => {
      const filter: UserFilterDto = { hobby: "reading" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(2);
      expect(
        result.every((user) =>
          user.hobbies.some(
            (hobby) => hobby.toLowerCase() === "reading".toLowerCase()
          )
        )
      ).toBe(true);
    });

    it("should sort users by firstName (ASC)", () => {
      const filter: UserFilterDto = { sort: "firstName", order: "ASC" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(3);
      expect(result[0].firstName).toBe("Jane");
      expect(result[1].firstName).toBe("John");
      expect(result[2].firstName).toBe("Mike");
    });

    it("should sort users by firstName (DESC)", () => {
      const filter: UserFilterDto = { sort: "firstName", order: "DESC" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(3);
      expect(result[0].firstName).toBe("Mike");
      expect(result[1].firstName).toBe("John");
      expect(result[2].firstName).toBe("Jane");
    });

    it("should sort users by age (ASC)", () => {
      const filter: UserFilterDto = { sort: "age", order: "ASC" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(3);
      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(35);
    });

    it("should sort users by createdAt (DESC)", () => {
      const filter: UserFilterDto = { sort: "createdAt", order: "DESC" };
      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(3);
      expect(result[0].createdAt).toEqual(new Date("2023-03-01"));
      expect(result[1].createdAt).toEqual(new Date("2023-02-01"));
      expect(result[2].createdAt).toEqual(new Date("2023-01-01"));
    });

    it("should apply multiple filters and sorting", () => {
      const filter: UserFilterDto = {
        nationality: "american",
        sort: "age",
        order: "DESC",
      };

      const result = filterUsers(mockUsers, filter);

      expect(result).toHaveLength(2);
      expect(result[0].age).toBe(35);
      expect(result[1].age).toBe(25);
      expect(result.every((user) => user.nationality === "American")).toBe(
        true
      );
    });
  });

  describe("countOccurrences", () => {
    it("should count occurrences and return top results", () => {
      const values = ["A", "B", "A", "C", "B", "A", "D", "E"];
      const limit = 3;

      const result = countOccurrences(values, limit);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ value: "A", count: 3 });
      expect(result[1]).toEqual({ value: "B", count: 2 });
      expect(result[2].count).toBe(1); // The third could be C, D, or E
    });

    it("should respect the limit parameter", () => {
      const values = ["A", "B", "C", "D", "E"];
      const limit = 2;

      const result = countOccurrences(values, limit);

      expect(result).toHaveLength(2);
    });

    it("should handle empty arrays", () => {
      const values: string[] = [];
      const result = countOccurrences(values);

      expect(result).toHaveLength(0);
    });

    it("should use default limit of 20 if not specified", () => {
      const values = Array(30)
        .fill(0)
        .map((_, i) => `Value${i}`);

      const result = countOccurrences(values);

      expect(result).toHaveLength(20);
    });
  });
});
