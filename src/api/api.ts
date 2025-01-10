import axios from 'axios';
import { getCookie } from '../utils/cookies';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getCookie('token');
    console.log('API Request - URL:', config.url);
    console.log('API Request - Token:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request - Headers:', config.headers);
    return config;
});

// ...existing code...

export const login = async (email, password) => {
    console.log('API Login - Iniciando login con correo:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('API Login - Respuesta recibida:', response);
    return response.data;
};

// ...existing code...
