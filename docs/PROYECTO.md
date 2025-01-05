# SIPROD - Documentación Principal

## 📋 Visión General
SIPROD (Sistema de Gestión de Resultados Policiales y Recursos) es una plataforma integral diseñada para centralizar y gestionar información policial crítica.

### Objetivos Principales
- Facilitar la toma de decisiones operativas
- Proporcionar análisis estadístico en tiempo real
- Gestionar eficientemente recursos humanos y materiales
- Mejorar la coordinación entre departamentos

## 🏗️ Arquitectura y Estructura - SIPROD

## Objetivo
Profundizar en la arquitectura y la estructura general del proyecto SIPROD. Muestra cómo se organizan las carpetas, los paquetes, las apps y cómo interactúan entre sí.

## Función
- Describir cómo está estructurado el monorepo (apps, packages, docs).
- Detallar el stack tecnológico (frontend, backend, devops) y su razón de ser.
- Ofrecer un panorama global de los modelos principales y las estrategias de seguridad.

## 📁 Estructura del Monorepo

```
siprod/
├── apps/
│   ├── api/              # Backend Express
│   │   ├── src/
│   │   ├── prisma/
│   │   └── tests/
│   └── web/              # Frontend Next.js
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   ├── ui/               # Componentes compartidos
│   ├── utils/            # Utilidades comunes
│   └── config/           # Configuraciones
└── docs/                # Documentación
```

## 🏗 Arquitectura

### Frontend (Next.js 14)
- App Router para routing y SSR
- Material UI para componentes base
- React Query para gestión de datos
- Zustand para estado global

### Backend (Express)
- Arquitectura modular por dominio
- Prisma ORM para base de datos
- Redis para caché y sesiones
- JWT para autenticación

### DevOps
- Turborepo para gestión del monorepo
- GitHub Actions para CI/CD
- PM2 para gestión de procesos
- Nginx como reverse proxy

## 📊 Modelos Principales

### Usuario
```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  rol       String
  estado    Boolean  @default(true)
}
```

### Resultado
```prisma
model Resultado {
  id          Int      @id @default(autoincrement())
  fecha       DateTime
  tipo        String
  descripcion String
}
```

### Recurso
```prisma
model Recurso {
  id         Int      @id @default(autoincrement())
  tipo       String
  estado     String
  ubicacion  String
}
```

## 🔒 Seguridad

### Autenticación
- JWT con rotación cada 90 días
- Cookies HTTP-Only
- Rate limiting por IP

### Autorización
- RBAC (Role-Based Access Control)
- Middleware de validación por ruta
- Logs de auditoría

## 🔄 Flujo de Datos

1. Cliente hace request a `/api/*`
2. Nginx redirige al servicio correcto
3. Express valida autenticación
4. Controlador procesa la petición
5. Prisma interactúa con PostgreSQL
6. Redis cachea resultados frecuentes

## 📦 Dependencias Principales

### Frontend
```json
{
  "next": "14.0.0",
  "react": "18.2.0",
  "@mui/material": "5.14.0",
  "@tanstack/react-query": "5.0.0"
}
```

### Backend
```json
{
  "express": "4.18.0",
  "@prisma/client": "5.0.0",
  "redis": "4.6.0",
  "jsonwebtoken": "9.0.0"
}
```

## 🛠️ Stack Tecnológico

### Frontend (Next.js 14)
- **Framework**: Next.js 14 con App Router
- **UI**: Material-UI + Emotion
- **Estado**: 
  - React Query (datos del servidor)
  - Zustand (estado local)
- **Formularios**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

### Backend (Express)
- **Runtime**: Node.js 18
- **Framework**: Express
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Cache**: Redis
- **Testing**: Jest + Supertest

### DevOps
- **CI/CD**: GitHub Actions
- **Monitoreo**: 
  - Prometheus + Grafana
  - PM2
- **Logs**: Winston + ELK Stack
- **Seguridad**: 
  - JWT + HTTP-Only Cookies
  - Rate Limiting
  - CORS configurado

## 📊 Arquitectura de Datos

### Modelos Principales
```prisma
model Usuario {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Resultado {
  id          String   @id @default(uuid())
  titulo      String
  descripcion String
  fecha       DateTime
  estado      Estado   @default(PENDIENTE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ... más modelos
```

## 🔐 Seguridad

### Autenticación
1. **JWT + Cookies**
   - Tokens almacenados en cookies HTTP-Only
   - Rotación automática cada 90 días
   - Refresh tokens implementados

2. **Rate Limiting**
   ```typescript
   // Configuración actual
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
     keyGenerator: (req) => req.ip || req.connection.remoteAddress || 'unknown'
   }));
   ```

3. **Headers de Seguridad**
   - HSTS
   - CSP
   - X-Frame-Options
   - X-Content-Type-Options

## 📈 Monitoreo y Logging

### Métricas
- **Prometheus**: Métricas de sistema y aplicación
- **Grafana**: Dashboards personalizados
- **PM2**: Monitoreo de procesos

### Logging
```typescript
// Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚀 Despliegue

### Proceso de CI/CD
1. **Build y Test**
   ```yaml
   build:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v3
       - uses: pnpm/action-setup@v2
       - run: pnpm install
       - run: pnpm build
       - run: pnpm test
   ```

2. **Deploy**
   - Nginx como proxy inverso
   - PM2 para gestión de procesos
   - Certificados SSL automáticos

## 🧪 Testing

### Cobertura
- Mínimo 80% en módulos críticos
- Tests unitarios, integración y e2e

### Estructura
```
tests/
├── unit/
│   ├── controllers/
│   └── services/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

## 📱 Responsive Design

### Breakpoints
```typescript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
```

## 🔄 Estado y Cache

### React Query
```typescript
// Configuración global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});
```

### Redis
```typescript
// Configuración de cache
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});
```

## 📦 Optimizaciones

### Frontend
- Code splitting automático
- Lazy loading de componentes
- Optimización de imágenes
- Prefetch de rutas

### Backend
- Compresión gzip
- Cache en Redis
- Pooling de conexiones DB
- Rate limiting configurado

## 🔄 Mantenimiento

### Tareas Diarias
- Backup de base de datos
- Rotación de logs
- Monitoreo de métricas

### Tareas Semanales
- Análisis de rendimiento
- Revisión de logs de error
- Actualización de dependencias

## 📚 Recursos

### Documentación Externa
- [Next.js](https://nextjs.org/docs)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Material-UI](https://mui.com/)