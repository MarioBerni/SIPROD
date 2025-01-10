'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/api';
import { getCookie, setCookie, clearAuthCookies, COOKIE_NAMES } from '@/lib/cookies';

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
      const token = getCookie(COOKIE_NAMES.TOKEN);
      console.log('checkAuth - Verificando token');
      
      if (!token) {
        console.log('checkAuth - No token found');
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { valid, user } = await authApi.validateToken();
      console.log('checkAuth - Token validation:', { valid, hasUser: !!user });
      
      if (valid && user) {
        setUser(user);
        // Renovar token si es válido
        setCookie(COOKIE_NAMES.TOKEN, token);
      } else {
        clearAuthCookies();
        setUser(null);
      }
    } catch (error) {
      console.error('checkAuth - Error:', error);
      clearAuthCookies();
      setUser(null);
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
      console.log('Iniciando login para:', correo);
      
      const response = await authApi.login(correo, password);
      console.log('Respuesta de login:', { success: response.success, hasUser: !!response.user });
      
      if (response.success && response.token) {
        // Guardar token con configuración segura
        setCookie(COOKIE_NAMES.TOKEN, response.token);
        
        // Guardar información básica del usuario
        setUser(response.user);
        console.log('Autenticación exitosa - Redirigiendo al dashboard');

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
