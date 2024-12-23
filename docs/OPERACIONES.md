# Operaciones SIPROD

## Infraestructura

### Servidor Principal
- **Hosting**: Servidor VPS Dedicado
- **Proveedor**: cPanel Rapid
- **Ubicación**: Data Center Regional
- **IP**: 179.27.203.219

### Especificaciones
- **CPU**: 2 vCPUs @ 3.35 GHz
- **RAM**: 8 GB
- **Almacenamiento**: 100 GB SSD
- **OS**: AlmaLinux 8.10

## Componentes del Sistema

### Servidor Web (Nginx)
```nginx
# Configuración optimizada
gzip on;
gzip_types text/plain text/css application/json application/javascript;
client_max_body_size 50M;
keepalive_timeout 65;
```

### Base de Datos
- **Motor**: PostgreSQL 14
- **Backup**: Diario automático
- **Monitoreo**: Métricas personalizadas

### Correo
- **SMTP**: Exim
- **IMAP/POP3**: Dovecot
- **Seguridad**: Anti-spam y anti-virus

## Seguridad

### Certificados SSL
- **Proveedor**: Let's Encrypt
- **Dominios**: *.siprod.uy
- **Renovación**: Automática
- **Validez**: Hasta 03/11/2025

### Firewall y Protección
- CSF (ConfigServer)
- ModSecurity WAF
- Rate limiting
- IP whitelisting

### Backups
- **Frecuencia**: Diaria
- **Retención**: 30 días
- **Tipo**: Full + Incremental
- **Almacenamiento**: Offsite

## Monitoreo

### Sistemas
- CPU, RAM, Disco
- Servicios críticos
- Logs centralizados
- Alertas configuradas

### Aplicación
- Métricas de rendimiento
- Errores y excepciones
- Tiempos de respuesta
- Uso de caché

## DNS y Dominios

### Configuración
- **Principal**: siprod.uy
- **Subdominios**:
  - www.siprod.uy
  - api.siprod.uy
  - admin.siprod.uy

### Email
- SPF configurado
- DKIM activo
- DMARC implementado

## Despliegue

### Preparación del Servidor

1. Requisitos del sistema:
   - Node.js 18 o superior
   - pnpm 8 o superior
   - PostgreSQL 15 o superior
   - Redis (opcional)
   - PM2 (instalación global)
   - Nginx

2. Instalación de PM2:
   ```bash
   npm install -g pm2
   ```

3. Configuración de Nginx:
   ```nginx
   server {
       listen 80;
       server_name siprod.example.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Proceso de Despliegue

1. Clonar el repositorio:
   ```bash
   git clone <repositorio>
   cd SIPROD
   ```

2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.production
   # Editar .env.production con valores de producción
   ```

4. Construir la aplicación:
   ```bash
   pnpm build
   ```

5. Iniciar con PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

6. Configurar inicio automático:
   ```bash
   pm2 startup
   pm2 save
   ```

## Gestión de Procesos con PM2

### Configuración Local
El proyecto utiliza PM2 para gestionar los procesos en desarrollo local. La configuración se encuentra en `ecosystem.local.config.js`:

```javascript
// Frontend
{
  name: "siprod-frontend-dev",
  script: "node_modules/next/dist/bin/next",
  args: "dev",
  cwd: "./apps/web",
  env: {
    NODE_ENV: "development",
    PORT: 3000,
    NEXT_PUBLIC_API_URL: "http://localhost:4000/api"
  }
}

// Backend
{
  name: "siprod-backend-dev",
  script: "dist/index.js",
  cwd: "./apps/api",
  watch: true,
  env: {
    NODE_ENV: "development",
    PORT: 4000,
    DATABASE_URL: "postgresql://...",
    CORS_ORIGIN: "http://localhost:3000"
  }
}
```

### Comandos Básicos de PM2

```bash
# Iniciar servicios
pm2 start ecosystem.local.config.js

# Ver logs
pm2 logs [--lines 100]

# Estado de servicios
pm2 status

# Reiniciar servicios
pm2 restart all

# Detener servicios
pm2 stop all

# Eliminar servicios
pm2 delete all
```

### Monitoreo de Servicios

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/health

## Monitoreo

### PM2

1. Ver estado de los procesos:
   ```bash
   pm2 list
   ```

2. Monitoreo en tiempo real:
   ```bash
   pm2 monit
   ```

3. Ver logs:
   ```bash
   pm2 logs
   ```

4. Reiniciar procesos:
   ```bash
   pm2 restart all  # Todos los procesos
   pm2 restart web  # Solo frontend
   pm2 restart api  # Solo backend
   ```

### Logs

- Logs de aplicación: `~/.pm2/logs/`
- Logs de Nginx: `/var/log/nginx/`
- Logs de PostgreSQL: `/var/log/postgresql/`

## Backups

### Base de Datos

1. Backup manual:
   ```bash
   pg_dump -U postgres siprod > backup.sql
   ```

2. Backup automático (crontab):
   ```bash
   0 2 * * * pg_dump -U postgres siprod > /backups/siprod_$(date +\%Y\%m\%d).sql
   ```

## Mantenimiento

### Actualizaciones

1. Actualizar código:
   ```bash
   git pull origin main
   pnpm install
   pnpm build
   pm2 restart all
   ```

2. Actualizar dependencias:
   ```bash
   pnpm update
   ```

### Limpieza

1. Logs antiguos:
   ```bash
   pm2 flush  # Limpiar logs de PM2
   ```

2. Backups antiguos:
   ```bash
   find /backups/ -name "siprod_*.sql" -mtime +30 -delete
   ```

## Resolución de Problemas

### Comandos Útiles

1. Verificar estado de servicios:
   ```bash
   pm2 list
   systemctl status postgresql
   systemctl status nginx
   ```

2. Reiniciar servicios:
   ```bash
   pm2 restart all
   systemctl restart postgresql
   systemctl restart nginx
   ```

### Problemas Comunes

1. Error de conexión a la base de datos:
   - Verificar PostgreSQL: `systemctl status postgresql`
   - Verificar variables de entorno
   - Verificar permisos de usuario

2. Error 502 Bad Gateway:
   - Verificar que los servicios están corriendo: `pm2 list`
   - Verificar logs de Nginx
   - Verificar configuración de proxy

3. Problemas de memoria:
   - Verificar uso de recursos: `pm2 monit`
   - Ajustar límites en ecosystem.config.js
   - Considerar escalado horizontal

## Contactos

### Soporte
- **Nivel 1**: equipo@siprod.uy
- **Nivel 2**: admin@siprod.uy
- **Emergencias**: +598 99 123 456

### Proveedores
- **Hosting**: soporte@cpanel.net
- **DNS**: admin@nic.uy
- **SSL**: support@letsencrypt.org
