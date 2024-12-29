import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

// Función para obtener la clave JWT de manera consistente
const getJwtSecret = () => {
  // En el cliente, usamos una clave hardcodeada que debe coincidir con el backend
  return new TextEncoder().encode('siprod_jwt_dev_secret_2025!');
};

export async function signToken(payload: { id: string; role: string }) {
  try {
    const token = await new SignJWT({ userId: payload.id, role: payload.role })
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
    return payload as { userId: string; role: string };
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
