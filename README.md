# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

> **Propósito**: Este documento es el punto de entrada principal al proyecto SIPROD. Proporciona una visión general del sistema y guía a los nuevos colaboradores hacia la documentación detallada.

## ¿Qué es SIPROD?

SIPROD es un sistema integral diseñado para la gestión eficiente de resultados policiales y recursos. El sistema permite:

- Centralización de información policial
- Análisis y reportes estadísticos
- Gestión de recursos humanos y materiales
- Herramientas CRUD seguras
- Escalabilidad y adaptabilidad

## Documentación

La documentación completa del proyecto se encuentra en la carpeta `docs/`:

- [Proyecto](docs/PROYECTO.md): Documentación técnica detallada, arquitectura y estructura
- [Desarrollo](docs/DESARROLLO.md): Estándares, mejores prácticas y guías de implementación
- [Infraestructura](docs/INFRAESTRUCTURA.md): Configuración del servidor y detalles operativos
- [Historial](docs/HISTORIAL.md): Registro de cambios y evolución del proyecto
- [Tareas](docs/TAREAS.md): Backlog y seguimiento de actividades

## Estado Actual

### ✨ Últimas Mejoras (Diciembre 2024)
- Migración completa a Next.js 14 con App Router
- Implementación de Server Components para mejor rendimiento
- Optimización de bundle size y tiempo de carga
- Mejoras en la seguridad y autenticación
- Integración de análisis en tiempo real

### 📊 Métricas de Rendimiento
- Build Time: <30s con SWC
- Bundle Size: First Load JS optimizado a 75kB
- Cache Hit Rate: 85% en Turbo
- API Performance: <80ms latencia media
- Lighthouse Score: >90 en todas las métricas

## Tecnologías Core

### Frontend
- Next.js 14 con App Router
- React 18 con Server Components
- TailwindCSS para estilos
- SWC para compilación
- TypeScript estricto

### Backend
- Node.js 18+
- Express optimizado
- Prisma ORM
- PostgreSQL
- Redis para caché

### DevOps
- PM2 para gestión de procesos
- GitHub Actions para CI/CD
- Nginx como proxy inverso
- Monitoreo avanzado

## Inicio Rápido

### Requisitos Previos
- Node.js 18 o superior
- pnpm 8 o superior
- PostgreSQL 15 o superior
- Redis (opcional)
- PM2 (global)

### Configuración Local

1. Clonar el repositorio:
```bash
git clone https://[repositorio]/siprod.git
cd siprod
```

2. Instalar PM2 globalmente:
```bash
npm install -g pm2
```

3. Instalar dependencias:
```bash
pnpm install
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con valores locales
```

5. Generar el cliente Prisma:
```bash
pnpm --filter @siprod/api prisma generate
```

## Desarrollo

Iniciar en modo desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- API: http://localhost:4000/api
- Health Check: http://localhost:4000/health

## Producción

1. Construir la aplicación:
```bash
pnpm build
```

2. Iniciar con PM2:
```bash
pm2 start ecosystem.config.js --env production
```

3. Monitorear:
```bash
pm2 monit
```

## Estructura del Proyecto
```
SIPROD/
├── apps/
│   ├── api/         # Backend en Express + Prisma
│   └── web/         # Frontend en Next.js
├── packages/
│   ├── ui/          # Componentes UI compartidos
│   ├── config/      # Configuraciones compartidas
│   └── utils/       # Utilidades compartidas
├── docs/            # Documentación
└── scripts/         # Scripts de utilidad
```

## Scripts Disponibles

- `pnpm dev`: Iniciar en modo desarrollo
- `pnpm build`: Construir para producción
- `pnpm start`: Iniciar en producción
- `pnpm lint`: Ejecutar linter
- `pnpm test`: Ejecutar tests
- `pnpm clean`: Limpiar builds

## Documentación

Para más información, consulta:
- [Guía de Desarrollo](docs/DESARROLLO.md)
- [Guía de Operaciones](docs/OPERACIONES.md)
- [Guía de Mantenimiento](docs/MANTENIMIENTO.md)

## Soporte

Para reportar problemas o sugerir mejoras, por favor crear un issue en el repositorio.

### Comandos Útiles de PM2

- Ver logs: `pm2 logs`
- Estado de servicios: `pm2 status`
- Reiniciar servicios: `pm2 restart all`
- Detener servicios: `pm2 stop all`
- Eliminar servicios: `pm2 delete all`
