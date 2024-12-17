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

## Arquitectura

### Monorepo

El proyecto utiliza una arquitectura monorepo para mantener todo el código fuente en un único repositorio, facilitando:

- Gestión centralizada de dependencias
- Integración continua
- Reutilización de código
- Versionado coherente

### Componentes Principales

1. **Frontend (apps/web)**

   - Next.js 14
   - Material UI + Emotion
   - TypeScript
   - Estado global con Redux Toolkit

2. **Backend (apps/api)**

   - Node.js 18.x
   - Express/Next API Routes
   - PostgreSQL + Prisma
   - TypeScript

3. **Paquetes Compartidos (packages/)**
   - Tipos
   - Utilidades
   - Componentes UI
   - Configuraciones

## Infraestructura

### Servidor de Producción

- **Proveedor:** NetUy
- **Sistema:** Almalinux 8 + cPanel
- **Recursos:**
  - 8GB RAM
  - 2 vCPUs @ 3.35GHz
  - 100GB SSD
- **IP:** 179.27.203.219

### Configuración de Despliegue

1. **Nginx**

   - Proxy inverso
   - Caché estático
   - Compresión gzip
   - SSL/TLS

2. **PM2**

   - Gestión de procesos Node.js
   - Clusters para escalabilidad
   - Monitoreo y logs
   - Reinicio automático

3. **Docker**

   - Contenedores para desarrollo y producción
   - Volúmenes para persistencia
   - Network bridge para comunicación
   - Healthchecks

4. **Base de Datos**
   - PostgreSQL 14+
   - Prisma como ORM
   - Backups automáticos
   - Migraciones versionadas

## Seguridad

### Medidas Implementadas

- Firewall (firewalld)
- SSH con claves
- HTTPS/SSL
- Rate limiting
- Sanitización de inputs

### Pendientes

- Configuración de cPanel/WHM
- Certificados SSL
- Fail2ban
- Monitoreo de seguridad

## Desarrollo

### Flujo de Trabajo

1. Desarrollo local con Docker Compose
2. Tests unitarios y e2e
3. CI/CD con GitHub Actions
4. Despliegue a producción

### Comandos Principales

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint
```
