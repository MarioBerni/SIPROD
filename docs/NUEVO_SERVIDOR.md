# Guía de Configuración del Servidor SIPROD

## Propósito del Documento

Este documento sirve como registro maestro y guía detallada de todas las configuraciones, instalaciones y modificaciones realizadas en el nuevo servidor de SIPROD. Su objetivo principal es:

- Mantener un historial completo de cambios y configuraciones del servidor
- Documentar paso a paso los procesos de instalación y configuración
- Servir como referencia para futuras actualizaciones o resolución de problemas
- Facilitar la replicación del entorno en caso de ser necesario
- Proporcionar una guía clara para el equipo de desarrollo y administración

La documentación se mantiene actualizada con cada modificación realizada en el servidor, incluyendo:
- Configuraciones de seguridad
- Instalación de servicios y dependencias
- Gestión de accesos y permisos
- Configuración de firewalls y puertos
- Despliegue de aplicaciones
- Respaldos y procedimientos de recuperación

# Configuración del Servidor SIPROD
Última actualización: 25 de Enero 2025

## Especificaciones del Servidor

- **Sistema Operativo**: Ubuntu Jammy 22.04 LTS
- **Almacenamiento**: 50 GB SSD
- **Transferencia mensual**: 100 GB
- **RAM**: 4 GB
- **CPU**: 2 vCores @ 3.35 GHz
- **Ancho de banda**: 300 Mbps
- **Backups**: 5 copias automáticas
- **Costo mensual**: USD 25.92

## Detalles de la Instancia Actual
- **Estado**: Active
- **Identificador**: 679559c74f1d2
- **IP**: 179.27.203.208
- **Usuario**: b6848e2f
- **Contraseña Inicial**: 8PyBLDOi4e56999JRzEr
- **Sistema Operativo**: Ubuntu Jammy 22.04 LTS
- **Storage SSD**: 50 GB
- **RAM**: 4096 MB
- **vCPUs**: 2 @ 3.35GHz
- **Protect VPS**: Not Protected

## Tareas en Curso
| Tarea | Estado | Creado |
|-------|---------|---------|
| Scheduled Backups | Waiting | 2025-01-27 04:57:06 |

## Tareas Completadas 

### 1. Compra y Configuración Inicial
- [x] Adquisición del VPS
- [x] Generación y configuración de llave SSH
- [x] Verificación de especificaciones del servidor

### 2. Conexión Inicial
- [x] Acceso exitoso como usuario ubuntu
- [x] Verificación de conectividad SSH

### 3. Actualización del Sistema
- [x] Actualización completa del sistema operativo
- [x] Actualización a kernel 5.15.0-130-generic
- [x] Reinicio del servidor completado

### 4. Configuración del Firewall (UFW)
- [x] Instalación de UFW
- [x] Configuración de puertos:
  - Puerto 22 (SSH)
  - Puerto 80 (HTTP)
  - Puerto 443 (HTTPS)
- [x] Activación y verificación del firewall

## Tareas Pendientes 

### 5. Configuración de Nginx
- [ ] Instalación de Nginx
- [ ] Configuración como servidor web
- [ ] Configuración como proxy inverso para SIPROD
- [ ] Optimización de configuración

### 6. Certificados SSL
- [ ] Instalación de Let's Encrypt
- [ ] Generación de certificados SSL
- [ ] Configuración de renovación automática
- [ ] Verificación de conexiones HTTPS

### 7. Entorno Node.js
- [ ] Instalación de Node.js
- [ ] Instalación de NPM
- [ ] Configuración de variables de entorno
- [ ] Verificación de versiones y funcionamiento

### 8. Base de Datos PostgreSQL
- [ ] Instalación de PostgreSQL
- [ ] Creación de base de datos SIPROD
- [ ] Creación y configuración de usuario
- [ ] Configuración de seguridad
- [ ] Backup inicial

### 9. Despliegue de SIPROD
- [ ] Transferencia de archivos
- [ ] Configuración de variables de entorno
- [ ] Instalación de dependencias
- [ ] Pruebas de funcionamiento

### 10. Monitoreo y Logs
- [ ] Instalación de herramientas de monitoreo
- [ ] Configuración de logrotate
- [ ] Configuración de alertas
- [ ] Verificación de funcionamiento

## Acceso al Servidor

Para acceder al servidor, utilizar el siguiente comando SSH:
```bash
ssh -i ~/.ssh/id_rsa_siprod ubuntu@179.27.203.208
```

La clave pública SSH se encuentra en:
```bash
Get-Content C:\Users\59898\.ssh\id_rsa_siprod.pub
```

## Configuración del Firewall (UFW)

### Instalación de UFW
```bash
ubuntu@679559c74f1d2:~$ sudo apt install ufw -y
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
ufw is already the newest version (0.36.1-4ubuntu0.1).
ufw set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 6 not upgraded.
```

### Configuración de Reglas
```bash
ubuntu@679559c74f1d2:~$ sudo ufw allow OpenSSH
Rules updated
Rules updated (v6)

ubuntu@679559c74f1d2:~$ sudo ufw allow 80
Rules updated
Rules updated (v6)

ubuntu@679559c74f1d2:~$ sudo ufw allow 443
Rules updated
Rules updated (v6)

ubuntu@679559c74f1d2:~$ sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
```

### Estado Actual del Firewall
```bash
ubuntu@679559c74f1d2:~$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80                         ALLOW       Anywhere
443                        ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
80 (v6)                    ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
```

## Notas Adicionales
- Mantener actualizada la documentación con cada cambio
- Realizar pruebas de seguridad periódicas
- Mantener respaldos actualizados
- Monitorear el rendimiento del servidor

## Información de Contacto
- Administrador del Sistema: [Pendiente de asignar]
- Email de contacto: [Pendiente de asignar]
- Teléfono de emergencia: [Pendiente de asignar]
