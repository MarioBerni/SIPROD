# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

> **Propósito del Archivo**: Este documento sirve como punto de entrada principal al proyecto. Proporciona una visión general del sistema, instrucciones de configuración inicial, y enlaces a documentación más detallada. Es el primer archivo que debe consultar cualquier persona que se una al proyecto.

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

## Despliegue en Producción

### Prerequisitos

- Nginx
- PM2
- Node.js 18+
- PostgreSQL
- Let's Encrypt (para SSL)

### Configuración del Servidor

1. **Nginx**

```bash
# Copiar configuración
sudo cp nginx/siprod.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl restart nginx
```

2. **PM2**

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start ecosystem.config.js

# Configurar inicio automático
pm2 startup
pm2 save
```

3. **Variables de Entorno**

```bash
# Copiar archivos de ejemplo
cp .env.example .env
# Editar variables según el entorno
```

### Monitoreo

```bash
# Ver estado de las aplicaciones
pm2 status

# Ver logs
pm2 logs

# Monitoreo en tiempo real
pm2 monit
```

## Estado Actual

- ✅ Conexión SSH configurada
- ✅ Repositorio clonado
- ✅ Dependencias instaladas
- 🔄 Configuración de Husky pendiente
- 🔄 Despliegue con Docker pendiente
- 🔄 Configuración de PM2 pendiente

## Infraestructura

### Servidor de Producción

- **Sistema Operativo:** Almalinux 8 + cPanel
- **Recursos:**
  - RAM: 8GB
  - CPU: 2 vCPUs @ 3.35GHz
  - Almacenamiento: 100GB SSD

### Stack Tecnológico

- **Frontend:** Next.js, Material UI + Emotion, TypeScript
- **Backend:** Node.js, Express/Next API Routes, PostgreSQL + Prisma
- **Infraestructura:** Docker, Nginx, PM2
- **CI/CD:** GitHub Actions
- **Calidad:** TypeScript, ESLint, Prettier, Jest/Cypress

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
