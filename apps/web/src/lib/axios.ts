import axios from 'axios';

// Configurar la URL base
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Interceptor para agregar el token de autenticación
axios.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Limpiar el token y redirigir al login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
