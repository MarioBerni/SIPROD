# Guía de Operaciones

## Índice
1. [Infraestructura](#infraestructura)
2. [Despliegue](#despliegue)
3. [Monitoreo](#monitoreo)
4. [Mantenimiento](#mantenimiento)
5. [Backups](#backups)
6. [Seguridad](#seguridad)
7. [Resolución de Problemas](#resolución-de-problemas)

## Infraestructura

### Arquitectura del Sistema
```
[Cliente] → [Nginx] → [PM2/Node.js] → [PostgreSQL/Redis]
```

### Componentes Principales
- **Frontend**: Next.js 14 (SSR)
- **Backend**: Express/Node.js
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis (opcional)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

### Requisitos de Sistema
- CPU: 4 cores mínimo
- RAM: 8GB mínimo
- Almacenamiento: 50GB SSD
- OS: Ubuntu 22.04 LTS

## Despliegue

### Preparación del Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y curl git build-essential

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar PNPM
sudo npm install -g pnpm@8
```

### Configuración de Nginx
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

### Despliegue con PM2

1. **Configuración de Producción**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'siprod-frontend',
      script: 'apps/web/.next/standalone/server.js',
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      instances: 'max',
      exec_mode: 'cluster'
    },
    {
      name: 'siprod-backend',
      script: 'apps/api/dist/index.js',
      env_production: {
        PORT: 4000,
        NODE_ENV: 'production'
      },
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
};
```

2. **Script de Despliegue**
```bash
#!/bin/bash

# Actualizar código
git pull origin main

# Instalar dependencias
pnpm install

# Construir aplicaciones
pnpm build

# Reiniciar servicios
pm2 reload ecosystem.config.js --env production

# Guardar configuración PM2
pm2 save
```

3. **Comandos de Despliegue**
```bash
# Primer despliegue
pm2 start ecosystem.config.js --env production

# Actualizaciones posteriores
pm2 reload ecosystem.config.js --env production

# Ver estado
pm2 status

# Ver logs
pm2 logs
```

## Estado del Sistema

### Endpoints Principales
- Frontend: http://localhost:3000 (desarrollo) | http://179.27.203.219 (producción)
- Backend API: http://localhost:4000/api (desarrollo) | http://179.27.203.219/api (producción)
- Health Check: http://localhost:4000/api/health (desarrollo) | http://179.27.203.219/api/health (producción)

### Verificación del Sistema
Para verificar que el sistema está funcionando correctamente:

1. **Health Check**
   ```
   GET /api/health
   ```
   Respuesta esperada:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-12-26T17:34:36.912Z",
     "environment": "development",
     "version": "0.0.0",
     "uptime": 176.6739865
   }
   ```

2. **API Status**
   ```
   GET /api
   ```
   Respuesta esperada:
   ```json
   {
     "message": "SIPROD API",
     "version": "0.0.0",
     "environment": "development",
     "timestamp": "2024-12-26T17:32:09.130Z"
   }
   ```

## Monitoreo

### PM2 Monitoring
```bash
# Ver dashboard
pm2 monit

# Ver métricas
pm2 plus
```

### Logs
```bash
# Ver todos los logs
pm2 logs

# Ver logs específicos
pm2 logs siprod-frontend
pm2 logs siprod-backend

# Ver logs con timestamp
pm2 logs --timestamp

# Limpiar logs
pm2 flush
```

### Métricas de Sistema
- CPU Usage
- Memory Usage
- Network I/O
- Disk Usage
- Response Times
- Error Rates

## Mantenimiento

### Tareas Diarias
- Verificar logs por errores
- Monitorear uso de recursos
- Revisar métricas de rendimiento

### Tareas Semanales
- Actualizar dependencias no críticas
- Backup de base de datos
- Limpieza de logs antiguos

### Tareas Mensuales
- Actualizar sistema operativo
- Revisar certificados SSL
- Análisis de seguridad
- Optimización de base de datos

### Base de Datos
- Sistema: PostgreSQL 15+
- Base de datos: siprod
- Puerto: 5432
- Backup diario recomendado

### Monitoreo
- Logs del sistema disponibles en la consola de desarrollo
- Monitoreo de endpoints de salud cada 5 minutos
- Alertas configuradas para:
  - Tiempo de respuesta > 2000ms
  - Error rate > 1%
  - Uso de CPU > 80%
  - Uso de memoria > 80%

## Backups

### Base de Datos
```bash
# Backup manual
pg_dump -U usuario -d siprod > backup.sql

# Backup automático (cron)
0 0 * * * pg_dump -U usuario -d siprod > /backups/siprod_$(date +\%Y\%m\%d).sql
```

### Archivos
```bash
# Backup de archivos
tar -czf /backups/siprod_files_$(date +%Y%m%d).tar.gz /path/to/siprod
```

### Restauración
```bash
# Restaurar base de datos
psql -U usuario -d siprod < backup.sql

# Restaurar archivos
tar -xzf backup_files.tar.gz -C /path/to/restore
```

## Seguridad

### Firewall (UFW)
```bash
# Habilitar UFW
sudo ufw enable

# Configurar reglas
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

### SSL/TLS
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d siprod.example.com
```

### Actualizaciones de Seguridad
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Actualizar dependencias Node.js
pnpm audit fix
```

## Resolución de Problemas

### Problemas Comunes

1. **Servicio no Inicia**
```bash
# Verificar logs
pm2 logs

# Verificar estado
pm2 status

# Reiniciar servicio
pm2 restart service-name
```

2. **Alto Uso de CPU/Memoria**
```bash
# Monitorear recursos
pm2 monit

# Reiniciar en caso necesario
pm2 reload all
```

3. **Errores de Base de Datos**
```bash
# Verificar conexión
psql -U usuario -d siprod -c '\l'

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Comandos Útiles
```bash
# Reiniciar todos los servicios
pm2 reload all

# Limpiar cache de Node.js
pm2 flush
pm2 reset all

# Ver detalles de un proceso
pm2 show service-name

# Rotar logs
pm2 logrotate -u user
```

## Referencias
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
