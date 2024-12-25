# SIPROD (Sistema de Gestión de Resultados Policiales y Recursos)

## Descripción General
SIPROD es un sistema integral diseñado para la gestión eficiente de información policial, facilitando:
- Análisis estadístico de resultados operativos
- Gestión de recursos humanos y materiales
- Toma de decisiones basada en datos
- Seguimiento de indicadores clave

## Características Principales
- Dashboard interactivo con métricas en tiempo real
- Gestión de reportes personalizables
- Sistema de autenticación y autorización robusto
- API RESTful documentada
- Interfaz responsive y moderna

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14
- **UI/Estilos**: TailwindCSS, Componentes personalizados
- **Estado**: React Query, Zustand
- **Lenguaje**: TypeScript

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Cache**: Redis (opcional)

### DevOps
- **Gestión de Procesos**: PM2
- **CI/CD**: GitHub Actions
- **Monitoreo**: PM2 + Logs personalizados

## Requisitos Previos
- Node.js 18 o superior
- PNPM 8.6 o superior
- PostgreSQL 15 o superior
- PM2 (instalación global)
- Git

## Instalación y Configuración

### 1. Preparación del Entorno
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Clonar el repositorio
git clone [URL_REPOSITORIO]
cd SIPROD

# Instalar dependencias
pnpm install
```

### 2. Configuración de Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables según el entorno
nano .env
```

### 3. Configuración de Base de Datos
```bash
# Generar cliente Prisma
pnpm --filter @siprod/api prisma:generate

# Ejecutar migraciones
pnpm --filter @siprod/api prisma:migrate
```

## Desarrollo Local

### Iniciar Servicios
```bash
# Iniciar todos los servicios
pm2 start ecosystem.local.config.js

# Ver logs
pm2 logs
```

### Endpoints Principales
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/health

### Comandos Útiles
```bash
# Construir proyecto
pnpm build

# Ejecutar tests
pnpm test

# Lint
pnpm lint

# Reiniciar servicios
pm2 restart all
```

## Documentación Detallada
Consulta la carpeta `docs/` para información específica:

- [`PROYECTO.md`](docs/PROYECTO.md): Arquitectura y estructura
- [`DESARROLLO.md`](docs/DESARROLLO.md): Guías y estándares de desarrollo
- [`OPERACIONES.md`](docs/OPERACIONES.md): Despliegue y operaciones
- [`MANTENIMIENTO.md`](docs/MANTENIMIENTO.md): Mantenimiento y actualizaciones
- [`OPTIMIZACIONES.md`](docs/OPTIMIZACIONES.md): Guías de optimización

## Estructura del Proyecto
```
SIPROD/
├── apps/
│   ├── api/         # Backend (Express + Prisma)
│   └── web/         # Frontend (Next.js)
├── packages/
│   ├── config/      # Configuraciones compartidas
│   ├── tsconfig/    # Configuraciones de TypeScript
│   ├── ui/          # Componentes de UI compartidos
│   └── utils/       # Utilidades compartidas
└── docs/           # Documentación detallada
```

## Seguridad
- Autenticación JWT
- CORS configurado
- Rate limiting
- Validación de entrada
- Sanitización de datos

## Contribución
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Convenciones de Código
- Conventional Commits
- ESLint + Prettier
- TypeScript strict mode
- Tests unitarios requeridos
- Documentación de código

## Soporte
Para reportar problemas o sugerir mejoras:
1. Revisa los issues existentes
2. Crea un nuevo issue detallado
3. Sigue la plantilla proporcionada

## Licencia
Este proyecto está bajo la Licencia [TU_LICENCIA] - ver el archivo LICENSE.md para detalles.
