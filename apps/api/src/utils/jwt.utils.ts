import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Rol } from '@prisma/client';

interface TokenPayload {
  userId: string;
  rol: Rol;
}

type JwtPayload = {
  userId: string;
  rol: Rol;
  iat: number;
  exp: number;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
      if (err) {
        reject(err);
      } else if (!decoded || typeof decoded === 'string') {
        reject(new Error('Invalid token payload'));
      } else {
        try {
          // Verificar que el payload tenga la estructura correcta
          const payload = decoded as JwtPayload;
          if (!payload.userId || !payload.rol) {
            reject(new Error('Invalid token payload structure'));
          } else {
            resolve({
              userId: payload.userId,
              rol: payload.rol
            });
          }
        } catch {
          // No necesitamos usar el error aquí
          reject(new Error('Invalid token payload format'));
        }
      }
    });
  });
};
