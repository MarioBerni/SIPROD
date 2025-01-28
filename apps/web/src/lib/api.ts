import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getCookie, removeCookie } from './cookies';
import { PDFTableData } from '@/app/dashboard/despliegues-pdf/types';

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

// Interfaz para Registros
export interface Registro {
  id: string;
  fecha: Date;
  tipo: string;
  descripcion: string;
  estado: string;
  ubicacion?: string;
  asignado_a?: string;
  creado_por: string;
  actualizado_en: Date;
}

export interface CreateRegistroData {
  tipo: string;
  descripcion: string;
  estado: string;
  ubicacion?: string;
  asignado_a?: string;
}

export interface UpdateRegistroData extends Partial<CreateRegistroData> {
  id: string;
}

// Tipos de filtros para registros
export interface RegistroFilters {
  tipo?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  asignado_a?: string;
  creado_por?: string;
  [key: string]: string | undefined;
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
  REGISTROS: {
    BASE: '/registros',
    GET_ALL: '/registros',
    GET_BY_ID: (id: string) => `/registros/${id}`,
    CREATE: '/registros',
    UPDATE: (id: string) => `/registros/${id}`,
    DELETE: (id: string) => `/registros/${id}`,
    SEARCH: '/registros/search',
    FILTER: '/registros/filter',
    EXPORT: '/registros/export',
  },
  TABLA_PRINCIPAL: {
    BASE: '/tabla-principal',
    GET_ALL: '/tabla-principal',
    GET_BY_ID: (id: string) => `/tabla-principal/${id}`,
    CREATE: '/tabla-principal',
    UPDATE: (id: string) => `/tabla-principal/${id}`,
    DELETE: (id: string) => `/tabla-principal/${id}`,
    OPTIONS: '/tabla-principal/options',
    PDF_DATA: '/tabla-principal/pdf-data',
    OPERATIVOS_POR_TIEMPO: '/tabla-principal/operativos-por-tiempo'
  }
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

      // La cookie httpOnly será manejada automáticamente por el navegador
      // No necesitamos establecerla manualmente
      
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

// API de registros
export const registrosApi = {
  instance: api,

  async getAll(params?: { page?: number; limit?: number; sort?: string; filter?: string }) {
    try {
      const response = await this.instance.get(API_ROUTES.REGISTROS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id: string) {
    try {
      const response = await this.instance.get(API_ROUTES.REGISTROS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(data: CreateRegistroData) {
    try {
      const response = await this.instance.post(API_ROUTES.REGISTROS.CREATE, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateRegistroData) {
    try {
      const response = await this.instance.put(API_ROUTES.REGISTROS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async delete(id: string) {
    try {
      const response = await this.instance.delete(API_ROUTES.REGISTROS.DELETE(id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async search(query: string) {
    try {
      const response = await this.instance.get(API_ROUTES.REGISTROS.SEARCH, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async filter(filters: RegistroFilters) {
    try {
      const response = await this.instance.post(API_ROUTES.REGISTROS.FILTER, filters);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async export(format: 'csv' | 'excel' = 'excel') {
    try {
      const response = await this.instance.get(API_ROUTES.REGISTROS.EXPORT, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Interfaces para las opciones de filtro
export interface FilterOptions {
  unidades: string[];
  tiempoOperativo: string[];
  nombreOperativo: string[];
}

export interface OperativosPorTiempo {
  tiempoOperativo: string;
  operativos: string[];
}

// API de tabla principal
export const tablaPrincipalApi = {
  instance: api,
  
  // Obtener opciones para los filtros
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await this.instance.get(API_ROUTES.TABLA_PRINCIPAL.OPTIONS);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return { unidades: [], tiempoOperativo: [], nombreOperativo: [] };
    }
  },

  // Obtener operativos por tiempo operativo
  async getOperativosPorTiempo(): Promise<OperativosPorTiempo[]> {
    try {
      const response = await this.instance.get(API_ROUTES.TABLA_PRINCIPAL.OPERATIVOS_POR_TIEMPO);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return Promise.reject(error);
    }
  },

  // Obtener datos filtrados para PDF
  getFilteredDataForPDF(filters: { 
    unidades?: string[],
    tiempoOperativo?: string[],
    nombreOperativo?: string[],
    selectedOperativos?: string[] 
  }): Promise<PDFTableData> {
    console.log('API - Enviando filtros:', filters);
    const params = new URLSearchParams();
    if (filters.unidades?.length) {
      params.append('unidades', JSON.stringify(filters.unidades));
    }
    if (filters.tiempoOperativo?.length) {
      params.append('tiempoOperativo', JSON.stringify(filters.tiempoOperativo));
    }
    if (filters.nombreOperativo?.length) {
      params.append('nombreOperativo', JSON.stringify(filters.nombreOperativo));
    }
    if (filters.selectedOperativos?.length) {
      params.append('selectedOperativos', JSON.stringify(filters.selectedOperativos));
    }
    
    return this.instance
      .get(API_ROUTES.TABLA_PRINCIPAL.PDF_DATA, { params })
      .then((response) => {
        console.log('API - Respuesta recibida:', response.data);
        return response.data;
      })
      .catch((error) => {
        handleApiError(error);
        return {};
      });
  }
};
