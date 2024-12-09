# SIPROD (Sistema de Gestión de Resultados Policiales y Recursos)

## Estructura del Monorepo

Este proyecto utiliza una arquitectura monorepo con Turborepo y pnpm workspaces.

### Aplicaciones (`apps/`)

- `web/`: Frontend en Next.js
- `api/`: Backend en Express + Prisma

### Paquetes Compartidos (`packages/`)

- `config/`: Configuraciones compartidas (ESLint, etc.)
- `tsconfig/`: Configuraciones de TypeScript
- `ui/`: Componentes de UI reutilizables
- `utils/`: Utilidades y funciones compartidas

## Desarrollo

### Prerequisitos

- Docker y Docker Compose
- pnpm (gestor de paquetes)
- Node.js 18+

### Inicio Rápido

1. Clonar el repositorio
```bash
git clone [URL_REPOSITORIO]
cd SIPROD
```

2. Instalar dependencias
```bash
pnpm install
```

3. Iniciar servicios con Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Para un build limpio
docker-compose build --no-cache
```

4. Acceder a las aplicaciones
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Tiempos de Compilación Esperados
- Frontend: ~2 minutos (primera vez)
- Backend: ~1 minuto (primera vez)
- Builds subsecuentes: significativamente más rápidos

### Scripts Disponibles

- `pnpm dev`: Inicia todos los proyectos en modo desarrollo
- `pnpm build`: Construye todos los proyectos
- `pnpm lint`: Ejecuta el linting en todos los proyectos
- `pnpm test`: Ejecuta las pruebas en todos los proyectos
- `pnpm clean`: Limpia todos los archivos generados

## Convenciones

- Todos los paquetes internos usan el prefijo `@siprod/`
- La configuración de TypeScript se extiende desde `@siprod/tsconfig`
- Los componentes UI compartidos se encuentran en `@siprod/ui`
- Las utilidades compartidas se encuentran en `@siprod/utils`

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para el formato de mensajes de commit:

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios que no afectan el código
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en el proceso de build o herramientas

## Guías de Contribución

1. Crear una nueva rama desde `main`
2. Hacer cambios siguiendo las convenciones de código
3. Ejecutar pruebas y linter
4. Crear un PR con una descripción clara
