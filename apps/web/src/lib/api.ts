import axios, { 
  AxiosError, 
  AxiosInstance, 
  InternalAxiosRequestConfig,
} from 'axios';
import { removeCookie } from './utils/cookies';

// Tipos
export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ValidationResponse {
  valid: boolean;
  user?: User;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
}

export class ApiErrorClass extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Configuración base de axios
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
console.log('Frontend - API Base URL:', baseURL);

// Cliente de API principal
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
});

// Interceptores
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`Frontend - Enviando petición a: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Frontend - Error detallado:', {
      error,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    if (error.response?.status === 401) {
      // Limpiar cookie y estado de autenticación
      removeCookie('token');
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authApi = {
  instance: api,
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await this.instance.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Frontend - Error en login:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new ApiErrorClass(401, 'Usuario o contraseña incorrectos');
        }
        if (error.response?.status === 429) {
          throw new ApiErrorClass(429, 'Demasiados intentos. Por favor espere unos minutos.');
        }
        throw new ApiErrorClass(
          error.response?.status || 500,
          error.response?.data?.message || 'Error al iniciar sesión'
        );
      }
      throw new ApiErrorClass(500, 'Error al iniciar sesión');
    }
  },

  async validateToken(): Promise<ValidationResponse> {
    try {
      const response = await this.instance.get<ValidationResponse>('/auth/validate-token');
      return response.data;
    } catch (error) {
      console.error('Frontend - Error en validateToken:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          removeCookie('token');
          return { valid: false, message: 'Sesión expirada' };
        }
        throw new ApiErrorClass(
          error.response?.status || 500,
          error.response?.data?.message || 'Error al validar sesión'
        );
      }
      throw new ApiErrorClass(500, 'Error al validar sesión');
    }
  },

  async logout(): Promise<void> {
    try {
      await this.instance.post('/auth/logout');
      removeCookie('token');
    } catch (error) {
      console.error('Frontend - Error en logout:', error);
      // Incluso si hay error, limpiamos la cookie
      removeCookie('token');
      throw new ApiErrorClass(500, 'Error al cerrar sesión');
    }
  }
};

// Utilidad para manejar errores
export function handleApiError(error: unknown): string {
  if (error instanceof ApiErrorClass) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
}
