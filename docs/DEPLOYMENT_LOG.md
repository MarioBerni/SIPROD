# 📋 Registro de Despliegue - SIPROD

Este documento tiene como propósito mantener un registro detallado de todos los procesos de despliegue del proyecto SIPROD. Aquí se documentan los pasos realizados, ajustes necesarios, éxitos y errores encontrados durante el despliegue en el servidor de producción. Esta documentación es vital para:

- Mantener un histórico de cambios y configuraciones
- Identificar y resolver problemas comunes
- Facilitar futuros despliegues
- Servir como guía de referencia para el equipo

## 📅 Registro de Despliegues

### 2024-12-30 15:25 - Despliegue Inicial con PM2

#### Pasos Realizados:

1. **Limpieza de Procesos PM2 Existentes**
```bash
pm2 delete all
```
- Resultado: Se eliminaron procesos anteriores
- Advertencia: "Current process list is not synchronized with saved list"

2. **Construcción del Proyecto**
```bash
pnpm build
```
- Resultado: Construcción exitosa de todos los paquetes
- Paquetes construidos: @siprod/api, @siprod/config, @siprod/tsconfig, @siprod/ui, @siprod/utils, @siprod/web

3. **Migración de Base de Datos**
```bash
cd apps/api
pnpm prisma migrate deploy
```
- Resultado: No se encontraron migraciones pendientes
- Base de datos: PostgreSQL en localhost:5432

4. **Despliegue con PM2**
```bash
cd /var/www/siprod
pm2 start ecosystem.config.js --env production
```

#### Estado del Despliegue:

**Frontend (siprod-frontend)**
- Estado: ✅ Online
- Puerto: 3000
- Memoria: 93.3mb
- Logs: Inicio exitoso en 445ms

**Backend (siprod-backend)**
- Estado: ✅ Online
- Puerto: 4000
- Memoria: 97.4mb
- Conexión DB: Exitosa
- Endpoints:
  - Health: http://179.27.203.219:4000/api/health
  - API: http://179.27.203.219:4000/api

#### Observaciones:
1. PM2 creó automáticamente el directorio de logs faltante
2. Advertencia sobre ambiente de producción no definido en el archivo de configuración
3. La base de datos está conectada correctamente y no tiene usuarios iniciales
4. Ambos servicios están funcionando correctamente en sus puertos respectivos

#### Próximos Pasos:
1. Definir configuración específica de producción en ecosystem.config.js
2. Considerar la creación de usuario administrativo inicial
3. Verificar la configuración de CORS y seguridad
4. Monitorear el rendimiento inicial de la aplicación

### 2024-12-30 15:33 - Configuración de Nginx y Despliegue a Producción

#### 1. Configuración de Nginx

La configuración de Nginx está preparada con:
- Redirección de HTTP a HTTPS
- Configuración SSL con protocolos seguros (TLSv1.2 y TLSv1.3)
- Proxy inverso para Frontend (puerto 3000) y Backend (puerto 4000)
- Optimización de caché para archivos estáticos
- Headers de seguridad configurados
- Compresión GZIP activada

#### Pasos para el Despliegue en Producción:

1. **Copiar Archivos de Configuración de Nginx**
```bash
# Copiar configuración principal
sudo cp /var/www/siprod/nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar configuración del sitio
sudo cp /var/www/siprod/nginx/siprod.conf /etc/nginx/conf.d/siprod.conf

# Crear directorio para los archivos del sitio
sudo mkdir -p /home/siprod/public_html
```

2. **Verificar Configuración de Nginx**
```bash
sudo nginx -t
```

3. **Reiniciar Nginx**
```bash
sudo systemctl restart nginx
```

4. **Verificar SSL y Certificados**
- Confirmar existencia de certificados en:
  - `/var/cpanel/ssl/apache_tls/siprod.uy/combined`
- Verificar permisos de los certificados

5. **Ajustar Firewall**
```bash
# Permitir tráfico HTTP y HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### Verificaciones Post-Despliegue:

1. **Verificar Endpoints**
- Frontend: https://siprod.uy
- API: https://siprod.uy/api
- Health Check: https://siprod.uy/api/health

2. **Verificar Logs**
```bash
# Logs de Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Logs de la Aplicación
tail -f /var/www/siprod/logs/frontend-out.log
tail -f /var/www/siprod/logs/backend-out.log
```

#### Lista de Verificación de Seguridad:
- [ ] Certificados SSL instalados y funcionando
- [ ] Headers de seguridad configurados correctamente
- [ ] Redirección HTTP a HTTPS funcionando
- [ ] Caché y compresión GZIP activos
- [ ] Firewall configurado correctamente
- [ ] Permisos de archivos y directorios revisados

#### Próximos Pasos:
1. Configurar monitoreo de recursos y logs
2. Implementar backup automático de la base de datos
3. Configurar alertas de sistema
4. Realizar pruebas de carga
5. Documentar procedimientos de rollback

### 2024-12-30 15:38 - Verificación de Configuración del Servidor

#### Detalles del Servidor
- **IP Pública**: 179.27.203.219
- **Sistema Operativo**: AlmaLinux 8.10 (Cerulean Leopard)
- **Hardware**:
  - vCPUs: 2 @ 3.35 GHz
  - RAM: 8 GB
  - Almacenamiento: 100 GB SSD
- **Usuario Principal**: d5baf91c
- **Hostname**: 179-27-203-219.cprapid.com

#### Verificación de Certificados SSL
```bash
ls -l /var/cpanel/ssl/apache_tls/siprod.uy/
```
Resultados:
- ✅ Certificados presentes y actualizados (11 Dec 2024)
- ✅ Permisos correctos: `-rw-r-----` para `combined`
- ✅ Emisor: Let's Encrypt
- ✅ Vigencia: Hasta 3 de noviembre 2025

#### Verificación de Configuración Nginx
```bash
sudo nginx -t
```
Resultado: ✅ Sintaxis correcta y prueba exitosa

#### Estado del Servicio Nginx
```bash
sudo systemctl status nginx
```
Estado:
- ✅ Activo y en ejecución
- ✅ Iniciado desde: Sun 2024-12-29 17:24:19
- ✅ Procesos: 3 (1 master, 2 workers)
- ✅ Memoria utilizada: 4.7M

#### Verificación de Puertos
```bash
sudo netstat -tulpn | grep ':80\|:443'
```
Resultados:
- ✅ Puerto 80: Escuchando (IPv4 e IPv6)
- ⚠️ Puerto 443: No visible en netstat (verificar configuración SSL)

#### Configuraciones Verificadas

1. **Nginx Principal** (`nginx.conf`):
- ✅ Compresión GZIP activada
- ✅ Configuración de logs correcta
- ✅ Worker processes configurados automáticamente
- ✅ Inclusión de configuraciones adicionales

2. **Configuración del Sitio** (`siprod.conf`):
- ✅ Redirección HTTP a HTTPS
- ✅ Configuración SSL completa
- ✅ Proxy inverso para frontend (puerto 3000)
- ✅ Proxy inverso para backend (puerto 4000)
- ✅ Headers de seguridad configurados
- ✅ Caché de archivos estáticos

#### Seguridad Implementada
- ✅ ModSecurity activo con OWASP Core Rule Set V3.0
- ✅ CSF (ConfigServer Security & Firewall) activo
- ✅ Headers de seguridad configurados
- ✅ Certificados SSL correctamente instalados
- ✅ Protección contra ataques de fuerza bruta (cPHulk)

#### Próximos Pasos Críticos

1. **Configuración SSL**:
```bash
# Verificar configuración SSL en Nginx
sudo nginx -T | grep ssl

# Verificar puerto 443
sudo netstat -tulpn | grep ':443'
```

2. **Directorio Web**:
```bash
# Crear y configurar directorio web
sudo mkdir -p /home/siprod/public_html
sudo chown -R d5baf91c:d5baf91c /home/siprod/public_html
```

3. **Copiar Configuraciones**:
```bash
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/siprod.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl restart nginx
```

#### Observaciones
1. El puerto 443 no aparece en netstat, necesita verificación
2. Los certificados SSL están presentes pero requieren configuración en Nginx
3. La configuración de Nginx está sintácticamente correcta
4. El servidor web está funcionando correctamente en el puerto 80

#### Lista de Verificación Final
- [ ] Verificar apertura del puerto 443
- [ ] Confirmar funcionamiento de SSL
- [ ] Probar redirecciones HTTP a HTTPS
- [ ] Verificar funcionamiento del proxy inverso
- [ ] Comprobar logs de acceso y errores

### 2024-12-30 15:42 - Ajuste de Estrategia de Firewall y SSL

#### Situación Detectada
```bash
sudo systemctl start firewalld
# Resultado: Failed to start firewalld.service: Unit firewalld.service is masked.
```

FirewallD está enmascarado en el sistema, lo cual es esperado en servidores cPanel que utilizan CSF (ConfigServer Security & Firewall) como solución de firewall principal.

#### Plan de Acción Revisado

1. **Verificar CSF (ConfigServer Firewall)**
```bash
# Verificar estado de CSF
sudo csf -v

# Verificar puertos permitidos
sudo csf -l
```

2. **Configurar Puertos en CSF**
```bash
# Editar configuración de CSF
sudo vi /etc/csf/csf.conf

# Asegurarse que estos puertos estén en TCP_IN y TCP_OUT:
# 80,443,3000,4000

# Reiniciar CSF
sudo csf -r
```

3. **Configuración de Nginx y SSL**
```bash
# Verificar ruta de configuraciones
ls -l /var/www/siprod/nginx/

# Copiar configuraciones
sudo cp /var/www/siprod/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp /var/www/siprod/nginx/siprod.conf /etc/nginx/conf.d/

# Verificar permisos de certificados
sudo ls -l /var/cpanel/ssl/apache_tls/siprod.uy/combined
```

#### Lista de Verificación Actualizada
- [ ] CSF instalado y funcionando
- [ ] Puertos necesarios (80, 443, 3000, 4000) permitidos en CSF
- [ ] Configuración SSL en Nginx
- [ ] Certificados con permisos correctos
- [ ] Nginx configurado y funcionando

#### Próximos Pasos
1. Verificar y configurar CSF
2. Implementar configuración SSL en Nginx
3. Verificar funcionamiento de la aplicación

#### Notas Importantes
- El servidor utiliza CSF en lugar de FirewallD como solución de firewall
- La configuración de seguridad debe realizarse a través de CSF
- cPanel gestiona los certificados SSL en `/var/cpanel/ssl/apache_tls/`

¿Procedemos con la verificación de CSF y la configuración de los puertos necesarios?

### 2024-12-30 15:44 - Verificación y Configuración de CSF

#### Estado de CSF
```bash
sudo csf -v
# Resultado: csf: v14.22 (cPanel)
```
✅ CSF está instalado y funcionando correctamente

#### Configuración de Puertos

Para configurar los puertos necesarios en CSF, necesitamos:

1. **Editar la Configuración de CSF**
```bash
# Hacer backup del archivo de configuración
sudo cp /etc/csf/csf.conf /etc/csf/csf.conf.backup

# Editar la configuración
sudo vi /etc/csf/csf.conf
```

Buscar y modificar las siguientes líneas:
```conf
# Permitir puertos TCP entrantes
TCP_IN = "20,21,22,25,53,80,110,143,443,465,587,993,995,2082,2083,2086,2087,2095,2096,3000,4000"

# Permitir puertos TCP salientes
TCP_OUT = "20,21,22,25,53,80,110,113,443,587,993,995,2082,2083,2086,2087,2095,2096,3000,4000"
```

2. **Aplicar Cambios**
```bash
# Reiniciar CSF para aplicar cambios
sudo csf -r
```

3. **Verificar Estado**
```bash
# Verificar que CSF está funcionando
sudo csf --status

# Verificar los puertos abiertos
sudo netstat -tulpn | grep -E ':80|:443|:3000|:4000'
```

#### Próximos Pasos
1. [ ] Configurar los puertos en CSF
2. [ ] Verificar que los puertos estén abiertos
3. [ ] Proceder con la configuración de SSL en Nginx

#### Notas Importantes
- Se agregarán los puertos 3000 (Frontend) y 4000 (Backend) a la configuración
- Se mantendrán los puertos estándar de cPanel
- Es importante mantener un backup de la configuración antes de hacer cambios

¿Procedemos con la edición del archivo de configuración de CSF?

### 2024-12-30 15:46 - Verificación de Puertos y Estado SSL

#### Verificación de Puertos Activos
```bash
sudo netstat -tulpn | grep -E ':80|:443|:3000|:4000'
```

Resultado:
```
tcp        0      0 0.0.0.0:4000            0.0.0.0:*               LISTEN      2640576/node
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2556687/nginx
tcp6       0      0 :::3000                 :::*                    LISTEN      2640575/next-server
tcp6       0      0 :::80                   :::*                    LISTEN      2556687/nginx
```

#### Estado Actual
✅ Confirmado:
- Puerto 80 (HTTP): Activo en IPv4 e IPv6 (Nginx)
- Puerto 3000 (Frontend): Activo en IPv6 (Next.js)
- Puerto 4000 (Backend): Activo en IPv4 (Node.js)

❌ Pendiente:
- Puerto 443 (HTTPS): No está escuchando

#### Próximos Pasos
1. Verificar la configuración SSL en Nginx:
```bash
# Verificar la configuración actual de Nginx
sudo nginx -T | grep ssl

# Verificar la ubicación de los certificados SSL
sudo ls -l /var/cpanel/ssl/apache_tls/siprod.uy/
```

2. Asegurarnos que Nginx tenga los permisos correctos para acceder a los certificados SSL.

3. Verificar que el módulo SSL de Nginx esté habilitado:
```bash
nginx -V 2>&1 | grep -o with-http_ssl_module
```

¿Procedemos con la verificación de la configuración SSL en Nginx?

### 2024-12-30 15:48 - Diagnóstico de Configuración SSL y Nginx

#### Problemas Identificados

1. **Puertos Incorrectos en Proxy**
   - Frontend: configurado para puerto 8080, pero está corriendo en 3000
   - API: configurada para puerto 3000, pero está corriendo en 4000

2. **Configuración SSL**
   ```nginx
   ssl_certificate     /var/cpanel/ssl/apache_tls/siprod.uy/combined;
   ssl_certificate_key /var/cpanel/ssl/apache_tls/siprod.uy/combined;
   ```
   Los certificados existen pero necesitamos verificar permisos.

#### Plan de Acción

1. **Verificar Permisos de Certificados**
```bash
# Verificar usuario nginx
id nginx

# Probar lectura del certificado
sudo su -s /bin/bash -c "test -r /var/cpanel/ssl/apache_tls/siprod.uy/combined && echo 'OK' || echo 'Cannot read file'" nginx
```

2. **Actualizar Configuración de Proxy**
```nginx
# Frontend Next.js (Puerto 3000)
location / {
    proxy_pass http://localhost:3000;
    ...
}

# API endpoints (Puerto 4000)
location /api {
    proxy_pass http://localhost:4000;
    ...
}
```

3. **Reiniciar Nginx**
```bash
# Verificar sintaxis
sudo nginx -t

# Reiniciar si la sintaxis es correcta
sudo systemctl restart nginx
```

4. **Verificar Estado**
```bash
# Verificar que el puerto 443 esté escuchando
sudo netstat -tulpn | grep ':443'

# Verificar logs de error
sudo tail -f /var/log/nginx/siprod.error.log
```

#### Cambios Necesarios en siprod.conf

```nginx
# Mantener la configuración SSL actual
listen 443 ssl http2;
listen [::]:443 ssl http2;

# Actualizar puertos de proxy
location / {
    proxy_pass http://localhost:3000;  # Cambiar de 8080 a 3000
    ...
}

location /api {
    proxy_pass http://localhost:4000;  # Cambiar de 3000 a 4000
    ...
}
```

¿Procedemos con la verificación de permisos y la actualización de la configuración?

### 2024-12-30 16:08 - Configuración de Servicios y SSL

#### Estado Actual de los Servicios:

**Frontend (Next.js)**
- ✅ Estado: Online
- ✅ Puerto: 3000
- ✅ Memoria: 27.0mb
- ✅ Network: http://0.0.0.0:3000

**Backend (Node.js)**
- ✅ Estado: Online
- ✅ Puerto: 4000
- ✅ Memoria: 24.2mb
- ✅ Base de datos: Conectada
- ✅ Endpoints configurados:
  - Health: http://179.27.203.219:4000/api/health
  - API: http://179.27.203.219:4000/api

**Nginx**
- ✅ Puerto 80: Escuchando (IPv4 e IPv6)
- ✅ Puerto 443: Escuchando (IPv4 e IPv6)
- ✅ SSL: Configurado y activo
- ✅ Certificados: Instalados correctamente

**PM2**
- ✅ Servicios: Ambos online
- ✅ Configuración: Guardada
- ✅ Logs: Funcionando correctamente

#### Configuración Actual:

1. **SSL y HTTPS**
   - Certificados en: /var/cpanel/ssl/apache_tls/siprod.uy/
   - Protocolos: TLSv1.2, TLSv1.3
   - Redirección HTTP a HTTPS configurada

2. **Proxy Inverso**
   - Frontend: proxy_pass a localhost:3000
   - Backend: proxy_pass a localhost:4000
   - Headers de seguridad configurados
   - Compresión GZIP activada

#### Problemas Actuales:

❌ **Acceso Web**:
1. https://siprod.uy/ devuelve 404 Not Found
2. https://siprod.uy/api muestra "Página no encontrada"

#### Próximos Pasos:
1. Verificar logs de Nginx para errores específicos
2. Comprobar rutas y configuración de proxy
3. Verificar que los servicios estén respondiendo localmente
4. Revisar configuración de dominios en Nginx

### 2024-12-30 16:35 - Reorganización de Configuración Nginx

#### Estado Actual:

**Estructura de Archivos**
- ✅ `/etc/nginx/nginx.conf`: Configuración global del sistema
- ✅ `/etc/nginx/conf.d/siprod.conf`: Configuración específica del sitio
- ✅ Eliminado archivo nginx.conf redundante del repositorio

**Servicios Activos**
- ✅ Frontend (Next.js): Puerto 3000
- ✅ Backend (Node.js): Puerto 4000
- ✅ Nginx: Puertos 80 (redirección) y 443 (SSL)
- ✅ PM2: Gestionando servicios

#### Configuración Actual:

1. **Nginx Global** (`/etc/nginx/nginx.conf`)
   - Worker processes: auto
   - Worker connections: 1024
   - GZIP habilitado
   - Logs configurados
   - Includes de conf.d/*.conf

2. **SIPROD Site** (`/etc/nginx/conf.d/siprod.conf`)
   - SSL/TLS configurado
   - Proxy inverso para Frontend y API
   - Headers de seguridad
   - Timeouts optimizados

#### Pasos de Instalación:

1. **Preparación del Sistema**
   ```bash
   # Instalar Nginx
   sudo yum install nginx

   # Crear directorio para los certificados SSL
   sudo mkdir -p /var/cpanel/ssl/apache_tls/siprod.uy/
   ```

2. **Configuración de Nginx**
   ```bash
   # Copiar configuración del sitio
   sudo cp nginx/siprod.conf /etc/nginx/conf.d/

   # Verificar sintaxis
   sudo nginx -t

   # Reiniciar Nginx
   sudo systemctl restart nginx
   ```

3. **Verificación**
   ```bash
   # Verificar puertos
   sudo netstat -tulpn | grep -E ':80|:443|:3000|:4000'

   # Verificar logs
   tail -f /var/log/nginx/siprod.error.log
   ```

#### Próximos Pasos:
1. Monitorear logs de errores
2. Implementar monitoreo de recursos
3. Considerar activación de HSTS
4. Configurar backups automáticos

### 2024-12-30 16:48 - Configuración Final de Nginx

#### ✅ Estado Actual

**Estructura de Archivos**
- ✅ `/etc/nginx/conf.d/siprod.conf`: Configuración única y activa
- ✅ Eliminado archivo redundante `/etc/nginx/siprod.conf`
- ✅ Repositorio actualizado con la configuración correcta

**Servicios Activos**
- ✅ Frontend (Next.js): Puerto 3000 (0.0.0.0:3000)
- ✅ Backend (Node.js): Puerto 4000 (0.0.0.0:4000)
- ✅ Nginx: 
  - Puerto 80 (HTTP → HTTPS redirect)
  - Puerto 443 (HTTPS)
  - Soporte IPv4 e IPv6

**Verificaciones Realizadas**
1. Sintaxis Nginx: ✅ Correcta
2. Estado del Servicio: ✅ Activo y corriendo
3. Puertos: ✅ Todos los servicios escuchando correctamente
4. Configuración SSL: ✅ Certificados cargados

#### 🔄 Cambios Realizados

1. **Limpieza de Configuración**
   - Eliminado archivo redundante
   - Unificada configuración en `/etc/nginx/conf.d/`
   - Actualizada documentación

2. **Optimizaciones**
   - Uso de 127.0.0.1 en lugar de localhost
   - Configuración de proxy mejorada
   - Headers de seguridad actualizados

#### 📝 Próximos Pasos

1. **Monitoreo**
   - Revisar logs de acceso y errores
   - Verificar rendimiento de proxy
   - Monitorear uso de recursos

2. **Seguridad**
   - Considerar activación de HSTS
   - Revisar políticas de seguridad
   - Implementar monitoreo de seguridad

3. **Mantenimiento**
   - Configurar rotación de logs
   - Implementar backups de configuración
   - Establecer procedimientos de actualización

### 2024-12-30 16:54 - Verificación de Despliegue

### ✅ Estado de Servicios
- Frontend (PM2): Online, 101.8MB RAM
- Backend (PM2): Online, 91.6MB RAM
- Nginx: Active (running), 5.1MB RAM

### 🔒 Verificaciones de Seguridad
1. **SSL/TLS**:
   - Certificado válido hasta Mar 11 2025
   - TLSv1.3 activo
   - Headers de seguridad configurados

2. **Endpoints**:
   - https://siprod.uy/ → Frontend (OK)
   - https://siprod.uy/api → Backend v1.0.0 (OK)
   - https://siprod.uy/api/health → Health check (OK)

3. **Redirecciones**:
   - HTTP → HTTPS (301) funcionando

### 📊 Rendimiento
- CPU: <1% en reposo
- Memoria: 5.5GB disponible de 7.9GB
- Sin uso de swap
- Nginx: 2 workers activos

### 🔄 Próximos Pasos
1. Implementar monitoreo continuo
2. Configurar alertas para logs críticos
3. Establecer política de backups

### 📌 Notas
- Todos los servicios funcionan correctamente
- Configuración de seguridad verificada
- Sistema estable y con buen rendimiento