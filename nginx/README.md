# Configuración de Nginx - SIPROD

## Objetivo
Detallar la configuración específica de Nginx para el proyecto SIPROD: reverse proxy, SSL, headers de seguridad y directivas de rendimiento.

## Función
- Explicar la estructura de archivos de configuración (siprod.conf, carpeta ssl/, etc.).
- Indicar cómo configurar la compresión, caching, limitaciones de requests y otros parámetros de Nginx.
- Proveer pasos básicos para la instalación, testing y despliegue de la configuración.

## 📁 Estructura

```nginx
siprod/
└── nginx/
    ├── conf.d/
    │   └── siprod.conf    # Configuración principal
    ├── ssl/               # Certificados SSL
    └── security/          # Headers de seguridad
```

## 🔧 Configuración Principal

### Proxy Inverso
```nginx
upstream frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream backend {
    server 127.0.0.1:4000;
    keepalive 32;
}
```

### Seguridad
```nginx
# SSL
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;

# Headers
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
```

### Optimización
```nginx
# Compresión
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;

# Caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 7d;
    add_header Cache-Control "public, no-transform";
}
```

## 🚀 Instalación

```bash
# 1. Copiar configuración
sudo cp siprod.conf /etc/nginx/conf.d/
sudo nginx -t

# 2. SSL con Certbot
sudo certbot --nginx -d siprod.uy

# 3. Reiniciar servicio
sudo systemctl restart nginx
```

## 📊 Monitoreo

### Logs
```bash
# Access Log
tail -f /var/log/nginx/siprod.access.log

# Error Log
tail -f /var/log/nginx/siprod.error.log
```

## 📝 Mantenimiento

1. Verificar sintaxis antes de aplicar cambios:
   ```bash
   nginx -t
   ```

2. Mantener backups de configuración:
   ```bash
   cp -r /etc/nginx /etc/nginx.backup
   ```

3. Monitorear errores:
   ```bash
   grep -i error /var/log/nginx/error.log
   ```
