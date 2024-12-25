import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No response received:', error.request);
    } else {
      // Algo sucedió en la configuración de la petición
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
