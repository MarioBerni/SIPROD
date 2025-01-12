import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../utils/logger';
import { Rol } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Rol;  
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    logger.info('Auth Middleware - Headers:', {
      cookies: req.cookies,
      authorization: req.headers.authorization,
      path: req.path,
      method: req.method
    });

    // Intentar obtener el token de diferentes fuentes
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
      logger.info('Token obtenido del header Authorization');
    }

    if (!token) {
      logger.warn('No token found in cookies or headers');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    try {
      logger.info('Verificando token...');
      const decoded = await verifyToken(token);
      
      // Asegurarnos de que decoded sea del tipo correcto
      if (typeof decoded === 'object' && decoded !== null) {
        logger.info('Token válido para usuario:', decoded);
        req.user = {
          userId: decoded.userId,
          role: decoded.role  
        };
        logger.info('Usuario autenticado:', req.user);
        next();
      } else {
        logger.warn('Token decodificado inválido:', decoded);
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }
    } catch (error) {
      logger.error('Error verificando token:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    logger.error('Error in auth middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
