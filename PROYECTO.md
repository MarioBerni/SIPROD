# Documentación del Proyecto SIPROD

## Descripción General
Sistema de Información de Patrullajes y Resultados Operativos Digitales (S.I.P.R.O.D.)

## Estructura del Proyecto (Monorepo)
```
SIPROD/
├── packages/
│   ├── frontend/          # Next.js frontend
│   │   ├── src/
│   │   ├── public/
│   │   └── Dockerfile.dev
│   ├── backend/           # Node.js/Express backend
│   │   ├── src/
│   │   └── Dockerfile.dev
│   ├── shared/           # Código compartido
│   └── types/            # Tipos TypeScript compartidos
├── docker-compose.yml    # Configuración de servicios
├── .dockerignore        # Exclusiones para Docker
├── turbo.json           # Configuración de Turborepo
└── package.json         # Workspaces y dependencias root
```

## Entorno de Desarrollo

### Requisitos Previos
- Node.js 18 o superior
- Docker Desktop
- Git

### Configuración Docker
El proyecto utiliza Docker para desarrollo y producción:

#### Servicios
- **Frontend**: Next.js en puerto 3000
  - Hot-reload habilitado
  - Variables de entorno configuradas
- **Backend**: Node.js/Express en puerto 4000
  - Typescript con ts-node-dev
  - Auto-recarga en desarrollo
- **Base de Datos**: PostgreSQL 15
  - Puerto 5432
  - Volumen persistente para datos

#### Comandos Principales
```bash
# Iniciar todos los servicios
docker-compose up

# Reconstruir imágenes
docker-compose build

# Detener servicios
docker-compose down
```

## Componentes Principales

### Frontend

#### Layouts
- `MainLayout.tsx`: Layout principal de la aplicación
- `dashboard/layout.tsx`: Layout específico para el dashboard

#### Componentes
- `Navbar.tsx`: Barra de navegación principal con drawer responsive
  - Diseño moderno y minimalista
  - Drawer superpuesto
  - Navegación intuitiva
  - Información de usuario y versión

#### Configuración
- `theme.ts`: Configuración del tema Material-UI
  - Paleta de colores personalizada
  - Sistema de tipografía responsive
  - Estilos de componentes consistentes

### Backend

#### Dependencias Principales
```json
{
  "dependencies": {
    "express": "Servidor web",
    "prisma": "ORM para base de datos",
    "@prisma/client": "Cliente Prisma",
    "bcrypt": "Encriptación de contraseñas",
    "jsonwebtoken": "Autenticación JWT",
    "zod": "Validación de datos",
    "winston": "Sistema de logging",
    "cors": "Middleware CORS"
  },
  "devDependencies": {
    "typescript": "Soporte de TypeScript",
    "@types/node": "Tipos de Node.js",
    "@types/express": "Tipos de Express",
    "@types/bcrypt": "Tipos de bcrypt",
    "@types/jsonwebtoken": "Tipos de JWT",
    "@types/cors": "Tipos de CORS",
    "ts-node-dev": "Desarrollo con recarga automática"
  }
}
```

#### API Endpoints Planificados
- Autenticación: `/api/auth`
  - Login
  - Registro
  - Recuperación de contraseña
- Usuarios: `/api/users`
  - CRUD de usuarios
  - Gestión de roles
- Patrullajes: `/api/patrols`
  - Registro de patrullajes
  - Consulta de operativos
  - Reportes y estadísticas

## Tecnologías Utilizadas

### Frontend
- Next.js 14 con App Router
- TypeScript
- Material-UI (MUI)
- Emotion para estilos
- React Icons

### Backend
- Node.js con TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticación
- Zod para validación
- Winston para logging
- CORS para seguridad

### Herramientas de Desarrollo
- ESLint
- Prettier
- TypeScript Compiler
- Git para control de versiones
- ts-node-dev para desarrollo

## Guías de Desarrollo

### Estándares de Código
1. Usar TypeScript estricto
2. Seguir las reglas de ESLint
3. Mantener componentes modulares
4. Documentar funciones y componentes principales

### Estilos y Diseño
1. Usar Emotion styled para componentes estilizados
2. Seguir la guía de diseño de Material-UI
3. Mantener consistencia en espaciados y tipografía
4. Usar el sistema de temas para colores y estilos globales

### Backend
1. Arquitectura en capas (Controller -> Service -> Model)
2. Validación de entrada con Zod
3. Manejo centralizado de errores
4. Logging estructurado con Winston
5. Tests unitarios para lógica crítica
6. Uso de variables de entorno para configuración
