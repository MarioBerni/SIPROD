# Estructura del Proyecto SIPROD

Este documento proporciona una visión general de la estructura y arquitectura del proyecto SIPROD (Sistema de Gestión de Resultados Policiales y Recursos). Su objetivo es ayudar a los nuevos desarrolladores a comprender la organización del código y la relación entre los diferentes componentes del sistema.

## Arquitectura del Monorepo

SIPROD está estructurado como un monorepo utilizando pnpm workspaces, lo que nos permite mantener múltiples paquetes y aplicaciones en un solo repositorio mientras compartimos dependencias y configuraciones comunes.

### Estructura de Directorios Principal

```
SIPROD/
├── apps/                  # Aplicaciones principales
│   ├── api/              # Backend API (Node.js + Express)
│   ├── web/              # Frontend (Next.js)
│   └── cache-server/     # Servidor de caché
├── packages/             # Paquetes compartidos
│   ├── backend/          # Lógica de backend compartida
│   ├── config/          # Configuraciones compartidas
│   ├── prisma-types/    # Tipos generados por Prisma
│   ├── tsconfig/        # Configuraciones de TypeScript
│   ├── types/           # Tipos compartidos
│   ├── ui/              # Componentes UI compartidos
│   └── utils/           # Utilidades compartidas
├── docs/                # Documentación del proyecto
└── scripts/             # Scripts de utilidad
```

## Aplicaciones Principales

### Frontend (apps/web)
- Framework: Next.js 14
- Lenguaje: TypeScript
- UI: Material-UI + Emotion
- Estado: Context API + React Query
- Estructura:
  ```
  web/
  ├── src/
  │   ├── app/           # Rutas y páginas (App Router)
  │   ├── components/    # Componentes reutilizables
  │   ├── config/        # Configuraciones
  │   ├── contexts/      # Contextos de React
  │   ├── hooks/         # Hooks personalizados
  │   ├── lib/           # Utilidades y helpers
  │   └── types/         # Definiciones de tipos
  ```

### Backend (apps/api)
- Framework: Express
- Base de datos: PostgreSQL
- ORM: Prisma
- Estructura:
  ```
  api/
  ├── src/
  │   ├── controllers/   # Controladores de rutas
  │   ├── middleware/    # Middleware personalizado
  │   ├── routes/        # Definiciones de rutas
  │   ├── services/      # Lógica de negocio
  │   └── utils/         # Utilidades
  ```

## Paquetes Compartidos

### UI (@siprod/ui)
Biblioteca de componentes compartidos siguiendo el diseño institucional.

### Config (@siprod/config)
Configuraciones compartidas para ESLint, TypeScript, y otras herramientas.

### Utils (@siprod/utils)
Funciones de utilidad compartidas entre aplicaciones.

## Tecnologías y Paquetes

### Core
- Node.js (>= 18.0.0)
- pnpm (>= 8.9.0)
- TypeScript 5.7
- Turbo Repo

### Frontend (@siprod/web)
#### Framework y Core
- Next.js 14
- React 18.2
- TypeScript 5.3

#### UI y Estilos
- Material-UI (MUI) 5.16
  - @mui/material
  - @mui/icons-material
  - @mui/x-data-grid
  - @mui/x-date-pickers
- Emotion (Styling)
  - @emotion/react (^11.14.0)
  - @emotion/styled (^11.14.0)
  - @emotion/cache (^11.11.0)

#### Estado y Formularios
- Formik 2.4
- Yup/Zod (Validación)
- js-cookie
- axios

#### Visualización y Mapas
- Mapbox GL
- ECharts
- html2canvas
- sharp (Optimización de imágenes)

#### Testing
- Jest
- Testing Library
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event

### Backend (@siprod/api)
#### Framework y Core
- Express 4.21
- TypeScript 5.0

#### Base de Datos y ORM
- PostgreSQL
- Prisma 6.1
- Drizzle ORM

#### Seguridad
- bcrypt
- jsonwebtoken
- jose
- helmet
- cors
- express-rate-limit

#### Logging y Monitoreo
- Winston
- Morgan
- prom-client
- node-cache

#### Documentación API
- Swagger/OpenAPI
  - swagger-jsdoc
  - swagger-ui-express

#### Testing
- Jest
- Supertest
- jest-mock-extended

### Paquetes Compartidos
#### @siprod/ui
- Componentes UI reutilizables
- Temas y estilos compartidos

#### @siprod/utils
- Utilidades compartidas
- Helpers comunes

#### @siprod/config
- Configuraciones ESLint
- Configuraciones TypeScript
- Configuraciones Prettier

### Herramientas de Desarrollo
#### Linting y Formateo
- ESLint 8
- Prettier 3
- TypeScript ESLint

#### Control de Versiones
- Husky
- Commitlint
  - @commitlint/cli
  - @commitlint/config-conventional

#### Build y Deploy
- Turbo 2.3
- Cross-env
- ts-node
- ts-node-dev

### Dependencias de Desarrollo Adicionales
- @types/* (Definiciones de tipos)
- Babel (Transpilación)
- Identity Object Proxy
- Critters (Optimización CSS)

### Gestión de Dependencias
- pnpm Workspaces
- package.json por workspace
- Versiones fijas para estabilidad

## Flujo de Datos

1. Las solicitudes del cliente son manejadas por el frontend (Next.js)
2. Las llamadas a la API son procesadas por el backend Express
3. El backend interactúa con la base de datos PostgreSQL a través de Prisma
4. Los datos en caché son manejados por el cache-server

## Dependencias Principales

- TypeScript: Tipado estático
- Prisma: ORM para base de datos
- Material-UI: Componentes de UI
- Emotion: Utilidades de CSS
- React Query: Gestión de estado del servidor
- Express: Framework de backend
- Jest: Testing
- ESLint/Prettier: Linting y formateo

## Scripts Importantes

```json
{
  "dev": "Inicia todos los servicios en modo desarrollo",
  "build": "Construye todas las aplicaciones y paquetes",
  "test": "Ejecuta las pruebas",
  "lint": "Ejecuta el linting en todo el proyecto"
}
```

## Configuración del Entorno

Ver `.env.example` para las variables de entorno necesarias.

## Recursos Adicionales

- [Guía de Desarrollo](./GUIA_DESARROLLO.md)
- [Documentación de la API](./API.md)
- [Guía de Implementación CRUD](./GUIA_IMPLEMENTACION_CRUD.md)
