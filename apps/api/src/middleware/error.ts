import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorRequestHandler, AsyncRequestHandler } from '../types/error';

// Manejador de errores centralizado
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Si ya se enviaron headers, delegamos al manejador por defecto de Express
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const timestamp = new Date().toISOString();

  // Log del error
  logger.error('Error:', {
    statusCode,
    message,
    details: err.details,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp,
    ip: req.ip
  });

  // Respuesta al cliente
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal Server Error' 
      : message,
    timestamp,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
};

// Middleware para capturar errores asíncronos
export const asyncErrorHandler = (fn: AsyncRequestHandler): AsyncRequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
