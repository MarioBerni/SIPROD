import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  params?: Record<string, unknown>;
}

async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
  const { params, ...fetchOptions } = options;
  
  // Construir la URL con los parámetros query si existen
  let url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Obtener el token de autenticación
  const token = getToken();

  // Preparar los headers
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Realizar la petición
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Manejar errores HTTP
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error HTTP: ${response.status}`);
  }

  // Retornar los datos
  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),

  post: <T, D = unknown>(endpoint: string, data?: D, options: FetchOptions = {}): Promise<T> =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T, D = unknown>(endpoint: string, data?: D, options: FetchOptions = {}): Promise<T> =>
    fetchWithAuth(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options: FetchOptions = {}): Promise<T> =>
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
