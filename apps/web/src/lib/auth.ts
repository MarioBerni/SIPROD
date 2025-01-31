import { jwtVerify, SignJWT } from 'jose';
import Cookies from 'js-cookie';

export interface TokenPayload {
  userId: string;
  role: string;
  [key: string]: unknown;
}

// Función para obtener la clave JWT de manera consistente
const getJwtSecret = () => {
  if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
    throw new Error('NEXT_PUBLIC_JWT_SECRET must be defined in environment variables');
  }
  return new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
};


export async function signToken(payload: TokenPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('24h')
      .sign(getJwtSecret());
    return token;
  } catch (error) {
    console.error('Error signing token:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as TokenPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

// Cliente: Manejo de cookies en el navegador
export const getClientSession = async () => {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Error getting client session:', error);
    return null;
  }
};

export const setClientSession = (token: string) => {
  Cookies.set('token', token, { expires: 1 }); // Expira en 1 día
};

export const removeClientSession = () => {
  Cookies.remove('token');
};

// Funciones de utilidad para el cliente
export const isAuthenticated = async () => {
  const session = await getClientSession();
  return session !== null;
};

export const getToken = (): string | null => {
  return Cookies.get('token') || null;
};

export const setToken = (token: string): void => {
  setClientSession(token);
};

export const removeToken = (): void => {
  removeClientSession();
};
