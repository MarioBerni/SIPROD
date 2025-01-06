'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/api';
import Cookies from 'js-cookie';

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar si hay un token antes de hacer la petición
      const token = Cookies.get('token');
      console.log('checkAuth - Token:', token); // Debug log
      
      if (!token) {
        console.log('checkAuth - No token found'); // Debug log
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { valid, user } = await authApi.validateToken();
      console.log('checkAuth - Token validation:', { valid, user }); // Debug log
      
      if (valid && user) {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('checkAuth - Error:', error); // Debug log
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('login - Attempting login for:', correo);
      
      const response = await authApi.login(correo, password);
      console.log('login - Response:', { ...response, token: 'HIDDEN' });
      
      if (response.success) {
        setUser(response.user);
        Cookies.set('token', response.token);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
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
      Cookies.remove('token');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Incluso si hay error, forzamos el logout
      Cookies.remove('token');
      setUser(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
