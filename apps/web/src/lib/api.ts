import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getCookie, removeCookie, setCookie } from './cookies';

// Tipos
export interface LoginData {
  correo: string;
  password: string;
}

export interface User {
  id: string;
  correo: string;
  rol: string;
  grado: string;
  nombre: string;
  cargo: string;
  activo?: boolean;
}

// Configuración base de la API
const baseURL = '/api';
console.log('Frontend - API Base URL:', baseURL);

// Rutas de la API
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE_TOKEN: '/auth/validate-token',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    BASE: '/user',
    GET_ALL: '/user',
    GET_BY_ID: (id: string) => `/user/${id}`,
    CREATE: '/user',
    UPDATE: (id: string) => `/user/${id}`,
    DELETE: (id: string) => `/user/${id}`,
  },
};

// Cliente de API principal
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptores
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('token');
    console.log('API Request - URL:', config.url);
    console.log('API Request - Token:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-access-token'] = token;
    }
    
    console.log('API Request - Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      const isAuthRoute = window.location.pathname.includes('/login') || 
                       window.location.pathname === '/' ||
                       error.config?.url?.includes('/auth/');
                       
      if (!isAuthRoute) {
        console.log('API - Error 401, redirigiendo a login');
        removeCookie('token');
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || currentPath;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
        return Promise.reject(new Error('Session expired'));
      }
    }
    
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || 'Error en la solicitud');
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('Error desconocido');
};

// API de autenticación
export const authApi = {
  instance: api,
  
  async login(correo: string, password: string) {
    console.log('API Login - Iniciando login con correo:', correo);
    try {
      console.log('API Login - Enviando request a:', API_ROUTES.AUTH.LOGIN);
      console.log('API Login - Datos:', { correo, password: '***' });
      
      const response = await this.instance.post(API_ROUTES.AUTH.LOGIN, {
        correo,
        password,
      });
      
      console.log('API Login - Respuesta recibida:', {
        status: response.status,
        headers: response.headers,
        data: { ...response.data, token: response.data.token ? 'HIDDEN' : undefined }
      });
      
      if (response.data.token) {
        console.log('API Login - Token recibido, guardando en cookies');
        setCookie('token', response.data.token);
        console.log('API Login - Token guardado en cookies');
      } else {
        console.warn('API Login - No se recibió token en la respuesta');
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  async logout() {
    try {
      await this.instance.post('/auth/logout');
      removeCookie('token');
    } catch (error) {
      handleApiError(error);
    }
  },
  
  async validateToken() {
    try {
      const response = await this.instance.get('/auth/validate-token');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
