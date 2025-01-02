import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  '/api/users', // Proteger explícitamente la ruta de usuarios
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
    // Si hay token y está en login, redirigir al dashboard
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si es una ruta protegida y no hay token, redirigir al login
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/', request.url);
      url.searchParams.set('from', pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete('token');
      return response;
    }
  }

  // Para rutas de API protegidas que no están en la lista explícita
  if (pathname.startsWith('/api/') && !PUBLIC_API_ROUTES.includes(pathname)) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'No autorizado' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  return NextResponse.next();
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
