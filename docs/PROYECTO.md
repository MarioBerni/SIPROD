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

## Estructura del Proyecto

```
siprod/
├── apps/
│   ├── api/         # Backend (Node.js + Express)
│   └── web/         # Frontend (Next.js)
├── packages/
│   ├── ui/          # Componentes compartidos
│   ├── config/      # Configuraciones compartidas
│   └── utils/       # Utilidades compartidas
├── scripts/         # Scripts de desarrollo y despliegue
└── docs/           # Documentación
```

## Arquitectura del Sistema

### Frontend (Next.js 14)
- **App Router**: Routing basado en sistema de archivos
- **Server Components**: Renderizado optimizado
- **Client Components**: Interactividad selectiva
- **State Management**: Zustand + React Query
- **Styling**: TailwindCSS + CSS Modules
- **Build**: SWC + Webpack optimizado

### Backend (Node.js)
- **API**: Express con TypeScript
- **Database**: PostgreSQL + Prisma
- **Cache**: Redis distribuido
- **Auth**: JWT + OAuth2
- **Validación**: Zod
- **Logging**: Winston + ELK Stack

### DevOps
- **CI/CD**: GitHub Actions
- **Containers**: Docker + Compose
- **Proxy**: Nginx configurado para SSR
- **Monitoring**: Grafana + Prometheus
- **Logs**: ELK Stack

## Tecnologías Principales

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18, TailwindCSS
- **Build**: SWC, Webpack
- **Testing**: Jest, Testing Library

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **ORM**: Prisma
- **DB**: PostgreSQL

### DevOps
- **Contenedores**: Docker
- **Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoreo**: Winston, Custom Metrics

## Características Principales
- Autenticación y autorización robusta
- API RESTful documentada con Swagger
- Optimización de rendimiento (caché, compresión)
- Logs estructurados y monitoreo
- Pruebas automatizadas
- Despliegue automatizado

## Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm 8+
- Docker y Docker Compose
- Git

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
