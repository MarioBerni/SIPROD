import { CustomError } from '../types/error';

export class AppError extends Error implements CustomError {
  statusCode: number;
  details?: {
    code: string;
    [key: string]: unknown;
  };

  constructor(message: string, statusCode: number, details?: { code: string; [key: string]: unknown }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 400, { code, ...details });
  }

  static unauthorized(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 401, { code, ...details });
  }

  static forbidden(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 403, { code, ...details });
  }

  static notFound(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 404, { code, ...details });
  }

  static tooManyRequests(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 429, { code, ...details });
  }

  static internal(message: string, code: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 500, { code, ...details });
  }
}
