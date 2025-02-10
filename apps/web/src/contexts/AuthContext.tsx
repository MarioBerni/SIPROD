'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: async () => {
    throw new Error('AuthContext not initialized');
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

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
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? 'siprod.uy' : undefined,
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
          secure: process.env.NODE_ENV === 'production'
        });
      } else {
        clearAuthCookies();
        setUser(null);
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      clearAuthCookies();
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (correo: string, password: string) => {
    try {
      setIsLoading(true);
      const { token, user } = await authApi.login(correo, password);
      
      setCookie(COOKIE_NAMES.TOKEN, token, {
        expires: 7,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? 'siprod.uy' : undefined,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      setUser(user);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // Primero llamamos al endpoint de logout para limpiar la cookie httpOnly
      await authApi.logout();
      
      // Luego limpiamos las cookies del cliente
      clearAuthCookies();
      
      // Limpiamos el estado
      setUser(null);
      
      // Usamos window.location.href para la navegación durante el logout
      // Esto evita problemas con los hooks de React
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Aún si hay error, intentamos limpiar las cookies del cliente
      clearAuthCookies();
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
