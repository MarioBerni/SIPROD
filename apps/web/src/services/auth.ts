import { api } from '@/lib/fetch';
import { AuthResponse, User, UserLoginData } from '@/types/user';
import { removeToken, setToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authApi = {
  async login(credentials: UserLoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
      setToken(response.token);
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(`${API_URL}/auth/logout`);
    } finally {
      removeToken();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>(`${API_URL}/auth/me`);
      return response;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }
};
