# Infraestructura SIPROD

> **Propósito**: Este documento detalla la configuración del servidor, servicios, seguridad y procedimientos operativos del proyecto SIPROD.
>
> **Público Objetivo**: DevOps, SysAdmins y desarrolladores interesados en el entorno productivo.

## Información del Servidor

### Detalles Generales
- **Hostname**: 179-27-203-219.cprapid.com
- **IPv4 Pública**: 179.27.203.219
- **IPv6 Pública**: 2800:a8:a03:40::435
- **Sistema Operativo**: Linux (basado en CentOS/RHEL)
- **Panel de Control**: cPanel/WHM (versión 118.0 build 30)
- **Tipo**: VPS gestionado con cPanel y WHM

## Stack de Software

### Versiones
- **cPanel/WHM**: 11.118.0.30 (build 30)
- **Apache**: 2.4.62
- **MySQL**: 8.0.40
- **PHP**: 8.1.31
- **Node.js**: v18.20.5
- **Docker**: 26.1.3

### Gestores de Paquetes
- npm: 10.9.2
- pnpm: 9.15.0

## Arquitectura Docker

### Contenedores
```yaml
services:
  frontend:
    image: siprod-frontend
    ports: 
      - "8080:3000"
    environment:
      - NODE_ENV=production
      
  backend:
    image: siprod-backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

## Seguridad

### Firewall
- CSF (ConfigServer Security & Firewall) activo
- Puertos expuestos:
  - 80/443: HTTP/HTTPS
  - 8080: Frontend
  - 4000: Backend
  - 5432: PostgreSQL

### SSL/TLS
- Certificados Let's Encrypt
- Renovación automática
- HSTS habilitado

### Backups
- Base de datos: Diario
- Archivos: Semanal
- Retención: 30 días

## Monitoreo

### Métricas
- Prometheus + Grafana
- Alertas configuradas para:
  - CPU > 80%
  - Memoria > 90%
  - Disco > 85%
  - Latencia > 500ms

### Logs
- Centralización con ELK Stack
- Retención: 90 días
- Alertas por errores críticos

## Procedimientos Operativos

### Despliegue
```bash
# Pull últimos cambios
git pull origin main

# Actualizar contenedores
docker-compose pull
docker-compose up -d

# Verificar estado
docker-compose ps
```

### Backup Manual
```bash
# Base de datos
pg_dump -U postgres siprod > backup.sql

# Archivos
tar -czf backup.tar.gz /var/www/siprod
```

### Restauración
```bash
# Base de datos
psql -U postgres siprod < backup.sql

# Archivos
tar -xzf backup.tar.gz -C /var/www/
```

## DNS y Networking

### Configuración DNS
- Proveedor: Cloudflare
- Registros principales:
  - A: 179.27.203.219
  - AAAA: 2800:a8:a03:40::435
  - CNAME: www -> @

### Configuración de Dominio y SSL
- **Dominio Principal**: siprod.uy
- **Panel de Control**: cPanel/WHM
- **SSL**: Incluido con la licencia de cPanel
- **Acceso WHM**:
  - URL: https://siprod.uy/whm
  - Usuario: root
- **Acceso cPanel**:
  - URL: https://siprod.uy/cpanel
  - Usuario: siprod

### Puertos y Servicios
- Frontend (Next.js): Puerto 3000
- Backend (NestJS): Puerto 4000
- Base de datos (PostgreSQL): Puerto 5432

### Proxy y Redirección
- Configuración mediante cPanel Proxy Subdomains
- Redirección automática de HTTP a HTTPS
- Gestión de SSL mediante cPanel

## Plan de Recuperación

### Escenarios
1. Caída de servicio
2. Corrupción de datos
3. Compromiso de seguridad

### Pasos por Escenario
1. **Caída de servicio**
   - Verificar logs
   - Reiniciar servicios
   - Escalar si persiste

2. **Corrupción de datos**
   - Detener servicios
   - Restaurar último backup
   - Verificar integridad

3. **Compromiso de seguridad**
   - Aislar sistemas
   - Cambiar credenciales
   - Investigar breach

## Contactos de Emergencia

### Equipo Interno
- DevOps Lead: [pendiente]
- Backend Lead: [pendiente]
- Frontend Lead: [pendiente]

### Proveedores
- Soporte cPanel: [pendiente]
- Soporte VPS: [pendiente]
- Soporte DNS: [pendiente]

## Mantenimiento Programado

### Diario
- Verificar backups
- Revisar logs de error
- Monitorear recursos

### Semanal
- Actualizar certificados SSL
- Limpieza de logs
- Verificar actualizaciones

### Mensual
- Pruebas de restauración
- Revisión de seguridad
- Optimización de BD
