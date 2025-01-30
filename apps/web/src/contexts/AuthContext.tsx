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
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      if (typeof window === 'undefined') {
        // En el servidor, no intentamos autenticar
        setIsLoading(false);
        return;
      }

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
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      clearAuthCookies();
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
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      clearAuthCookies();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
