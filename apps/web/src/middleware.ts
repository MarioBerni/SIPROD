import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const PUBLIC_ROUTES = ['/', '/login'];
const AUTH_ROUTES = ['/dashboard', '/users', '/settings'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // No aplicar middleware a rutas de API o recursos estáticos
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Si es una ruta autenticada y no hay token, redirigir a la página principal
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/', request.url);
      const response = NextResponse.redirect(url);
      // Asegurarnos de limpiar la cookie del token
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }

  // Si es una ruta pública y hay token válido, redirigir al dashboard
  if (PUBLIC_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar el matcher para las rutas que queremos proteger
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api (rutas API)
     * 2. /_next (archivos Next.js)
     * 3. /_static (si existiera)
     * 4. /_vercel (archivos internos de Vercel)
     * 5. /favicon.ico, /sitemap.xml (archivos estáticos)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
};
