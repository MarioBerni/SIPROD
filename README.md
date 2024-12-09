# SIPROD

Sistema de Gestión de Resultados Policiales y Recursos

## Descripción
SIPROD es una plataforma integral diseñada para centralizar y gestionar información relevante para la toma de decisiones policiales, incluyendo resultados operativos, recursos humanos y materiales.

## Stack Tecnológico

### Frontend
- Next.js
- Material UI + Emotion
- TypeScript

### Backend
- Node.js
- PostgreSQL + Prisma
- TypeScript

### Infraestructura
- Docker
- Nginx
- PM2
- GitHub Actions (CI/CD)

## Configuración del Proyecto

### Requisitos Previos
- Node.js 18 o superior
- Docker y Docker Compose
- Git

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MarioBerni/SIPROD.git
cd SIPROD
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Iniciar los servicios con Docker:
```bash
docker-compose up --build
```

## Estructura del Proyecto
```
SIPROD/
├── frontend/          # Aplicación Next.js
├── backend/           # API Node.js
├── docs/             # Documentación
└── docker/           # Configuraciones de Docker
```

## Desarrollo

Para desarrollo local:
```bash
docker-compose up --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Base de datos: localhost:5432
