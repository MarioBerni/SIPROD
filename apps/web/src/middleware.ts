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
  '/',  // landing page
  '/login',
];

// Rutas de API que no requieren autenticación
const PUBLIC_API_ROUTES = [
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
    // Solo aplicar el bypass a rutas no-API para evitar problemas con las llamadas al backend
    if (!pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
  }

  const token = request.cookies.get('token')?.value;

  // No aplicar middleware a archivos estáticos
  if (PUBLIC_FILE_PATTERNS.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Si es una ruta pública de API, permitir acceso
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es una ruta pública, permitir acceso
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Si hay token y está en la página inicial, redirigir al dashboard
    if (token && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si es una ruta protegida y no hay token, redirigir al inicio
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      const returnUrl = new URL('/', request.url);
      returnUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(returnUrl);
    }
  }

  // Si hay token en la cookie, permitir acceso
  if (token) {
    return NextResponse.next();
  }

  // Por defecto, redirigir al inicio con la URL de retorno
  const returnUrl = new URL('/', request.url);
  returnUrl.searchParams.set('returnUrl', pathname);
  return NextResponse.redirect(returnUrl);
}

// Configurar el matcher para las rutas que queremos proteger
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /_next (archivos Next.js)
     * 2. /_static (archivos estáticos)
     * 3. /_vercel (archivos internos de Vercel)
     * 4. Archivos con extensión (.jpg, .png, etc.)
     */
    '/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
