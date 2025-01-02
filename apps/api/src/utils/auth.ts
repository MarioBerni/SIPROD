import { SignJWT, jwtVerify } from 'jose';
import { logger } from './logger';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

// Usar la clave JWT desde las variables de entorno
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(user: { id: string; role?: string }): Promise<string> {
  logger.info('Generando token para usuario:', { id: user.id, role: user.role || 'USER' });
  const token = await new SignJWT({ 
    userId: user.id,
    role: user.role || 'USER'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  logger.info('Token generado exitosamente');
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string; role: string }> {
  try {
    logger.info('Intentando verificar token');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    logger.info('Token verificado exitosamente:', payload);
    return payload as { userId: string; role: string };
  } catch (error) {
    logger.error('Error al verificar token:', error);
    throw new Error('Token inválido');
  }
}
