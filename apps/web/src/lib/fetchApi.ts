import { getCookie, removeCookie } from './cookies';
import { User, UserFormData } from '@/app/dashboard/administrador/usuarios/types';

const BASE_URL = '/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      const isAuthRoute = window.location.pathname.includes('/login') || 
                         window.location.pathname === '/' ||
                         response.url.includes('/auth/');
                         
      if (!isAuthRoute) {
        removeCookie('token');
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || currentPath;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
        throw new Error('Sesión expirada');
      }
    }
    
    throw new Error(data.message || 'Error en la solicitud');
  }
  
  return {
    data,
    status: response.status,
    ok: response.ok
  };
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const token = getCookie('token');
  const { params, ...fetchOptions } = options;
  
  const url = new URL(BASE_URL + endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
  }

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include'
  });

  return handleResponse<T>(response);
}

// API Routes
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
  }
};

interface LoginResponse {
  token: string;
  user: User;
}

// Auth API
export const authApi = {
  async login(correo: string, password: string): Promise<LoginResponse> {
    const response = await fetchApi<LoginResponse>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ correo, password })
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await fetchApi<void>(API_ROUTES.AUTH.LOGOUT, {
      method: 'POST'
    });
  },

  async validateToken(): Promise<User> {
    const response = await fetchApi<User>(API_ROUTES.AUTH.VALIDATE_TOKEN);
    return response.data;
  }
};

// Users API
export const usersApi = {
  async getAll(): Promise<User[]> {
    const response = await fetchApi<User[]>(API_ROUTES.USERS.GET_ALL);
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await fetchApi<User>(API_ROUTES.USERS.GET_BY_ID(id));
    return response.data;
  },

  async create(userData: UserFormData): Promise<User> {
    const response = await fetchApi<User>(API_ROUTES.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.data;
  },

  async update(id: string, userData: Partial<UserFormData>): Promise<User> {
    const response = await fetchApi<User>(API_ROUTES.USERS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetchApi<void>(API_ROUTES.USERS.DELETE(id), {
      method: 'DELETE'
    });
    return response.data;
  }
};

export const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('Error desconocido');
};
