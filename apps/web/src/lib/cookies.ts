import Cookies from 'js-cookie';

// Configuración por defecto para cookies de autenticación
const AUTH_COOKIE_CONFIG: Cookies.CookieAttributes = {
  expires: 7, // Aumentar a 7 días
  path: '/',
  sameSite: 'Lax', // Cambiar a Lax para mejor compatibilidad
  secure: process.env.NODE_ENV === 'production' // Solo seguro en producción
};

// Nombres de cookies
export const COOKIE_NAMES = {
  TOKEN: 'token',
  USER: 'user'
} as const;

export function getCookie(name: string): string | undefined {
  try {
    const value = Cookies.get(name);
    console.log(`Getting cookie ${name}:`, value ? 'PRESENT' : 'NOT FOUND');
    return value;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return undefined;
  }
}

export function setCookie(
  name: string, 
  value: string, 
  options: Cookies.CookieAttributes = {}
): void {
  try {
    const defaultOptions: Cookies.CookieAttributes = {
      ...AUTH_COOKIE_CONFIG,
      secure: process.env.NODE_ENV === 'production' // Solo seguro en producción
    };

    const cookieOptions = { ...defaultOptions, ...options };
    
    // Validación adicional para cookies de autenticación
    if (name === COOKIE_NAMES.TOKEN) {
      cookieOptions.sameSite = 'Strict';
      cookieOptions.secure = true;
    }

    console.log(`Setting cookie ${name} with options:`, {
      ...cookieOptions,
      value: name === COOKIE_NAMES.TOKEN ? '[HIDDEN]' : value
    });
    
    Cookies.set(name, value, cookieOptions);
    console.log(`Cookie ${name} set successfully`);
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
    throw error;
  }
}

export function removeCookie(name: string): void {
  try {
    console.log(`Removing cookie ${name}`);
    Cookies.remove(name, { 
      path: '/',
      secure: true,
      sameSite: 'Strict'
    });
    console.log(`Cookie ${name} removed successfully`);
  } catch (error) {
    console.error(`Error removing cookie ${name}:`, error);
  }
}

// Función auxiliar para limpiar todas las cookies de autenticación
export function clearAuthCookies(): void {
  try {
    Object.values(COOKIE_NAMES).forEach(cookieName => {
      removeCookie(cookieName);
    });
    console.log('All auth cookies cleared successfully');
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
  }
}
