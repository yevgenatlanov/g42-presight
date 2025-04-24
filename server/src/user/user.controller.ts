import { Request, Response, NextFunction } from "express";
import { User } from "./entity/user.entity";
import { UserFilterDto } from "./dto/user.dto";
import { userService } from "./user.service";
import { ApplicationError } from "../middleware/error.middleware";

export class UserController {
  // Arrow functions to preserve 'this' context and provide proper Express handler signature
  getUsers = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const filter: UserFilterDto = this.parseUserFilterFromRequest(req);
      const result = userService.findAll(filter);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getFilterOptions = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const filterOptions = userService.getFilterOptions();
      res.status(200).json(filterOptions);
    } catch (error) {
      next(error);
    }
  };

  private parseUserFilterFromRequest(req: Request): UserFilterDto {
    const { page, limit, search, nationality, hobby, sort, order } = req.query;

    const parsedPage = page ? parseInt(page as string, 10) : undefined;
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;

    let validatedSort: keyof User | undefined = undefined;
    const validSortFields: Array<keyof User> = [
      "firstName",
      "lastName",
      "age",
      "nationality",
      "createdAt",
      "updatedAt",
    ];

    if (sort && validSortFields.includes(sort as keyof User)) {
      validatedSort = sort as keyof User;
    }

    let validatedOrder: "ASC" | "DESC" | undefined = undefined;
    if (order) {
      const orderStr = (order as string).toUpperCase();
      if (["ASC", "DESC"].includes(orderStr)) {
        validatedOrder = orderStr as "ASC" | "DESC";
      }
    }

    return {
      page: parsedPage,
      limit: parsedLimit,
      search: search as string,
      nationality: nationality as string,
      hobby: hobby as string,
      sort: validatedSort,
      order: validatedOrder,
    };
  }
}

export const userController = new UserController();
