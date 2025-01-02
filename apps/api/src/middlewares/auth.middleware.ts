import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../middleware/error';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
