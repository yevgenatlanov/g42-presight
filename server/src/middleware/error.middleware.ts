import { NextFunction, Request, Response } from "express";

// This is just as a basic reference that errors can be handled properly.
// Potentially we can categorise errors and treat them with different behaviour.

export interface AppError extends Error {
  statusCode: number;
  details?: any;
}

export class ApplicationError extends Error implements AppError {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // handling standard errors by converting to ApplicationError
  const appError: AppError =
    err instanceof ApplicationError
      ? err
      : new ApplicationError(err.message || "Internal Server Error");

  console.error("Error", appError.message);

  const errorResponse = {
    success: false,
    error: {
      message: appError.message || "Server Error",
      ...(appError.details && { details: appError.details }),
    },
  };

  res.status(appError.statusCode).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApplicationError(`Not found: ${req.originalUrl}`, 404);
  next(error);
};
