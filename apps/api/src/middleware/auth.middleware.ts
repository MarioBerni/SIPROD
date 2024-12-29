import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
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
          role: decoded.role
        };
        next();
      } else {
        throw new Error('Invalid token payload');
      }
    } catch (error) {
      logger.error('Error al verificar token:', error); // Use logger
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    logger.error('Auth Middleware Error:', error); // Use logger
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
