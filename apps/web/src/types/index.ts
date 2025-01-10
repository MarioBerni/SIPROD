// Tipos de autenticación
export interface User {
  id: string;
  correo: string;
  nombre: string;
  rol: string;
  grado: string;
  cargo: string;
  activo: boolean;
  ultimaFechaAcceso?: string;
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
