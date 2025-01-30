# Guía de Configuración del Servidor SIPROD

> Última actualización: 29 de Enero 2025

## Índice
1. [Propósito del Documento](#propósito-del-documento)
2. [Resumen de Especificaciones](#resumen-de-especificaciones)
3. [Historial de Cambios y Tareas](#historial-de-cambios-y-tareas)
4. [Configuraciones Realizadas](#configuraciones-realizadas)
5. [Despliegue de SIPROD](#despliegue-de-siprod)
6. [Monitoreo, Logs y Alertas](#monitoreo-logs-y-alertas)
7. [Resumen de Problemas y Soluciones de Conectividad](#resumen-de-problemas-y-soluciones-de-conectividad)
8. [Próximos Pasos](#próximos-pasos)
9. [Acceso al Servidor](#acceso-al-servidor)
10. [Notas Adicionales y Buenas Prácticas](#notas-adicionales-y-buenas-prácticas)
11. [Información de Contacto](#información-de-contacto)

## Propósito del Documento

Este documento describe de manera detallada y cronológica todas las configuraciones, instalaciones y modificaciones realizadas en el nuevo servidor de SIPROD. Sus objetivos son:

- Llevar un historial completo de cambios y configuraciones.
- Documentar los procesos de instalación y configuración para futuras referencias.
- Servir como base para replicar el entorno en caso de contingencia.
- Mantener la coherencia y uniformidad del entorno de desarrollo y producción.

## Resumen de Especificaciones

### Instancia Actual

| Característica | Detalle |
|---------------|---------|
| Estado | Activo |
| Identificador | 679559c74f1d2 |
| IP Pública | 179.27.203.208 |
| Usuario | b6848e2f |
| Contraseña Inicial | 8PyBLDOi4e56999JRzEr |
| SO | Ubuntu Jammy 22.04 LTS |

### Recursos Contratados

| Recurso | Especificación |
|---------|----------------|
| CPU | 2 vCores @ 3.35 GHz |
| RAM | 4 GB |
| Almacenamiento SSD | 50 GB |
| Transferencia Mensual | 100 GB |
| Ancho de Banda | 300 Mbps |
| Backups Automáticos | 5 copias |
| Costo Mensual | USD 25.92 |
| Fecha de Última Actualización | 29 de Enero 2025 |

## Historial de Cambios y Tareas

### Tareas en Curso

| Tarea | Estado | Creado |
|-------|---------|--------|
| Scheduled Backups | Waiting | 2025-01-27 04:57:06 |

### Tareas Completadas

#### Compra y Configuración Inicial

- Adquisición del VPS.
- Generación y configuración de llave SSH.
- Verificación de especificaciones del servidor.
- Conexión Inicial

#### Actualización del Sistema

- Actualización completa del sistema operativo.
- Actualización a kernel 5.15.0-130-generic.
- Reinicio del servidor exitoso.

#### Configuración del Firewall (UFW)

- Instalación y activación de UFW.
- Puertos habilitados: 22 (SSH), 80 (HTTP), 443 (HTTPS).

#### Configuración de Nginx

- Instalado y configurado como servidor web.
- Configurado como proxy inverso para SIPROD (aún pendiente optimizar).
- Pruebas de conectividad locales exitosas.

#### Configuración de Nginx y Puertos

- Configuración de proxy inverso para Next.js (puerto 3000) y API Express (puerto 4000)
- Desactivación temporal de redirección HTTP a HTTPS
- Apertura de puertos 3000 y 4000 en UFW
- Verificación y reinicio de servicios Nginx

Configuración del proxy inverso en Nginx:
```nginx
# Configuración para Next.js (Frontend)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Configuración para Express API
location /api {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Configuración adicional de UFW:
```bash
sudo ufw allow 3000
sudo ufw allow 4000
sudo ufw status
```

#### Instalación de Certbot (SSL)

- certbot y python3-certbot-nginx instalados.
- Pendiente la generación de certificados (requiere dominio).

#### Entorno Node.js

- Instalación de Node.js versión 18.20.6.
- Instalación de NPM versión 10.8.2 y pnpm versión 9.15.4.
- Falta configurar variables de entorno y verificación final.

#### Instalación de PostgreSQL

- PostgreSQL 14 instalado.
- Base de datos SIPROD creada.
- Usuario configurado y autenticación actualizada a md5.
- Conexiones locales y remotas probadas con éxito.

### Tareas Pendientes

- Optimización de Configuración de Nginx
- Generación de Certificados SSL (requiere dominio)
- Configuración de variables de entorno en Node.js
- Implementación de Backups Automáticos en PostgreSQL
- Despliegue y pruebas finales de SIPROD
- Instalación de herramientas de monitoreo (htop, logrotate, alertas, etc.)

## Configuraciones Realizadas

### Firewall y Puertos

UFW instalado y habilitado:
```bash
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Estado Actual:
```bash
sudo ufw status
```

Muestra puertos 22, 80 y 443 abiertos.

Firewall del Proveedor (panel de administración):
Reglas configuradas para permitir tráfico entrante (Inbound) en puertos 22, 80, 443.

### Nginx

Instalación:
```bash
sudo apt update
sudo apt install nginx -y
```

Configuración Inicial:
Ajuste de archivos en /etc/nginx/sites-available/ y sites-enabled/.
Prueba local: curl -I http://localhost (código 200 OK).

Proxy Inverso para SIPROD:
Pendiente la fase de despliegue de la aplicación para afinar la configuración.

### Certificados SSL

Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

Emisión de Certificado:
Let's Encrypt no emite certificados para IP pública; se requiere un dominio.
Comando aproximado al tener dominio:
```bash
sudo certbot --nginx -d tudominio.com
```

Renovación Automática:
Certbot crea una tarea en /etc/cron.d/ para renovación; se validará una vez se tenga certificado instalado.

### Entorno Node.js

Versiones Instaladas:
Node.js: 18.20.6
NPM: 10.8.2
pnpm: 9.15.4 (instalado globalmente)

Pendiente:
Configuración de variables de entorno (por ejemplo, .env o variables globales).
Integración con PM2 u otra herramienta de orquestación de procesos.

### Base de Datos PostgreSQL

Instalación:
```bash
sudo apt install postgresql postgresql-contrib -y
```

Configuración Inicial:
Codificación UTF-8, autenticación md5.
Edición de pg_hba.conf para permitir conexiones locales y remotas con usuario y contraseña.
Creación de la Base de Datos:
```sql
CREATE DATABASE siprod;
```

Usuario y Contraseña (ejemplo):
```sql
ALTER USER postgres WITH PASSWORD 'Mario7654321+';
```

Verificación:
```bash
psql -U postgres -d siprod -W
```

Conexión exitosa.

## Despliegue de SIPROD

Transferencia de Archivos
Subir el código de SIPROD (repositorio o empaquetado) al servidor.

Instalación de Dependencias
Usar npm install o pnpm install dentro del directorio del proyecto.

Configuración de Variables de Entorno
Variables para la conexión a PostgreSQL, credenciales, etc.

Pruebas de Funcionamiento
Ejecutar la aplicación con Node.js o PM2 y verificar conectividad.

Integración con Nginx
Ajustar server_name en la configuración Nginx si se utiliza un dominio.
Configurar proxy inverso para redirigir tráfico HTTP/HTTPS al puerto de la aplicación Node.js.

## Monitoreo, Logs y Alertas

Herramientas de Monitoreo
htop, glances, nmon, etc. para ver uso de CPU/RAM en tiempo real.

Logs y Logrotate
Ajustar /etc/logrotate.d/ para girar los logs de Nginx, PostgreSQL y la aplicación.

Alertas y Notificaciones
Configurar alertas (ejemplo: sendmail, Slack, Telegram) para eventos críticos.

Sistema de Backups
Configuración pendiente de backups automáticos para la base de datos PostgreSQL.

## Resumen de Problemas y Soluciones de Conectividad

### 1. Configuración de Nginx y Puertos

#### Eliminación de Sitios Duplicados
- Verificado `/etc/nginx/sites-enabled/` - solo existe `siprod.conf`
- Confirmado bloque único `server { listen 80; server_name 179.27.203.208; }`
- Validación exitosa con `nginx -t` y reload del servicio

#### Liberación de Puertos Node.js
- Resuelto conflicto de puertos (Next.js saltaba de 3000 a 3002)
- Terminados procesos previos en puertos 3000/3001
- Servicios corriendo en puertos correctos:
  - Next.js: puerto 3000
  - Express API: puerto 4000

### 2. Verificación de Conectividad

#### Pruebas Internas
```bash
# Verificación de servicios locales
curl -I http://localhost:3000  # Next.js Frontend
curl -I http://localhost:4000  # Express API
```

#### Estado de Firewalls
- **UFW (Local)**:
  - Puertos abiertos: 22, 80, 443, 3000, 4000
  - Estado verificado con `sudo ufw status`

- **Firewall del Proveedor**:
  - Regla "Inbound IPv4 TCP 80" activa
  - IP 179.27.203.208 accesible en puerto 80

### 3. Resolución de Problemas

#### Redirección HTTPS
**Problema**: Navegadores forzando HTTPS automáticamente
**Solución**: 
- Acceso en modo incógnito
- Deshabilitación manual de redirección HTTPS
- Confirmado acceso HTTP exitoso a:
  - `http://179.27.203.208`
  - `http://179.27.203.208/api`

#### Pruebas de Acceso Exitosas
- **API**: 
```json
{
    "message": "SIPROD API",
    "version": "0.0.0",
    "environment": "development"
}
```
- **Frontend**: 
  - Accesible (error interno de React/Next.js pendiente de resolver)
  - No relacionado con configuración de servidor/firewall

### 4. Estado Actual de Servicios

#### Nginx
```nginx
# Configuración actual en /etc/nginx/sites-enabled/siprod.conf
server {
    listen 80;
    server_name 179.27.203.208;

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

#### Servicios Node.js
- **Next.js Frontend**:
  - Puerto: 3000
  - Estado: Corriendo
  - Pendiente: Resolver error de AuthProvider

- **Express API**:
  - Puerto: 4000
  - Estado: Corriendo y respondiendo correctamente
  - Verificado: Endpoint de health check

## Configuración de Dominio y DNS

### Registros DNS
- Dominio: `siprod.uy`
- IP: `179.27.203.208`
- Registros actualizados en cPanel
  - Registro A: Apuntando a nueva IP
  - Registros MX y CNAME: Corregidos
  - Eliminados registros duplicados

### Verificaciones DNS
```bash
# Pruebas de resolución
nslookup siprod.uy          # → Resuelve a 179.27.203.208
ping siprod.uy             # → Confirma tráfico a IP correcta
```
- Verificación en múltiples ubicaciones globales
- Pruebas en diferentes navegadores y herramientas

## Configuración de Nginx Actualizada

### Configuración HTTPS
```nginx
# /etc/nginx/sites-available/siprod.uy
server {
    listen 80;
    listen [::]:80;
    server_name siprod.uy www.siprod.uy;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name siprod.uy www.siprod.uy;

    ssl_certificate /etc/nginx/ssl/siprod.uy.crt;
    ssl_certificate_key /etc/nginx/ssl/siprod.uy.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Configuración moderna de SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (uncomment if you're sure)
    # add_header Strict-Transport-Security "max-age=63072000" always;

    # Configuración de proxy para Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Configuración de timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Configuración de proxy para API Express
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Configuración de timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optimización de archivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
```

### Verificación de SSL
```bash
# Verificar configuración de Nginx
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar estado del certificado
openssl s_client -connect siprod.uy:443 -servername siprod.uy
```

### Headers de Seguridad
Se han añadido los siguientes headers de seguridad en la configuración de Nginx:

```nginx
# Headers de seguridad (añadir dentro del bloque server)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Monitoreo de SSL
- Certificado válido hasta: 11/03/2025
- Emisor: R11
- Dominios cubiertos: 
  - siprod.uy
  - www.siprod.uy

### Tareas de Mantenimiento SSL
- [ ] Configurar recordatorio de renovación (60 días antes)
- [ ] Implementar monitoreo de expiración
- [ ] Documentar proceso de renovación
- [ ] Configurar renovación automática

## Pruebas de Funcionamiento

### Pruebas de Red
- Resolución DNS (`nslookup`, `ping`)
- Conectividad (`curl`, `traceroute`)
- Limpieza de caché
  - Windows: `ipconfig /flushdns`
  - Linux: `systemd-resolve --flush-caches`

### Pruebas en Navegador
- Recarga forzada (Ctrl + Shift + R)
- Pruebas en modo incógnito
- Verificación en múltiples dispositivos

## Estado Actual y Próximos Pasos

### Configuraciones Completadas
- Actualización de registros DNS
- Verificación de resolución de dominio
- Pruebas de conectividad
- Configuración de proxy inverso
- Validación de certificado SSL

### Tareas Pendientes
- Optimización de Nginx para HTTPS
- Verificación de renovación de certificados SSL
- Monitoreo de rendimiento Next.js
- Configuración de PM2
- Optimización de tiempos de carga

### Recomendaciones
1. **Monitoreo Continuo**
   - Seguimiento de propagación DNS (24h)
   - Verificación de caché en proveedores
   - Monitoreo de logs de aplicación

2. **Optimizaciones**
   - Implementar compresión gzip
   - Configurar caché de archivos estáticos
   - Ajustar timeouts de proxy

3. **Seguridad**
   - Implementar headers de seguridad
   - Configurar rate limiting
   - Revisar políticas CORS

## Próximos Pasos

### 1. Optimización de Aplicación
- [ ] Resolver error de AuthProvider en frontend
- [ ] Implementar manejo de errores en React
- [ ] Verificar estado de sesiones y autenticación

### 2. Monitoreo
- [ ] Implementar logging detallado para Next.js
- [ ] Configurar monitoreo de endpoints de API
- [ ] Establecer alertas para caídas de servicio

### 3. Seguridad
- [ ] Revisar headers de seguridad en Nginx
- [ ] Implementar rate limiting
- [ ] Configurar CORS apropiadamente

## Notas Adicionales y Buenas Prácticas

### Configuración de Nginx
- Evitar configuraciones duplicadas de `server_name`
- Mantener desactivada la redirección HTTPS hasta tener certificados
- Verificar logs de error en `/var/log/nginx/error.log`
- Usar `nginx -t` antes de reiniciar el servicio

### Gestión de Servicios
- Implementar sistema de gestión de procesos (PM2)
- Configurar reinicio automático de servicios
- Mantener logs separados para cada aplicación
- Monitorear uso de recursos por servicio

## Acceso al Servidor

Para acceder al servidor vía SSH:

```bash
ssh -i ~/.ssh/id_rsa_siprod ubuntu@179.27.203.208
```

Clave Pública:
Ubicada en tu sistema local, por ejemplo:

```bash
Get-Content C:\Users\59898\.ssh\id_rsa_siprod.pub
```

Recuerda: La contraseña inicial del usuario b6848e2f es 8PyBLDOi4e56999JRzEr.
Una vez configurado SSH, se recomienda deshabilitar el acceso por contraseña.

## Información de Contacto

Administrador del Sistema: (Pendiente de asignar)
Correo de Contacto: (Pendiente de asignar)
Teléfono de Emergencia: (Pendiente de asignar)

Última actualización: 29 de Enero 2025

Cierre
Este documento centraliza toda la información clave para la configuración, despliegue y mantenimiento del servidor SIPROD. Mantenerlo actualizado facilitará futuras intervenciones, migraciones y la resolución de problemas de manera efectiva.

## Configuración de SSL y HTTPS

### Instalación de Certificados Let's Encrypt
```bash
# Instalación de Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generación de certificados
sudo certbot --nginx -d siprod.uy -d www.siprod.uy
```

### Detalles del Certificado
- **Ubicación**: 
  - Certificado: `/etc/letsencrypt/live/siprod.uy/fullchain.pem`
  - Clave privada: `/etc/letsencrypt/live/siprod.uy/privkey.pem`
- **Validez**: Hasta 30 de Abril de 2025
- **Dominios**: siprod.uy, www.siprod.uy
- **Renovación**: Configurada automáticamente

### Configuración Nginx con SSL
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name siprod.uy www.siprod.uy;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name siprod.uy www.siprod.uy;

    ssl_certificate /etc/letsencrypt/live/siprod.uy/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siprod.uy/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Gestión de Procesos con PM2

### Instalación y Configuración
```bash
# Instalación global de PM2
sudo npm install -g pm2

# Inicialización de servicios
pm2 start /var/www/siprod/apps/api/dist/index.js --name siprod-api
pm2 start "pnpm start" --name siprod-web --cwd /var/www/siprod/apps/web

# Persistencia de configuración
pm2 save

# Configuración de inicio automático
pm2 startup
```

### Estado Actual de Servicios
- **API**: Corriendo en puerto 4000
- **Frontend**: Corriendo en puerto 3000
- **Monitoreo**: `pm2 list`, `pm2 logs`

## Despliegue y Compilación

### Instalación de Dependencias
```bash
pnpm install
pnpm build
```

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL="/api"
# Otras variables según necesidad
```

### Errores Detectados y Soluciones

#### 1. Errores de React
- ❌ Uso incorrecto de `<Html>` fuera de `_document.tsx`
- ❌ Error con `useContext` en `AuthContext` y `PageTitleContext`
- ❌ Variables de entorno mal configuradas

#### 2. Plan de Corrección
- [ ] Mover componente `<Html>` a `_document.tsx`
- [ ] Verificar Providers en `layout.tsx`
- [ ] Revisar implementación de contextos
- [ ] Validar configuración de variables de entorno

## Monitoreo y Mantenimiento

### Comandos de Monitoreo
```bash
# Estado de procesos
pm2 list

# Logs en tiempo real
pm2 logs

# Monitoreo de recursos
pm2 monit
```

### Verificaciones de Salud
- [ ] Pruebas de carga en endpoints críticos
- [ ] Monitoreo de uso de memoria
- [ ] Revisión de logs de error
- [ ] Verificación de certificados SSL

## Próximos Pasos

### 1. Correcciones de React
- [ ] Resolver errores de contexto
- [ ] Implementar correcciones de componentes
- [ ] Validar funcionamiento de autenticación

### 2. Optimización
- [ ] Implementar caché en Next.js
- [ ] Optimizar builds de producción
- [ ] Configurar compresión de assets

### 3. Monitoreo
- [ ] Configurar alertas en PM2
- [ ] Implementar logging estructurado
- [ ] Establecer métricas de rendimiento