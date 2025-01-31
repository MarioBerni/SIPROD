import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { TokenPayload } from './auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_jwt_secret'
);

export async function verifyTokenServer(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = await verifyTokenServer(token);
    return payload;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
