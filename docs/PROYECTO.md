# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

## Descripción General
Sistema centralizado para la gestión y análisis de información policial, diseñado para facilitar la toma de decisiones y la administración de recursos.

## Estado Actual (2024-12-20)

### ✨ Mejoras Técnicas Recientes
- Implementación completa de Next.js 14 App Router
- Optimización de Server Components y Client Components
- Mejora en la arquitectura de estado global
- Implementación de caché distribuida con Redis
- Sistema de análisis en tiempo real
- Mejoras en la seguridad y autenticación

### 📊 Métricas de Rendimiento
- Build Time: Reducción del 70% con SWC
- Bundle Size: Optimización agresiva (75kB first load)
- Cache Hit Rate: 85% efectividad
- API Performance: Latencia media <80ms
- Lighthouse Score: >90 en todas las métricas
- Time to Interactive: <3s en 4G

## Arquitectura del Proyecto

### Visión General

SIPROD es un sistema monorepo que utiliza tecnologías modernas para proporcionar una solución robusta de gestión policial.

### Stack Tecnológico

#### Frontend
- Next.js 14
- TailwindCSS
- TypeScript
- React Query

#### Backend
- Node.js 18
- Express
- Prisma ORM
- PostgreSQL

#### Gestión de Procesos
- PM2 para desarrollo y producción

#### Herramientas de Desarrollo
- PNPM (gestor de paquetes)
- TypeScript
- ESLint + Prettier
- Husky (git hooks)

## Arquitectura del Sistema

### Estructura del Monorepo
```
SIPROD/
├── apps/
│   ├── api/         # Backend
│   └── web/         # Frontend
├── packages/
│   ├── config/      # Configuraciones compartidas
│   ├── tsconfig/    # Configuraciones de TypeScript
│   ├── ui/          # Componentes de UI compartidos
│   └── utils/       # Utilidades compartidas
└── docs/           # Documentación
```

### Configuración de PM2

#### Desarrollo Local (`ecosystem.local.config.js`)
```javascript
{
  apps: [
    {
      name: "siprod-frontend-dev",
      script: "node_modules/next/dist/bin/next",
      args: "dev",
      cwd: "./apps/web",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "http://localhost:4000/api"
      }
    },
    {
      name: "siprod-backend-dev",
      script: "dist/index.js",
      cwd: "./apps/api",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 4000,
        DATABASE_URL: "postgresql://...",
        CORS_ORIGIN: "http://localhost:3000"
      }
    }
  ]
}
```

### Endpoints

#### Frontend
- **URL**: http://localhost:3000
- **Rutas Principales**:
  - `/`: Página principal
  - `/dashboard`: Panel de control
  - `/reports`: Informes
  - `/settings`: Configuración

#### Backend
- **URL Base**: http://localhost:4000
- **API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

### Base de Datos

#### PostgreSQL
- **Puerto**: 5432
- **Base de datos**: siprod
- **Schema**: public

#### Prisma Schema
- Modelos definidos en `apps/api/prisma/schema.prisma`
- Migraciones automáticas gestionadas por Prisma

### Seguridad

#### CORS
- Desarrollo: http://localhost:3000
- Producción: [URL_PRODUCCION]

#### Rate Limiting
- Ventana: 15 minutos
- Máximo: 100 solicitudes

### Monitoreo

#### PM2
- Logs en tiempo real
- Métricas de rendimiento
- Gestión de procesos

## Flujo de Desarrollo

1. **Inicio de Desarrollo**
```bash
pm2 start ecosystem.local.config.js
```

2. **Monitoreo**
```bash
pm2 logs
pm2 status
pm2 monit
```

3. **Construcción**
```bash
pnpm build
```

4. **Verificación**
```bash
curl http://localhost:4000/health
curl http://localhost:4000/api
```

## Despliegue

### Proceso de Despliegue
1. Build de la aplicación
2. Verificación de salud
3. Despliegue con PM2
4. Monitoreo post-despliegue

### Rollback
PM2 permite rollback rápido:
```bash
pm2 revert [app_name]
```

## Configuración del Entorno

### Requisitos Previos

- Node.js 18 o superior
- pnpm 8 o superior
- PostgreSQL 15 o superior
- Redis (opcional)
- PM2 (global)

### Variables de Entorno

El proyecto utiliza varios archivos .env para diferentes entornos:
- `.env`: Desarrollo local
- `.env.production`: Producción

Las variables principales incluyen:
- `DATABASE_URL`: Conexión a PostgreSQL
- `REDIS_URL`: Conexión a Redis (opcional)
- `JWT_SECRET`: Secreto para tokens JWT
- `PORT`: Puerto para el backend (4000 por defecto)

## Desarrollo Local

1. Instalar dependencias:
   ```bash
   pnpm install
   ```

2. Generar el cliente Prisma:
   ```bash
   pnpm --filter @siprod/api prisma generate
   ```

3. Iniciar en modo desarrollo:
   ```bash
   pnpm dev
   ```

## Despliegue en Producción

1. Clonar el repositorio:
   ```bash
   git clone <repositorio>
   cd SIPROD
   ```

2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.production
   # Editar .env.production con los valores correctos
   ```

4. Construir la aplicación:
   ```bash
   pnpm build
   ```

5. Iniciar con PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

## Gestión con PM2

- Iniciar en desarrollo:
  ```bash
  pm2 start ecosystem.local.config.js
  ```

- Iniciar en producción:
  ```bash
  pm2 start ecosystem.config.js --env production
  ```

- Monitorear procesos:
  ```bash
  pm2 monit
  ```

- Ver logs:
  ```bash
  pm2 logs
  ```

## Mantenimiento

- **Actualizaciones**: Usar `pnpm update` para actualizar dependencias
- **Backups**: Configurar respaldos automáticos de PostgreSQL
- **Monitoreo**: Utilizar PM2 para monitoreo de procesos

## Soporte

Para más información, consultar:
- [DESARROLLO.md](./DESARROLLO.md)
- [OPERACIONES.md](./OPERACIONES.md)
- [MANTENIMIENTO.md](./MANTENIMIENTO.md)
- [OPTIMIZACIONES.md](./OPTIMIZACIONES.md)

## Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Redis (opcional)
- PM2 (global)

### Instalación
```bash
# Clonar repositorio
git clone https://[repositorio]/siprod.git
cd siprod

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores locales

# Iniciar desarrollo
pnpm dev
```

### Scripts Principales
- `pnpm dev`: Iniciar todos los servicios
- `pnpm test`: Ejecutar pruebas
- `pnpm build`: Construir para producción
- `pnpm lint`: Ejecutar linting

## Documentación Adicional
- [Desarrollo](DESARROLLO.md): Guía técnica y estándares
- [Operaciones](OPERACIONES.md): Infraestructura y despliegue
- [Mantenimiento](MANTENIMIENTO.md): Optimizaciones y tareas

## Contribución
1. Crear rama feature/fix
2. Desarrollar y probar
3. Crear PR
4. Code review
5. Merge a main

## Licencia
Propiedad del Ministerio del Interior - República Oriental del Uruguay

## Documentación Técnica del Proyecto SIPROD

### Índice
1. [Arquitectura](#arquitectura)
2. [Estructura del Monorepo](#estructura-del-monorepo)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Configuración](#configuración)
5. [Flujo de Datos](#flujo-de-datos)
6. [Seguridad](#seguridad)
7. [Integración y Despliegue](#integración-y-despliegue)

### Arquitectura

#### Visión General
```mermaid
graph TB
    Client[Cliente Web/Mobile]
    API[API Backend]
    DB[(PostgreSQL)]
    Cache[(Redis)]
    Auth[Auth Service]
    
    Client --> API
    API --> DB
    API --> Cache
    API --> Auth
```

#### Componentes Principales

##### Frontend (Next.js)
- Server Components para renderizado óptimo
- App Router para enrutamiento moderno
- Zustand para gestión de estado
- TailwindCSS para estilos
- React Query para gestión de datos

##### Backend (Express)
- Arquitectura modular
- Middleware personalizado
- Validación con Zod
- ORM con Prisma
- Caché con Redis

##### Base de Datos
- PostgreSQL como almacenamiento principal
- Prisma para migraciones y schema
- Índices optimizados
- Particionamiento por fecha

### Estructura del Monorepo

#### Organización de Carpetas
```
SIPROD/
├── apps/
│   ├── api/                 # Backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   └── tests/
│   └── web/                 # Frontend
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── utils/
│       └── public/
├── packages/
│   ├── config/             # Configuraciones compartidas
│   ├── tsconfig/          # Configuraciones de TypeScript
│   ├── ui/                # Componentes UI compartidos
│   └── utils/             # Utilidades compartidas
└── docs/                  # Documentación
```

#### Packages Compartidos

##### @siprod/ui
```typescript
// Componentes reutilizables
export * from './components/Button'
export * from './components/Card'
export * from './components/Table'
export * from './components/Form'
```

##### @siprod/config
```typescript
// Configuraciones compartidas
export const API_CONFIG = {
  baseUrl: process.env.API_URL,
  timeout: 5000,
  retries: 3
}
```

##### @siprod/utils
```typescript
// Utilidades compartidas
export * from './date'
export * from './format'
export * from './validation'
```

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14
- **UI/Estilos**: 
  - TailwindCSS
  - Headless UI
  - Framer Motion
- **Estado**: 
  - Zustand
  - React Query
- **Formularios**: 
  - React Hook Form
  - Zod
- **Gráficos**: 
  - Chart.js
  - D3.js

#### Backend
- **Runtime**: Node.js 18
- **Framework**: Express
- **ORM**: Prisma
- **Validación**: Zod
- **Autenticación**: JWT
- **Caché**: Redis
- **Logging**: Winston

#### Base de Datos
- **Motor**: PostgreSQL 15
- **Migraciones**: Prisma Migrate
- **Backup**: pg_dump automatizado
- **Monitoreo**: pg_stat_statements

#### DevOps
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions
- **Monitoreo**: 
  - PM2 Plus
  - Grafana
  - Prometheus

### Configuración

#### Variables de Entorno
```bash
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GA_ID=UA-XXXXX-Y

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/siprod
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

#### PM2 Ecosystem
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'siprod-frontend',
      script: 'apps/web/.next/standalone/server.js',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'siprod-backend',
      script: 'apps/api/dist/index.js',
      env: {
        PORT: 4000,
        NODE_ENV: 'production'
      }
    }
  ]
}
```

#### Base de Datos
```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Flujo de Datos

#### Autenticación
```mermaid
sequenceDiagram
    Client->>+API: POST /auth/login
    API->>+DB: Verificar credenciales
    DB-->>-API: Usuario encontrado
    API->>API: Generar JWT
    API-->>-Client: Token JWT
```

#### Peticiones API
```typescript
// Frontend
const fetchData = async () => {
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.json()
}

// Backend
app.get('/api/data', auth, async (req, res) => {
  const data = await prisma.data.findMany()
  res.json(data)
})
```

### Seguridad

#### Autenticación
- JWT con rotación de tokens
- Refresh tokens
- Rate limiting
- CORS configurado

#### API Security
```typescript
// Middleware de seguridad
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
```

#### Validación de Datos
```typescript
// Schema de validación
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
})

// Middleware de validación
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      res.status(400).json(error)
    }
  }
}
```

### Integración y Despliegue

#### GitHub Actions
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm deploy
```

#### Monitoreo
- PM2 para logs y métricas
- Grafana para visualización
- Alertas configuradas
- Backup automático

## Referencias
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
