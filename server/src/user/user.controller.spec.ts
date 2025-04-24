import { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import { userService } from "./user.service";

// some demo jest test

// Mock the user service
jest.mock("./user.service", () => ({
  userService: {
    findAll: jest.fn(),
    getFilterOptions: jest.fn(),
  },
}));

describe("UserController", () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    userController = new UserController();

    // Creating mock request, response, and next function
    mockRequest = {
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    // Setup with basic repsonses
    (userService.findAll as jest.Mock).mockReturnValue({
      success: true,
      data: [
        {
          id: "1",
          avatar: "avatar-url",
          firstName: "John",
          lastName: "Doe",
          age: 30,
          nationality: "American",
          hobbies: ["Reading", "Coding"],
        },
      ],
      metadata: {
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    });

    (userService.getFilterOptions as jest.Mock).mockReturnValue({
      success: true,
      data: {
        nationalities: [{ value: "American", count: 1 }],
        hobbies: [{ value: "Reading", count: 1 }],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return users with default parameters", () => {
      userController.getUsers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(userService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        })
      );
    });

    it("should handle query parameters correctly", () => {
      mockRequest.query = {
        page: "2",
        limit: "10",
        search: "John",
        nationality: "American",
        hobby: "Reading",
        sort: "firstName",
        order: "asc",
      };

      userController.getUsers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(userService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 10,
          search: "John",
          nationality: "American",
          hobby: "Reading",
          sort: "firstName",
          order: "ASC",
        })
      );
    });

    it("should pass errors to next middleware", () => {
      const testError = new Error("Test error");
      (userService.findAll as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      userController.getUsers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(testError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe("getFilterOptions", () => {
    it("should return filter options", () => {
      userController.getFilterOptions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(userService.getFilterOptions).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            nationalities: expect.any(Array),
            hobbies: expect.any(Array),
          }),
        })
      );
    });

    it("should pass errors to next middleware", () => {
      const testError = new Error("Test error");
      (userService.getFilterOptions as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      userController.getFilterOptions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(testError);
    });
  });
});
