# 👨‍💻 Guía de Desarrollo y Estándares

> Este documento define los estándares de código, procesos de desarrollo, guías de testing y mejores prácticas para el desarrollo del proyecto SIPROD.

# Guía de Desarrollo - SIPROD

## Configuración Inicial

1. **Clonar el Repositorio**:
   ```bash
   git clone [URL_REPOSITORIO]
   cd SIPROD
   ```

2. **Instalar Dependencias**:
   ```bash
   pnpm install
   ```

3. **Variables de Entorno**:
   ```bash
   # Backend (.env)
   cp apps/api/.env.example apps/api/.env
   
   # Frontend (.env)
   cp apps/web/.env.example apps/web/.env
   ```

4. **Base de Datos**:
   ```bash
   # Crear base de datos
   createdb siprod

   # Generar cliente Prisma
   cd apps/api
   pnpm prisma generate

   # Ejecutar migraciones
   pnpm prisma migrate dev
   ```

## Estándares de Código y Mejores Prácticas

### Estructura de Componentes

1. **Server Components (Por Defecto)**
   ```typescript
   // app/(auth)/users/page.tsx
   import { UsersTable } from '@/components/features/users/UsersTable';
   
   export default async function UsersPage() {
     const users = await db.user.findMany();
     return <UsersTable users={users} />;
   }
   ```

2. **Client Components (Cuando sea necesario)**
   ```typescript
   'use client';
   
   import { useState } from 'react';
   import { Button } from '@siprod/ui';
   
   export function UserForm() {
     const [data, setData] = useState({});
     return (
       <form>
         <input onChange={(e) => setData({ ...data, name: e.target.value })} />
         <Button type="submit">Guardar</Button>
       </form>
     );
   }
   ```

3. **Componentes de UI (@siprod/ui)**
   ```typescript
   // packages/ui/src/Button.tsx
   import { cn } from '@siprod/utils';
   
   export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
   }
   
   export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
     return (
       <button
         className={cn(
           'button',
           `button--${variant}`,
           `button--${size}`,
           className
         )}
         {...props}
       />
     );
   }
   ```

### Data Fetching y Estado

1. **Server Actions**
   ```typescript
   // app/(auth)/users/actions.ts
   'use server';
   
   export async function createUser(formData: FormData) {
     const user = await db.user.create({
       data: {
         name: formData.get('name') as string,
         email: formData.get('email') as string,
       },
     });
     revalidatePath('/users');
     return user;
   }
   ```

2. **API Routes**
   ```typescript
   // app/api/users/route.ts
   import { NextResponse } from 'next/server';
   import { auth } from '@/lib/auth';
   
   export async function GET(request: Request) {
     const session = await auth();
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const users = await db.user.findMany();
     return NextResponse.json(users);
   }
   ```

3. **Estado Global (Zustand)**
   ```typescript
   // lib/store/useStore.ts
   import { create } from 'zustand';
   
   interface AppState {
     theme: 'light' | 'dark';
     setTheme: (theme: 'light' | 'dark') => void;
   }
   
   export const useStore = create<AppState>((set) => ({
     theme: 'light',
     setTheme: (theme) => set({ theme }),
   }));
   ```

### Optimizaciones

1. **Lazy Loading**
   ```typescript
   // components/features/dashboard/DashboardCharts.tsx
   import dynamic from 'next/dynamic';
   
   const Chart = dynamic(() => import('@/components/ui/Chart'), {
     loading: () => <div>Cargando gráfico...</div>,
     ssr: false,
   });
   ```

2. **Streaming**
   ```typescript
   // app/(auth)/dashboard/page.tsx
   import { Suspense } from 'react';
   
   export default function DashboardPage() {
     return (
       <div>
         <Suspense fallback={<div>Cargando estadísticas...</div>}>
           <Statistics />
         </Suspense>
         <Suspense fallback={<div>Cargando gráficos...</div>}>
           <DashboardCharts />
         </Suspense>
       </div>
     );
   }
   ```

3. **Route Groups**
   ```
   app/
   ├── (auth)/           # Rutas autenticadas
   │   ├── dashboard/
   │   ├── users/
   │   └── layout.tsx
   ├── (public)/         # Rutas públicas
   │   ├── login/
   │   └── layout.tsx
   └── layout.tsx
   ```

### Testing

1. **Unit Tests (Jest + Testing Library)**
   ```typescript
   // components/ui/Button.test.tsx
   import { render, screen } from '@testing-library/react';
   import { Button } from './Button';
   
   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
     
     it('handles click events', () => {
       const onClick = jest.fn();
       render(<Button onClick={onClick}>Click me</Button>);
       screen.getByText('Click me').click();
       expect(onClick).toHaveBeenCalled();
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   // tests/integration/auth.test.tsx
   import { render, screen, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { LoginForm } from '@/components/features/auth/LoginForm';
   
   describe('Authentication', () => {
     it('allows user to login', async () => {
       render(<LoginForm />);
       
       await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
       await userEvent.type(screen.getByLabelText('Password'), 'password');
       await userEvent.click(screen.getByText('Login'));
       
       await waitFor(() => {
         expect(screen.getByText('Welcome back!')).toBeInTheDocument();
       });
     });
   });
   ```

### Convenciones de Código

1. **Nombrado**
   ```typescript
   // Componentes: PascalCase
   export function UserProfile() {}
   
   // Hooks: useNombreHook
   export function useUserData() {}
   
   // Utilidades: camelCase
   export function formatDate() {}
   
   // Tipos: PascalCase
   export interface UserData {}
   ```

2. **Imports**
   ```typescript
   // 1. React/Next.js
   import { useState, useEffect } from 'react';
   import { useRouter } from 'next/router';
   
   // 2. Librerías externas
   import { motion } from 'framer-motion';
   
   // 3. Componentes internos
   import { Button } from '@/components/ui';
   
   // 4. Hooks y utilidades
   import { useStore } from '@/lib/store';
   import { cn } from '@/lib/utils';
   ```

### Desarrollo con Turbopack

1. **Inicio Rápido**
   ```bash
   # Desarrollo con Turbopack
   pnpm dev
   
   # Build optimizado
   pnpm build
   
   # Tests
   pnpm test
   ```

2. **Hot Module Replacement**
   ```typescript
   // Componentes actualizados automáticamente
   'use client';
   
   export function Counter() {
     const [count, setCount] = useState(0);
     return (
       <button onClick={() => setCount(count + 1)}>
         Count: {count}
       </button>
     );
   }
   ```

### Gestión de Estado

1. **Server State**
   ```typescript
   // lib/api/users.ts
   export async function getUsers() {
     const res = await fetch('/api/users');
     if (!res.ok) throw new Error('Failed to fetch users');
     return res.json();
   }
   ```

2. **Client State**
   ```typescript
   // hooks/useTheme.ts
   export function useTheme() {
     const [theme, setTheme] = useState('light');
     
     useEffect(() => {
       document.documentElement.classList.toggle('dark', theme === 'dark');
     }, [theme]);
     
     return { theme, setTheme };
   }
   ```

### Seguridad

1. **Middleware**
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('token');
     
     if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
       return NextResponse.redirect(new URL('/login', request.url));
     }
     
     return NextResponse.next();
   }
   ```

2. **Validación de Datos**
   ```typescript
   // lib/validations/user.ts
   import { z } from 'zod';
   
   export const userSchema = z.object({
     name: z.string().min(2),
     email: z.string().email(),
     password: z.string().min(8),
   });
   ```

## Flujo de Trabajo

1. **Desarrollo Local**
   ```bash
   # Instalar dependencias
   pnpm install
   
   # Iniciar desarrollo
   pnpm dev
   
   # Tests
   pnpm test
   
   # Lint
   pnpm lint
   ```

2. **Git Flow**
   ```bash
   # Nueva feature
   git checkout -b feature/user-management
   
   # Commit con conventional commits
   git commit -m "feat: add user management"
   
   # Pull request
   git push origin feature/user-management
   ```

3. **Code Review**
   - Tests pasando
   - Sin warnings de lint
   - Seguir guías de estilo
   - Documentación actualizada

## Autenticación y Autorización

### Flujo de Autenticación
1. El usuario ingresa credenciales en el formulario de login
2. El frontend envía las credenciales al endpoint `/api/auth/login`
3. El backend verifica las credenciales y genera un JWT
4. El token se almacena en:
   - localStorage para persistencia
   - cookies para el middleware de Next.js
5. El middleware verifica el token en cada ruta protegida

### Implementación del Token
```typescript
// Generación en el backend
const token = jwt.sign(
  { id: user.id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

// Almacenamiento en el frontend
localStorage.setItem('token', token);
document.cookie = `token=${token}; path=/`;

// Verificación en el middleware
const token = request.cookies.get('token')?.value 
  || request.headers.get('authorization');
```

## Autenticación y Manejo de Sesiones

1. **Flujo de Autenticación**
   ```typescript
   // Componente de Login
   function LoginForm() {
     const { login } = useAuth();
     
     const handleSubmit = async (data) => {
       await login(data.username, data.password);
     };
   }
   ```

2. **Protección de Rutas**
   ```typescript
   // middleware.ts
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('token');
     if (!token && isProtectedRoute(request.nextUrl.pathname)) {
       return NextResponse.redirect(new URL('/login', request.url));
     }
   }
   ```

3. **Manejo de Tokens**
   ```typescript
   // Utilidades de cookies
   export function setCookie(name: string, value: string) {
     document.cookie = `${name}=${value};path=/;SameSite=Lax;HttpOnly`;
   }
   ```

4. **Contexto de Autenticación**
   ```typescript
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    setUser(response.user);
  };
  
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

5. **Mejores Prácticas de Seguridad**
   - Usar cookies HTTP-Only para tokens
   - Implementar protección CSRF
   - Validar tokens en cada petición
   - Manejar errores de autenticación
   - Limpiar estado al cerrar sesión

## Variables de Entorno
#### Requisitos de Seguridad
Todas las variables relacionadas con seguridad deben cumplir estos requisitos:

1. **Longitud Mínima**
   - Todas las claves secretas deben tener al menos 32 caracteres
   - No usar valores predeterminados en producción
   - No compartir valores entre entornos (desarrollo/producción)

2. **Formato de Variables Críticas**
   ```bash
   # Secretos (mínimo 32 caracteres)
   JWT_SECRET=siprod_jwt_[env]_secret_2025_secure_key_32!
   NEXT_PUBLIC_JWT_SECRET=siprod_jwt_[env]_secret_2025_secure_key_32!
   SESSION_SECRET=siprod_session_[env]_secret_2025_secure_32!

   # URLs (formato válido)
   CORS_ORIGIN="http://localhost:3000"  # Desarrollo
   CORS_ORIGIN="https://siprod.uy"      # Producción
   ```

3. **Validación de Variables**
   - El sistema valida automáticamente la longitud y formato de las variables
   - Ejecutar `pnpm lint` y `pnpm build` antes de commits para verificar
   - Los errores de validación bloquearán el inicio de la aplicación

#### Estructura Completa del archivo .env
```bash
# =================================================================
# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos
# =================================================================

# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/siprod"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your_password"
POSTGRES_DB="siprod"
POSTGRES_PORT=5432

# Backend
PORT=4000
API_PREFIX="/api"
NODE_ENV="development"
JWT_SECRET=siprod_jwt_dev_secret_2025_secure_key_32!
NEXT_PUBLIC_JWT_SECRET=siprod_jwt_dev_secret_2025_secure_key_32!
SESSION_SECRET=siprod_session_dev_secret_2025_secure_32!
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
CORS_ORIGIN="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379

# Frontend
NEXT_PUBLIC_API_URL="/api"
NEXT_TELEMETRY_DISABLED=1

# Logging
LOG_LEVEL="debug"
LOG_FORMAT="simple"

# Seguridad
SSL_ENABLED=false
JWT_EXPIRATION=24
MAX_LOGIN_ATTEMPTS=5
SECURE_COOKIES=false
ENABLE_RATE_LIMIT=false
ENABLE_HELMET=true
```

## Estructura de Directorios

### Frontend (apps/web)
```
src/
├── app/          # Rutas y páginas
├── components/   # Componentes React
├── lib/          # Utilidades y configuración
├── hooks/        # Custom hooks
└── types/        # Definiciones de tipos
```

### Backend (apps/api)
```
src/
├── controllers/  # Controladores
├── middleware/   # Middleware
├── routes/       # Definición de rutas
├── services/     # Lógica de negocio
└── utils/        # Utilidades
```

## Comandos de Desarrollo
```bash
# Iniciar desarrollo
pnpm dev

# Construir proyecto
pnpm build

# Ejecutar tests
pnpm test

# Lint
pnpm lint
```

## Mejores Prácticas
1. Documentar código complejo
2. Mantener componentes pequeños y reutilizables
3. Implementar manejo de errores robusto
4. Seguir principios SOLID
5. Realizar code reviews

## Debugging
- Usar console.log estratégicamente
- Implementar logging estructurado
- Monitorear errores en producción

## Optimización
1. Lazy loading de componentes
2. Optimización de imágenes
3. Caching adecuado
4. Minimizar bundle size

## Logs

La aplicación utiliza Winston para el logging. Los archivos de log se almacenan en:
- `apps/api/logs/error.log`: Solo errores
- `apps/api/logs/combined.log`: Todos los logs

### Gestión de Logs

1. **Desarrollo**
   - Los logs se encuentran en `apps/api/logs/`
   - Puedes eliminar los archivos de log cuando sea necesario
   - No subir los logs al repositorio (están en .gitignore)

2. **Producción**
   - Configurar rotación de logs
   - Establecer políticas de retención
   - Considerar un servicio de logging centralizado

## Desarrollo

1. **Iniciar en Desarrollo**:
   ```bash
   # Desde la raíz del proyecto
   pnpm dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

## Flujo de Autenticación

1. **Login**:
   - Usuario ingresa credenciales
   - Frontend envía petición a `/api/auth/login`
   - Backend valida y retorna token JWT
   - Frontend almacena token y redirige

2. **Protección de Rutas**:
   - Middleware verifica token
   - Sin token redirige a login
   - Con token permite acceso

3. **Logout**:
   - Eliminar token
   - Redirigir a login

## Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## Próximos Pasos

1. Implementar más funcionalidades en el dashboard
2. Agregar gestión de usuarios
3. Implementar roles y permisos
4. Agregar tests
5. Mejorar documentación de API
