import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode: number;
  details?: {
    code: string;
    [key: string]: unknown;
  };
}

export type ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
