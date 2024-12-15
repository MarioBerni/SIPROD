# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

> **Propósito del Archivo**: Este documento sirve como punto de entrada principal al proyecto. Proporciona una visión general del sistema, instrucciones de configuración inicial, y enlaces a documentación más detallada. Es el primer archivo que debe consultar cualquier persona que se una al proyecto.

## Descripción
Sistema centralizado para la gestión y análisis de información policial y recursos.

## Estructura del Proyecto
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

## Requisitos Previos
- Node.js 18 o superior
- PNPM
- PostgreSQL (para desarrollo local)
- Docker y Docker Compose (para producción)

## Desarrollo Local

1. Instalar dependencias:
```bash
pnpm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Iniciar servicios en modo desarrollo:
```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

## Despliegue en Producción

1. Clonar el repositorio en el servidor:
```bash
git clone [URL_REPOSITORIO]
cd SIPROD
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con valores de producción
```

3. Construir y ejecutar con Docker:
```bash
docker-compose up --build -d
```

## Variables de Entorno
- `DB_PASSWORD`: Contraseña de la base de datos
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `RATE_LIMIT_WINDOW`: Ventana de tiempo para rate limiting
- `RATE_LIMIT_MAX`: Máximo de peticiones en la ventana
- `POSTGRES_USER`: Usuario de PostgreSQL
- `POSTGRES_DB`: Nombre de la base de datos
- `NEXT_PUBLIC_API_URL`: URL de la API

## Estructura de Directorios
- `apps/api`: API backend en NestJS
- `apps/web`: Frontend en Next.js
- `packages/config`: Configuraciones compartidas
- `packages/tsconfig`: Configuraciones de TypeScript
- `packages/ui`: Componentes de UI compartidos
- `packages/utils`: Utilidades compartidas

## Contribución
1. Crear una rama para tu feature
2. Hacer commit de tus cambios
3. Crear un pull request

## Licencia
Propiedad de la Policía Nacional
