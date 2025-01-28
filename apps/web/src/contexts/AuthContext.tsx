'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/api';
import { getCookie, setCookie, clearAuthCookies, COOKIE_NAMES } from '@/lib/cookies';
import { DEV_CONFIG } from '@/config/development';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      // En desarrollo, usar usuario simulado si está habilitado
      if (DEV_CONFIG.bypassAuth && process.env.NODE_ENV === 'development') {
        setUser(DEV_CONFIG.mockUser);
        setIsLoading(false);
        return;
      }

      const token = getCookie(COOKIE_NAMES.TOKEN);
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { valid, user } = await authApi.validateToken();
      
      if (valid && user) {
        setUser(user);
        setCookie(COOKIE_NAMES.TOKEN, token, {
          expires: 7,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production'
        });
      } else {
        clearAuthCookies();
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('checkAuth - Error:', error);
      clearAuthCookies();
      setUser(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    // En desarrollo, no necesitamos el intervalo de verificación
    if (!DEV_CONFIG.bypassAuth || process.env.NODE_ENV !== 'development') {
      const interval = setInterval(checkAuth, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [checkAuth]);

  const login = async (correo: string, password: string) => {
    try {
      setIsLoading(true);

      // En desarrollo, simular login exitoso
      if (DEV_CONFIG.bypassAuth && process.env.NODE_ENV === 'development') {
        setUser(DEV_CONFIG.mockUser);
        setCookie(COOKIE_NAMES.TOKEN, DEV_CONFIG.mockToken);
        router.push('/dashboard');
        return;
      }

      const response = await authApi.login(correo, password);
      
      if (response.success && response.token) {
        setCookie(COOKIE_NAMES.TOKEN, response.token);
        setUser(response.user);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Error en login:', error);
      clearAuthCookies();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // En desarrollo, solo limpiar el estado
      if (DEV_CONFIG.bypassAuth && process.env.NODE_ENV === 'development') {
        clearAuthCookies();
        setUser(null);
        router.push('/');
        return;
      }

      await authApi.logout();
      clearAuthCookies();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error en logout:', error);
      clearAuthCookies();
      setUser(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
