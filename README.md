# SIPROD (Sistema de Gestión de Resultados Policiales y Recursos)

## Objetivo
Presentar una vista rápida del proyecto SIPROD a cualquier interesado (colaborador, usuario, etc.). Contiene la descripción general, el stack tecnológico, la estructura básica del repositorio y los comandos esenciales para comenzar a trabajar en el proyecto.

## Función
- Servir como punto de entrada para nuevos usuarios y programadores.
- Explicar prerrequisitos, pasos de instalación y comandos clave de desarrollo.
- Enlazar a los demás documentos de documentación (DESARROLLO.md, OPERACIONES.md, etc.).

## 🚀 Descripción
SIPROD es un sistema integral diseñado para el Estado Mayor Policial, enfocado en la gestión eficiente de resultados policiales y recursos. Implementa las últimas tecnologías y mejores prácticas en desarrollo de software.

## 🛠 Stack Tecnológico

### Frontend
- Next.js 14 (App Router)
- Material UI + Emotion
- TypeScript
- React Query + Zustand

### Backend
- Node.js 18
- Express
- Prisma ORM
- PostgreSQL
- Redis

### DevOps
- Turborepo (Monorepo)
- PM2
- Nginx
- GitHub Actions

## 📁 Estructura del Proyecto

```
siprod/
├── apps/
│   ├── api/          # Backend Express
│   └── web/          # Frontend Next.js
├── packages/
│   ├── ui/           # Componentes compartidos
│   ├── utils/        # Utilidades comunes
│   └── config/       # Configuraciones
└── docs/            # Documentación completa
```

## 🚦 Comenzando

### Prerrequisitos
```bash
node >= 18
pnpm >= 8
postgresql >= 15
redis >= 7
```

### Instalación
```bash
git clone https://github.com/MarioBerni/SIPROD.git
cd SIPROD
pnpm install
```

### Desarrollo
```bash
pnpm dev        # Inicia todos los servicios
pnpm build      # Construye el proyecto
pnpm test       # Ejecuta tests
```

## 📚 Documentación

- [Estructura del Proyecto](./docs/PROYECTO.md)
- [Guía de Desarrollo](./docs/DESARROLLO.md)
- [Operaciones](./docs/OPERACIONES.md)
- [Mantenimiento](./docs/MANTENIMIENTO.md)
- [Optimizaciones](./docs/OPTIMIZACIONES.md)

## 📝 Licencia

Propiedad del Estado Mayor Policial, 2025. Todos los derechos reservados.
