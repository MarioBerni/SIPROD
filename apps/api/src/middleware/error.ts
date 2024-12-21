import { Request, Response } from 'express';
import logger from '../utils/logger';

// Interfaz para errores personalizados
interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

// Manejador de errores
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Error:', {
    statusCode,
    message,
    details: err.details,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
