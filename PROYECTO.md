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

## Despliegue

### Desarrollo
```bash
docker-compose up
```

### Producción
```bash
docker-compose -f docker-compose.prod.yml up
```

## Documentación Adicional
- [API Documentation](./docs/api.md)
- [Component Library](./docs/ui.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)
