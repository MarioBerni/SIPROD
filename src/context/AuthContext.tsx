import React, { createContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import { login as apiLogin } from '../api';

// ...existing code...

const checkAuth = () => {
    console.log('checkAuth - Verificando token');
    const token = getCookie('token');
    console.log('checkAuth - Token obtenido:', token);
    if (!token) {
        console.log('checkAuth - No token found');
        return false;
    }
    console.log('checkAuth - Token found');
    return true;
};

// ...existing code...

const login = async (email, password) => {
    console.log('Iniciando login para:', email);
    const response = await apiLogin(email, password);
    console.log('Respuesta de login:', response);
    if (response.success) {
        console.log('Autenticación exitosa - Guardando token');
        setCookie('token', response.token, { expires: 1, path: '/', sameSite: 'Strict', secure: true });
        console.log('Token guardado:', response.token);
        setUser(response.user);
        console.log('Usuario autenticado:', response.user);
        return { success: true, hasUser: true };
    }
    console.log('Autenticación fallida');
    return { success: false, hasUser: false };
};

// ...existing code...
