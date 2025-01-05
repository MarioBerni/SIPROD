# 🚀 Guía de Operaciones y Despliegue

> Guía esencial para la infraestructura y despliegue de SIPROD.
> Objetivo
Describir los procesos operativos para desplegar, monitorear y gestionar SIPROD en un entorno de producción. Incluye la configuración de Nginx, PM2, backups y scripts de monitoreo.

Función

Explicar cómo hacer deploy (paso a paso), qué variables de entorno configurar y cómo monitorear la aplicación.
Mostrar troubleshooting común (logs, estado de servicios, puertos abiertos).
Indicar medidas de seguridad en producción: SSL/TLS, firewall, rate limiting, etc.

## 🔧 Infraestructura

### Componentes Principales
- **Frontend**: Next.js 14 (SSR, Redis cache)
- **Backend**: Node.js/Express con Prisma ORM
- **Base de Datos**: PostgreSQL con replicación
- **Cache**: Redis (sesiones y API)
- **Proxy**: Nginx

## 🚀 Despliegue

### Variables de Entorno
```bash
# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://api.siprod.uy
NEXT_PUBLIC_ENV=production

# Backend (.env.production)
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret
```

### Comandos de Despliegue
```bash
# Frontend
cd apps/web && pnpm build
pm2 start ecosystem.config.js --env production

# Backend
cd apps/api
pnpm build && pnpm prisma migrate deploy
pm2 start ecosystem.config.js --env production
```

## 📊 Monitoreo

### Logs y Métricas
```bash
# Logs
pm2 logs
tail -f /var/log/nginx/access.log

# Estado de Servicios
pm2 status
systemctl status nginx postgresql redis
```

## 🔄 Mantenimiento

### Backups
```bash
# Base de Datos
pg_dump -U user dbname > backup-$(date +%Y%m%d).sql

# Redis
redis-cli SAVE
```

### Actualizaciones
```bash
pnpm update
pnpm prisma migrate deploy
pm2 reload ecosystem.config.js
```

## 🔒 Seguridad

### Configuración Básica
- SSL/TLS con Certbot
- Firewall (puertos 80, 443, 22)
- Rate limiting: 100 req/IP/15min

### Headers HTTP
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## 🚨 Manejo de Incidentes

### Niveles de Soporte
1. **Nivel 1**: Operaciones (monitoreo básico)
2. **Nivel 2**: Desarrollo (problemas de aplicación)
3. **Nivel 3**: DevOps (infraestructura/seguridad)

### Contactos
- Guardia: guardia@siprod.uy
- Desarrollo: dev@siprod.uy
- DevOps: devops@siprod.uy

## 🔄 Rollback

### Procedimiento
```bash
# Aplicación
git checkout v1.2.3
pnpm install && pnpm build
pm2 restart all

# Base de Datos
pnpm prisma migrate reset
```