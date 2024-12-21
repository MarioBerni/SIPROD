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

### Proceso
1. Build en CI
2. Tests automáticos
3. Backup pre-deploy
4. Deploy gradual
5. Verificación
6. Rollback si necesario

### Scripts
```bash
# Build y deploy
pnpm build
pnpm deploy:prod

# Rollback
pnpm deploy:rollback

# Verificación
pnpm verify:deployment
```

## Mantenimiento

### Actualizaciones
- SO: Trimestral
- Dependencias: Mensual
- Seguridad: Inmediata
- Aplicación: Según sprint

### Limpieza
- Logs: Rotación semanal
- Backups: Purga >30 días
- Caché: Limpieza automática
- Temporales: Limpieza diaria

## Recuperación

### Disaster Recovery
1. Backup verification
2. System restore
3. Data recovery
4. Service verification
5. DNS update if needed

### Contingencia
- Servidor backup listo
- DNS failover configurado
- Procedimientos documentados
- Equipo capacitado

## Optimización

### Performance
- CDN para estáticos
- Caché en múltiples niveles
- Compresión habilitada
- DB indexing optimizado

### Recursos
- Auto-scaling configurado
- Load balancing preparado
- Monitoreo predictivo
- Alertas tempranas

## Contactos

### Soporte
- **Nivel 1**: equipo@siprod.uy
- **Nivel 2**: admin@siprod.uy
- **Emergencias**: +598 99 123 456

### Proveedores
- **Hosting**: soporte@cpanel.net
- **DNS**: admin@nic.uy
- **SSL**: support@letsencrypt.org
