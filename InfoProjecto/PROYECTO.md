# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

## Descripción del Proyecto

SIPROD es un sistema integral diseñado para la gestión eficiente de resultados policiales y recursos. El sistema está construido utilizando tecnologías modernas y una arquitectura monorepo que facilita el mantenimiento y la escalabilidad.

## Estructura del Proyecto

### Aplicaciones (`/apps`)

- **web**: Aplicación web principal construida con Next.js
  - Interfaz de usuario moderna y responsive
  - Integración con Material-UI y Emotion para estilos
  - SSR para mejor rendimiento y SEO
- **api**: API REST construida con Node.js/Express
  - Endpoints RESTful
  - Autenticación y autorización
  - Validación de datos

### Paquetes (`/packages`)

- **ui**: Biblioteca de componentes compartidos
  - Componentes reutilizables
  - Tema personalizado
  - Documentación de componentes
- **utils**: Utilidades y funciones comunes
  - Funciones helper
  - Validadores
  - Tipos compartidos
- **config**: Configuraciones compartidas
  - ESLint
  - Prettier
  - Otras configuraciones
- **tsconfig**: Configuraciones de TypeScript
  - Base
  - Next.js
  - Biblioteca
  - API

## Tecnologías Principales

### Frontend

- Next.js 14
- TypeScript
- Material-UI
- Emotion
- TanStack Query

### Backend

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL

### DevOps

- Docker
- Docker Compose
- GitHub Actions (CI/CD)
- Turborepo

## Configuración del Entorno

### Requisitos

- Node.js >= 18
- PNPM
- Docker y Docker Compose
- PostgreSQL

### Instalación

1. Clonar el repositorio
2. Instalar dependencias: `pnpm install`
3. Copiar `.env.example` a `.env`
4. Configurar variables de entorno
5. Iniciar en desarrollo: `pnpm dev`

### Scripts Disponibles

- `pnpm dev`: Inicia el entorno de desarrollo
- `pnpm build`: Construye todos los paquetes
- `pnpm test`: Ejecuta las pruebas
- `pnpm lint`: Ejecuta el linter
- `pnpm format`: Formatea el código

## Guías de Desarrollo

### Convenciones de Código

- Usar TypeScript estricto
- Seguir guías de estilo de ESLint
- Documentar componentes y funciones
- Escribir pruebas unitarias

### Flujo de Trabajo Git

1. Crear rama feature/fix
2. Desarrollar cambios
3. Ejecutar pruebas y lint
4. Crear Pull Request
5. Code Review
6. Merge a main

## Entorno de Desarrollo

### Docker

- **Configuración Optimizada**
  - Servicios containerizados: frontend, backend, base de datos
  - Healthchecks implementados para todos los servicios
  - Volúmenes configurados para desarrollo hot-reload
  - Tiempos de compilación optimizados

### Comandos Principales

```bash
# Iniciar servicios
docker-compose up -d

# Reconstruir servicios (build limpio)
docker-compose build --no-cache

# Construir servicio específico
docker-compose build frontend
docker-compose build backend
```

## Despliegue

### Desarrollo

```bash
docker-compose up
```

### Producción

```bash
docker-compose -f docker-compose.prod.yml up
```

## Entorno de Producción

### Configuración de Servidor

- **Nginx**
  - Proxy inverso para frontend y backend
  - Optimización de caché para contenido estático
  - Headers de seguridad configurados
  - Preparado para SSL/TLS

### Gestión de Procesos

- **PM2**
  - Modo cluster para escalabilidad
  - Sistema de logs configurado
  - Monitoreo de recursos
  - Reinicio automático en caso de fallos

### Variables de Entorno

- **Producción**

  ```bash
  # Frontend (.env.production)
  NEXT_PUBLIC_API_URL=https://siprod.uy/api

  # Backend (.env.production)
  DATABASE_URL=postgresql://user:pass@localhost:5432/siprod
  ```

### Seguridad

- Headers HTTP de seguridad
- Configuración CORS
- Rate limiting (planificado)
- WAF (planificado)

### Monitoreo

- Logs centralizados
- Métricas de rendimiento
- Alertas configurables
- Backups automatizados (planificado)

## Documentación Adicional

- [API Documentation](./docs/api.md)
- [Component Library](./docs/ui.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

## Documentación Técnica - SIPROD

> **Propósito del Archivo**: Este documento contiene la documentación técnica detallada del proyecto. Incluye la arquitectura del sistema, decisiones técnicas, configuraciones de infraestructura y guías de implementación. Es la referencia principal para entender los aspectos técnicos del proyecto.

## Arquitectura del Sistema

### Frontend (Next.js)
- **Framework**: Next.js 14
- **UI Library**: Material UI + Emotion
- **State Management**: React Query + Zustand
- **Form Management**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

### Backend (NestJS)
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Infraestructura
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15
- **CI/CD**: GitHub Actions
- **Monitoreo**: Prometheus + Grafana (planificado)

## Flujo de Desarrollo

### Local Development
1. Instalar dependencias con pnpm
2. Configurar variables de entorno
3. Iniciar servicios individualmente con `pnpm dev`
4. Desarrollar y probar cambios localmente

### Producción
1. Clonar repositorio en servidor
2. Configurar variables de entorno de producción
3. Construir y ejecutar con Docker Compose
4. Monitorear logs y métricas

## Seguridad

### Autenticación
- JWT para tokens de acceso
- Refresh tokens para sesiones largas
- Rate limiting para prevenir ataques de fuerza bruta

### Autorización
- RBAC (Role-Based Access Control)
- Middleware de autorización por ruta
- Validación de permisos por acción

### Protección de Datos
- Encriptación de datos sensibles
- HTTPS obligatorio en producción
- Sanitización de inputs
- Validación de datos con Zod

## APIs y Endpoints

### REST API
- `/api/auth/*`: Endpoints de autenticación
- `/api/users/*`: Gestión de usuarios
- `/api/reports/*`: Gestión de reportes
- `/api/resources/*`: Gestión de recursos

### WebSocket (planificado)
- Notificaciones en tiempo real
- Actualizaciones de estado
- Chat interno

## Base de Datos

### Modelos Principales
- Users
- Reports
- Resources
- Departments
- Roles
- Permissions

### Relaciones
- User -> Roles (many-to-many)
- Reports -> Users (many-to-one)
- Resources -> Departments (many-to-one)

## Monitoreo y Logging

### Logs
- Winston para logging estructurado
- Rotación de logs
- Niveles de log configurables

### Métricas (planificado)
- Prometheus para métricas
- Grafana para visualización
- Alertas automáticas

## Backups y Recuperación

### Estrategia de Backup
- Backups diarios de la base de datos
- Retención de 30 días
- Backups incrementales

### Recuperación
- Procedimientos documentados
- Scripts de restauración
- Pruebas periódicas

## Escalabilidad

### Horizontal
- Containers stateless
- Load balancing
- Sesiones distribuidas

### Vertical
- Recursos configurables por container
- Optimización de queries
- Caching estratégico

## Mantenimiento

### Actualizaciones
- Ventanas de mantenimiento programadas
- Rollback automatizado
- Testing en staging

### Monitoreo
- Healthchecks
- Métricas de performance
- Alertas configurables

## Roadmap

### Fase 1 (Actual)
- ✅ Setup inicial del proyecto
- ✅ Autenticación básica
- ✅ CRUD de usuarios
- 🔄 Gestión de reportes

### Fase 2 (Próximo)
- Dashboards analíticos
- Sistema de notificaciones
- Integración con sistemas externos
- Reportes avanzados

### Fase 3 (Futuro)
- BI y análisis predictivo
- Mobile app
- Integración con GIS
- Chat interno

## Estado Actual del Proyecto

### Despliegue en Servidor

- **Usuario Principal:** d5baf91c, mario_berni
- **Directorio:** /var/www/siprod
- **Repositorio:** https://github.com/MarioBerni/SIPROD.git

### Configuración Implementada

1. **Acceso y Permisos**

   - Conexión SSH configurada
   - Permisos de directorio ajustados
   - Usuarios configurados correctamente

2. **Código y Dependencias**
   - Repositorio clonado
   - Dependencias instaladas con pnpm
   - Husky pendiente de configuración

### Próximos Pasos de Despliegue

1. **Docker**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```
