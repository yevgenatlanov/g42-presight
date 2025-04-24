import { query, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { DEFAULT_FILTER, VALID_SORT_FIELDS } from "./dto/user.dto";
import { ApplicationError } from "../middleware/error.middleware";

// Consolidated rules for validation
export const userFilterValidationRules: ValidationChain[] = [
  // Pagination params
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  // Filter params
  query("search")
    .optional()
    .isString()
    .withMessage("Search term must be a string")
    .trim()
    .escape(),
  query("nationality")
    .optional()
    .isString()
    .withMessage("Nationality must be a string")
    .trim()
    .escape(),
  query("hobby")
    .optional()
    .isString()
    .withMessage("Hobby must be a string")
    .trim()
    .escape(),

  // Sort params
  query("sort")
    .optional()
    .isString()
    .withMessage("Sort must be a string")
    .custom((value) => !value || VALID_SORT_FIELDS.includes(value as any))
    .withMessage(`Sort must be one of: ${VALID_SORT_FIELDS.join(", ")}`)
    .trim(),
  query("order")
    .optional()
    .isString()
    .withMessage("Order must be a string")
    .customSanitizer((value) => value?.toUpperCase())
    .isIn(["ASC", "DESC"])
    .withMessage("Order must be either ASC or DESC"),
];

export const validateUserFilter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ApplicationError("Validation error", 400, errors.array()));
    return;
  }

  // default values
  const defaultFields = {
    page: DEFAULT_FILTER.page?.toString(),
    limit: DEFAULT_FILTER.limit?.toString(),
    sort: DEFAULT_FILTER.sort,
    order: DEFAULT_FILTER.order,
  };

  Object.entries(defaultFields).forEach(([field, defaultValue]) => {
    if (!req.query[field]) req.query[field] = defaultValue;
  });

  next();
};

export const validateUserFilterParams = [
  ...userFilterValidationRules,
  validateUserFilter,
];
