# Documentación Técnica del Proyecto SIPROD

> **Propósito**: Este documento proporciona la documentación técnica detallada del proyecto SIPROD, incluyendo la estructura del monorepo, descripción de cada paquete, flujos de CI/CD, e integración con Docker.
> 
> **Público Objetivo**: Desarrolladores backend, frontend y DevOps interesados en la arquitectura interna.

## Arquitectura del Sistema

### Estructura del Monorepo

```
SIPROD/
├── apps/
│   ├── api/         # Backend API (NestJS)
│   └── web/         # Frontend (Next.js)
├── packages/
│   ├── config/      # Configuraciones compartidas
│   ├── tsconfig/    # Configuraciones de TypeScript
│   ├── ui/          # Componentes UI compartidos
│   └── utils/       # Utilidades compartidas
└── docker-compose.yml
```

### Descripción de Paquetes

#### Frontend (`apps/web`)
- Framework: Next.js 14
- UI: Material-UI + Emotion
- Estado: TanStack Query
- Testing: Jest + React Testing Library

#### Backend (`apps/api`)
- Framework: NestJS
- ORM: Prisma
- Base de datos: PostgreSQL
- Testing: Jest

#### Paquetes Compartidos
- `packages/ui`: Biblioteca de componentes reutilizables
- `packages/utils`: Funciones helper y tipos compartidos
- `packages/config`: Configuraciones de linting y build
- `packages/tsconfig`: Configuraciones base de TypeScript

## Flujos de CI/CD

### Pipeline de Integración Continua
1. Lint y formateo de código
2. Pruebas unitarias
3. Pruebas de integración
4. Build de aplicaciones
5. Análisis de seguridad

### Pipeline de Despliegue
1. Build de imágenes Docker
2. Push a registro de contenedores
3. Actualización de servicios en producción
4. Pruebas de smoke post-despliegue

## Integración con Docker

### Servicios
- Frontend (Next.js)
- Backend (NestJS)
- Base de datos (PostgreSQL)
- Redis (Cache)
- Nginx (Proxy inverso)

### Configuración de Red
- Frontend: Puerto 8080
- Backend: Puerto 4000
- Base de datos: Puerto 5432
- Redis: Puerto 6379

## Base de Datos

### Modelo de Datos
[Diagrama pendiente]

### Migraciones
- Gestionadas por Prisma
- Versionadas en Git
- Aplicadas automáticamente en CI/CD

## Seguridad

### Autenticación
- JWT para sesiones
- Refresh tokens
- OAuth 2.0 (planificado)

### Autorización
- RBAC (Role-Based Access Control)
- Políticas por recurso
- Auditoría de accesos

## Monitoreo

### Métricas
- Prometheus para métricas
- Grafana para visualización
- Alertas configuradas

### Logging
- Winston para logs estructurados
- ELK Stack para agregación
- Retención configurable

## Próximos Pasos

1. Implementar OAuth 2.0
2. Mejorar cobertura de pruebas
3. Optimizar builds de Docker
4. Configurar auto-scaling
