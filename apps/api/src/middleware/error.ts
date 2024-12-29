import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>,
    public isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const apiError = err instanceof ApiError ? err : new ApiError(500, err.message);
  
  logger.error('Error:', apiError);

  const response: Record<string, unknown> = {
    status: 'error',
    message: apiError.message
  };

  if (apiError.details) {
    response.details = apiError.details;
  }

  if (process.env.NODE_ENV === 'development' && apiError.stack) {
    response.stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(response);
};
