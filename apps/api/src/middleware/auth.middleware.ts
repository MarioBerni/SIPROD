import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../utils/logger';
import { Rol } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    rol: Rol;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    try {
      const decoded = await verifyToken(token);
      
      // Asegurarnos de que decoded sea del tipo correcto
      if (typeof decoded === 'object' && decoded !== null) {
        req.user = {
          userId: decoded.userId,
          rol: decoded.rol as Rol
        };
        next();
      } else {
        throw new Error('Invalid token payload');
      }
    } catch (error) {
      logger.error('Error al verificar token:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    logger.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
