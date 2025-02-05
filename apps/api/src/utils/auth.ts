import { SignJWT, jwtVerify } from 'jose';
import { logger } from './logger';
import { Rol } from '@prisma/client';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

// Usar la clave JWT desde las variables de entorno
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  userId: string;
  role: Rol;
}

interface JWTPayloadStructure {
  userId?: unknown;
  role?: unknown;
  [key: string]: unknown;
}

function isTokenPayload(payload: unknown): payload is TokenPayload {
  const payloadObj = payload as JWTPayloadStructure;
  
  if (typeof payloadObj !== 'object' || payloadObj === null) {
    return false;
  }

  // Verificar que userId sea un string
  if (typeof payloadObj.userId !== 'string') {
    return false;
  }

  // Verificar que role sea un string y un valor válido del enum Rol
  if (typeof payloadObj.role !== 'string' || !Object.values(Rol).includes(payloadObj.role as Rol)) {
    return false;
  }

  return true;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  logger.info('Generando token para usuario:', { userId: payload.userId, role: payload.role });
  const token = await new SignJWT({ 
    userId: payload.userId,
    role: payload.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
  
  logger.info('Token generado exitosamente');
  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    logger.info('Intentando verificar token');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    logger.info('Token verificado exitosamente:', payload);
    
    if (!isTokenPayload(payload)) {
      logger.error('Estructura del token inválida:', payload);
      throw new Error('Invalid token structure');
    }

    return payload;
  } catch (error) {
    logger.error('Error al verificar token:', error);
    throw new Error('Token inválido');
  }
}
