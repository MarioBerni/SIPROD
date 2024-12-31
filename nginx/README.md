# 🛠️ Configuración de Nginx - SIPROD

Este directorio contiene la configuración de Nginx necesaria para el despliegue de SIPROD.

## 📁 Estructura

- `siprod.conf`: Configuración del sitio SIPROD
  - Redirección HTTP a HTTPS
  - Configuración SSL/TLS
  - Proxy inverso para Frontend y API
  - Headers de seguridad

## 🚀 Instalación

1. **Copiar configuración**
```bash
sudo cp nginx/siprod.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl restart nginx
```

2. **Verificar instalación**
```bash
# Estado del servicio
sudo systemctl status nginx

# Verificar puertos
sudo netstat -tulpn | grep -E ':80|:443|:3000|:4000'
```

## 📊 Monitoreo

### Logs
```bash
# Logs de acceso
tail -f /var/log/nginx/siprod.access.log

# Logs de error
tail -f /var/log/nginx/siprod.error.log
```

### Pruebas
1. **Redirección HTTP a HTTPS**
```bash
curl -I http://siprod.uy
# Debería mostrar: HTTP/1.1 301 Moved Permanently
```

2. **Certificado SSL**
```bash
curl -vI https://siprod.uy
# Verificar certificado SSL y headers
```

3. **API**
```bash
curl -I https://siprod.uy/api/health
# Debería retornar HTTP/1.1 200 OK
```

## 🔧 Mantenimiento

### Comandos Útiles
```bash
# Recargar configuración
sudo nginx -s reload

# Verificar sintaxis
sudo nginx -t

# Reiniciar servicio
sudo systemctl restart nginx
```

### Solución de Problemas
1. Verificar logs de error
2. Confirmar puertos en uso
3. Validar permisos de archivos
4. Comprobar estado de servicios upstream

## 🔒 Seguridad

### Headers Recomendados
```nginx
# Agregar en siprod.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### Configuración SSL/TLS
```nginx
# Configuración SSL recomendada
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
```

### Renovación Automática de Certificados
```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Configurar renovación automática
sudo certbot --nginx -d siprod.uy
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar estado
sudo certbot certificates
```

## 📝 Notas Importantes

1. La configuración global de Nginx (`nginx.conf`) no está incluida en este repositorio ya que es específica del sistema.
2. Los certificados SSL deben estar ubicados en `/var/cpanel/ssl/apache_tls/siprod.uy/`.
3. Asegúrese de que los servicios de frontend y backend estén corriendo en los puertos 3000 y 4000 respectivamente.

## 🔍 Troubleshooting

Si encuentra errores, verifique:
1. Los logs de error: `/var/log/nginx/siprod.error.log`
2. La sintaxis de la configuración: `sudo nginx -t`
3. El estado de los servicios: `systemctl status nginx`
4. Los puertos en uso: `netstat -tulpn | grep -E ':80|:443|:3000|:4000'`
