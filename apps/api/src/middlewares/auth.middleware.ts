import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../middleware/error';
import { logger } from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Intentar obtener el token de diferentes fuentes
    let token = req.cookies.token; // Primero intentar desde cookies
    
    // Si no hay token en cookies, intentar desde headers
    if (!token) {
      const authHeader = req.headers.authorization;
      const xAccessToken = req.headers['x-access-token'];
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remover 'Bearer '
      } else if (xAccessToken) {
        token = Array.isArray(xAccessToken) ? xAccessToken[0] : xAccessToken;
      }
    }

    logger.info('Token recibido en middleware:', { 
      hasCookieToken: !!req.cookies.token,
      hasAuthHeader: !!req.headers.authorization,
      hasXAccessToken: !!req.headers['x-access-token'],
      finalToken: !!token
    });

    if (!token) {
      logger.warn('No se encontró token en la petición');
      throw new ApiError(401, 'No token provided');
    }

    const decoded = await verifyToken(token);
    logger.info('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
