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
