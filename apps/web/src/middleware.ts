import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEV_CONFIG } from './config/development';

// Rutas que no requieren autenticación
const PUBLIC_FILE_PATTERNS = [
  /\.(.*?)$/,  // archivos con extensión
  /^\/favicon.ico/,
  /^\/\_next\//,
];

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
  '/',  // página de login (raíz)
  '/api/auth/login',
  '/api/auth/logout',
];

// Rutas protegidas (requieren autenticación)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/api/users',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass de autenticación en desarrollo
  if (DEV_CONFIG.bypassAuth && process.env.NODE_ENV === 'development') {
    if (!pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
  }

  // No aplicar middleware a archivos estáticos
  if (PUBLIC_FILE_PATTERNS.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Si es una ruta pública, permitir acceso
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Si hay token y el usuario intenta acceder a la página de login, redirigir al dashboard
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si no hay token y la ruta requiere autenticación
  if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configurar el matcher para las rutas que queremos proteger
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/:path*',
  ],
};
