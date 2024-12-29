# 🚀 Guía de Operaciones y Despliegue

> Este documento detalla los procesos de infraestructura, despliegue, monitoreo y mantenimiento operativo del proyecto SIPROD.

## Infraestructura

### Arquitectura del Sistema
                   [Nginx Reverse Proxy]
                          |
        +----------------+-----------------+
        |                                 |
[Next.js Frontend]               [Node.js Backend]
        |                                 |
[Redis Cache]                    [PostgreSQL DB]

### Componentes
1. **Frontend (Next.js)**
   - SSR y Static Generation
   - Caching con Redis
   - CDN para assets estáticos

2. **Backend (Node.js)**
   - Express API
   - Prisma ORM
   - JWT Authentication

3. **Base de Datos**
   - PostgreSQL
   - Backups automáticos
   - Replicación para alta disponibilidad

4. **Cache**
   - Redis
   - Session storage
   - API caching

## Despliegue

### Preparación
1. Variables de Entorno
   ```bash
   # Frontend (.env.production)
   NEXT_PUBLIC_API_URL=https://api.siprod.uy
   NEXT_PUBLIC_ENV=production

   # Backend (.env.production)
   DATABASE_URL=postgresql://user:pass@host:5432/db
   REDIS_URL=redis://host:6379
   JWT_SECRET=your-secret
   ```

2. Build
   ```bash
   # Root del proyecto
   pnpm build        # Construir todos los paquetes
   pnpm test         # Verificar tests
   ```

### Proceso de Despliegue

1. **Frontend**
   ```bash
   cd apps/web
   pnpm build
   pm2 start ecosystem.config.js --env production
   ```

2. **Backend**
   ```bash
   cd apps/api
   pnpm build
   pnpm prisma migrate deploy
   pm2 start ecosystem.config.js --env production
   ```

3. **Nginx**
   ```nginx
   # /etc/nginx/sites-available/siprod
   server {
     listen 80;
     server_name siprod.uy;
     
     location / {
       proxy_pass http://localhost:3000;
     }
     
     location /api {
       proxy_pass http://localhost:4000;
     }
   }
   ```

### Monitoreo

1. **Logs**
   ```bash
   # Ver logs de PM2
   pm2 logs

   # Ver logs de nginx
   tail -f /var/log/nginx/access.log
   ```

2. **Métricas**
   - Dashboard de PM2
   - Monitoreo de PostgreSQL
   - Redis INFO

## Mantenimiento

### Backups

1. **Base de Datos**
   ```bash
   # Backup diario
   pg_dump -U user dbname > backup-$(date +%Y%m%d).sql

   # Restaurar
   psql -U user dbname < backup.sql
   ```

2. **Redis**
   ```bash
   # Backup de Redis
   redis-cli SAVE
   ```

### Actualizaciones

1. **Sistema**
   ```bash
   # Actualizar dependencias
   pnpm update

   # Actualizar DB
   pnpm prisma migrate deploy
   ```

2. **Zero Downtime**
   ```bash
   pm2 reload ecosystem.config.js
   ```

### Troubleshooting

1. **Verificar Servicios**
   ```bash
   # Estado de servicios
   pm2 status
   systemctl status nginx
   systemctl status postgresql
   systemctl status redis
   ```

2. **Logs Comunes**
   - `/var/log/nginx/error.log`
   - `pm2 logs`
   - Logs de aplicación en `apps/*/logs`

## Seguridad

### SSL/TLS
```bash
# Instalar certificado
certbot --nginx -d siprod.uy
```

### Firewall
```bash
# Configurar ufw
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
```

### Backups
- Backups diarios de DB
- Retención de 30 días
- Almacenamiento externo

## Escalabilidad

### Horizontal
- Load balancer
- Múltiples instancias
- Sesiones en Redis

### Vertical
- Aumentar recursos
- Optimizar queries
- Caching agresivo

## Monitoreo

### Herramientas
- PM2 Monitoring
- PostgreSQL Metrics
- Redis INFO
- Nginx Logs

### Alertas
- CPU > 80%
- Memoria > 90%
- Disco > 85%
- Latencia > 1s

## Recuperación

### Disaster Recovery
1. Restaurar último backup
2. Verificar integridad
3. Actualizar DNS si necesario

### Failover
- Replicación de DB
- Múltiples instancias
- Load balancing

## Operaciones de Autenticación

### Configuración del Entorno

#### Variables de Entorno
```bash
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/siprod"
JWT_SECRET="tu-secreto-seguro"
COOKIE_SECRET="otro-secreto-seguro"
NODE_ENV="production"

# Frontend (.env)
NEXT_PUBLIC_API_URL="http://api.siprod.com"
```

### Seguridad y Sesiones

1. **Configuración de Cookies**
   - Asegurar que el dominio está correctamente configurado
   - Habilitar HTTPS en producción
   - Configurar SameSite y HttpOnly

2. **Manejo de Sesiones**
   - Monitorear tiempos de expiración de tokens
   - Implementar renovación automática de sesiones
   - Mantener registro de sesiones activas

3. **Monitoreo de Seguridad**
   - Registrar intentos fallidos de login
   - Monitorear patrones de acceso sospechosos
   - Mantener logs de actividad de usuarios

### Despliegue

1. **Preparación**
   ```bash
   # Construir aplicaciones
   pnpm build
   
   # Verificar archivos estáticos
   cd apps/web/.next
   ```

2. **Servidor Web (Nginx)**
   ```nginx
   server {
     listen 443 ssl;
     server_name siprod.com;
     
     # SSL
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     
     # Frontend
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
     
     # Backend
     location /api {
       proxy_pass http://localhost:4000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

3. **Base de Datos**
   ```bash
   # Backup
   pg_dump siprod > backup.sql
   
   # Restaurar
   psql siprod < backup.sql
   ```

4. **Monitoreo**
   - Configurar alertas para errores de autenticación
   - Monitorear uso de CPU y memoria
   - Verificar logs de acceso y errores

### Mantenimiento

1. **Backups**
   - Programar backups diarios de la base de datos
   - Mantener historial de sesiones
   - Rotar logs regularmente

2. **Actualizaciones**
   - Actualizar dependencias mensualmente
   - Verificar parches de seguridad
   - Mantener documentación actualizada

3. **Escalabilidad**
   - Monitorear tiempos de respuesta
   - Ajustar recursos según demanda
   - Planificar capacidad futura
