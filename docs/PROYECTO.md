# 🏗️ Estructura y Arquitectura Técnica del Proyecto

> Este documento proporciona una visión detallada de la arquitectura técnica, estructura del monorepo y configuraciones principales del proyecto SIPROD.

# SIPROD - Estructura del Proyecto y Arquitectura Técnica

## Estructura del Monorepo Optimizada

```
SIPROD/
├── apps/                      # Aplicaciones principales
│   ├── api/                   # Backend API
│   │   ├── src/
│   │   │   ├── controllers/   # Controladores de la API
│   │   │   ├── middleware/    # Middleware personalizado
│   │   │   ├── routes/       # Definición de rutas
│   │   │   ├── services/     # Lógica de negocio
│   │   │   ├── utils/        # Utilidades
│   │   │   └── lib/          # Bibliotecas y configuraciones
│   │   └── prisma/           # Esquemas y migraciones de BD
│   └── web/                   # Frontend Next.js
│       ├── src/
│       │   ├── app/          # App Router (Next.js 14)
│       │   │   ├── (auth)/   # Grupo de rutas autenticadas
│       │   │   │   ├── dashboard/
│       │   │   │   ├── users/
│       │   │   │   └── layout.tsx
│       │   │   ├── api/      # API Routes
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/   # Componentes React
│       │   │   ├── features/ # Componentes específicos
│       │   │   ├── layouts/  # Layouts y estructura
│       │   │   ├── providers/# Proveedores de contexto
│       │   │   └── ui/      # Componentes base
│       │   ├── lib/         # Utilidades y config
│       │   ├── styles/      # Estilos globales
│       │   └── types/       # Tipos TypeScript
│       └── public/          # Archivos estáticos
├── packages/                 # Paquetes compartidos
│   ├── ui/                  # Biblioteca de componentes
│   ├── utils/              # Utilidades comunes
│   └── types/              # Tipos compartidos
├── docs/                    # Documentación
└── scripts/                 # Scripts de utilidad
```

## Arquitectura Técnica Mejorada

### Frontend (Next.js 14)
- **App Router**: Nuevo sistema de rutas con mejor rendimiento
- **Server Components**: Renderizado en servidor por defecto
- **Turbopack**: Desarrollo local más rápido
- **Streaming**: Carga progresiva de contenido
- **Metadata API**: SEO mejorado
- **Route Groups**: Organización lógica de rutas

### Backend (Node.js + Express)
- **Arquitectura en Capas**:
  - Controllers: Manejo de requests/responses
  - Services: Lógica de negocio
  - Models: Definiciones Prisma
  - Middleware: Funciones intermedias
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con cookies seguras
- **Logging**: Sistema centralizado con niveles

### Optimizaciones con Turborepo

#### Pipeline Configurado
- **build**: Compilación con caché
- **test**: Tests con cobertura
- **lint**: Análisis de código
- **dev**: Desarrollo con Turbopack
- **deploy**: Pipeline completo

#### Características
- Cache inteligente
- Ejecución paralela
- Dependencias optimizadas
- Remote caching disponible

### Paquetes Compartidos
- **@siprod/ui**: Componentes de UI reutilizables
- **@siprod/utils**: Utilidades comunes
- **@siprod/types**: Tipos TypeScript compartidos

## Guías de Configuración

### Desarrollo Local
```bash
# Instalar dependencias
pnpm install

# Desarrollo con Turbopack
pnpm dev

# Build completo
pnpm build

# Tests
pnpm test
```

### Variables de Entorno
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/siprod
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret
```

### Scripts Disponibles
- `pnpm dev`: Desarrollo con Turbopack
- `pnpm build`: Build optimizado
- `pnpm test`: Tests con Jest
- `pnpm lint`: ESLint
- `pnpm deploy`: Pipeline completo

## Mejores Prácticas

### Componentes
1. **Server Components por defecto**
   ```typescript
   // app/users/page.tsx
   export default async function UsersPage() {
     const users = await getUsers();
     return <UserList users={users} />;
   }
   ```

2. **Client Components cuando necesario**
   ```typescript
   'use client';
   
   export function InteractiveComponent() {
     const [state, setState] = useState();
     return <div onClick={() => setState(!state)}>{state}</div>;
   }
   ```

### Data Fetching
1. **Server Actions**
   ```typescript
   export async function createUser(formData: FormData) {
     'use server';
     const user = await db.user.create({
       data: {
         name: formData.get('name'),
         email: formData.get('email'),
       },
     });
     revalidatePath('/users');
     return user;
   }
   ```

2. **API Routes**
   ```typescript
   // app/api/users/route.ts
   export async function GET() {
     const users = await db.user.findMany();
     return Response.json(users);
   }
   ```

### Optimizaciones
1. **Lazy Loading**
   ```typescript
   const DynamicChart = dynamic(() => import('@/components/Chart'), {
     loading: () => <ChartSkeleton />,
     ssr: false,
   });
   ```

2. **Route Segments**
   ```typescript
   export default function Layout({ children, team, analytics }) {
     return (
       <>
         <TeamNav>{team}</TeamNav>
         <div>{children}</div>
         <AnalyticsDashboard>{analytics}</AnalyticsDashboard>
       </>
     );
   }
   ```

## Próximos Pasos

1. **Performance**
   - Implementar Streaming para grandes listas
   - Optimizar Server Components
   - Configurar Remote Caching

2. **Seguridad**
   - Implementar CSP
   - Configurar Rate Limiting
   - Mejorar autenticación

3. **Testing**
   - Aumentar cobertura
   - Implementar E2E tests
   - Automatizar pruebas de rendimiento