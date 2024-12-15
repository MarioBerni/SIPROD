# Historial de Cambios - SIPROD

> **Propósito del Archivo**: Este documento mantiene un registro cronológico detallado de todos los cambios significativos realizados en el proyecto. Incluye actualizaciones, mejoras, correcciones y cambios en la configuración. Sirve como referencia histórica y ayuda a entender la evolución del proyecto.

## 2024-12-13

### Optimización de Configuración Docker

1. Dockerfiles y Compose

   - Creación de Dockerfile.dev para frontend y backend
   - Optimización de docker-compose.yml con:
     - Límites de recursos (CPU y memoria) para cada servicio
     - Healthchecks mejorados para todos los servicios
     - Configuración de reinicio automático (restart: unless-stopped)
     - Volumen persistente para PostgreSQL

2. Estructura y Rutas

   - Corrección de rutas en docker-compose.yml
   - Actualización de la estructura de directorios frontend/backend
   - Optimización de volúmenes montados

3. Variables de Entorno

   - Verificación y validación de variables en .env.example
   - Configuración de límites de tasa (rate limiting)
   - Separación clara de variables por entorno (desarrollo/producción)

4. Base de Datos

   - Configuración optimizada de PostgreSQL 15
   - Implementación de healthchecks para la base de datos
   - Configuración de volumen persistente nombrado

5. Seguridad
   - Implementación de variables de entorno seguras
   - Configuración de CORS y rate limiting
   - Protección de secretos y credenciales

## 2024-12-10

### Configuración Inicial del Servidor (VPS)

1. Acceso y Configuración Base

   - Acceso exitoso a la plataforma NetUy
   - Cambio de contraseñas por seguridad
   - Configuración inicial del VPS completada
   - Hostname configurado correctamente

2. Seguridad y Acceso

   - Configuración SSH implementada
   - Generación y configuración de claves SSH
   - Habilitación de acceso root y autenticación por contraseña
   - Servicio SSH reiniciado y verificado

3. Sistema y Firewall

   - Actualización completa del sistema (yum update)
   - Instalación de repositorios EPEL
   - Firewalld instalado y configurado
   - Puertos necesarios habilitados (SSH, HTTP, HTTPS)

4. Entorno de Desarrollo
   - Node.js 18.x instalado y configurado
   - pnpm instalado como gestor de paquetes principal
   - Preparación inicial para PM2 y Nginx

### Configuración de Red y Accesibilidad

1. Optimización de Conectividad

   - Habilitación de escucha en IPv4 (0.0.0.0)
   - Configuración de host para Next.js
   - Mejora en accesibilidad del servidor

2. Ajustes en ecosystem.config.js
   - Actualización de script para Next.js
   - Configuración de host IPv4
   - Optimización de parámetros de red
   - Mejora en la configuración de ambos servicios

### Actualización de Configuración PM2

1. Correcciones en ecosystem.config.js

   - Actualización de rutas a absolutas
   - Corrección del script del backend (index.js)
   - Configuración de directorios de logs
   - Actualización de rutas de trabajo (cwd)

2. Mejoras en la Estructura
   - Organización de logs en directorio dedicado
   - Actualización de scripts de construcción
   - Optimización de configuración de despliegue

### Optimización de Configuración PM2 Frontend

1. Ajustes en ecosystem.config.js

   - Cambio de script a npm para mejor compatibilidad con Next.js
   - Modificación del modo de ejecución a fork
   - Optimización de la configuración del frontend
   - Actualización de rutas de logs

2. Mejoras en el Despliegue
   - Ajuste de parámetros de ejecución
   - Optimización del manejo de procesos
   - Mejora en la gestión de logs

### Pendiente

1. Configuración de cPanel y WHM
2. Gestión de DNS y dominios
3. Certificados SSL
4. Backups automáticos
5. Configuración de bases de datos
6. Medidas adicionales de seguridad

## 2024-12-09

1. Optimización de la configuración de TypeScript en todo el monorepo

   - Resolución de problemas con Material-UI y Emotion
   - Mejora en la estructura del tema y componentes
   - Corrección de errores en el build del proyecto

2. Optimización de Docker

   - Eliminación de la versión obsoleta en docker-compose.yml
   - Verificación exitosa de builds limpios para todos los servicios
   - Tiempos de compilación optimizados:
     - Frontend: ~120s (incluye instalación de dependencias)
     - Backend: ~40s (optimizado para desarrollo)
   - Confirmación de healthchecks funcionando correctamente

3. Configuración de PM2 para Producción

   - Creación de ecosystem.config.js para gestión de procesos
   - Configuración de clusters para frontend y backend
   - Definición de variables de entorno para producción
   - Optimización de recursos del servidor

4. Configuración de Producción
   - Implementación de configuración Nginx con seguridad mejorada
   - Configuración de variables de entorno para producción
   - Optimización de PM2 con logging y monitoreo
   - Preparación para SSL/TLS con Let's Encrypt

## 2024-12-08

1. Configuración de Monorepo

   - Reorganización de la estructura del proyecto a monorepo
   - Movimiento de frontend y backend a carpetas packages/
   - Creación de packages/shared y packages/types para código compartido
   - Configuración de Turborepo con turbo.json
   - Actualización del package.json root para workspaces

2. Configuración Inicial de Docker

   - Creación de .dockerignore global para optimizar builds
   - Implementación de Dockerfile.dev para frontend y backend
   - Configuración de docker-compose.yml con servicios para desarrollo
   - Configuración de volúmenes para persistencia
   - Configuración de variables de entorno para desarrollo

3. Configuración de Docker para Producción
   - Creación de Dockerfile multi-stage para frontend optimizado
   - Creación de Dockerfile multi-stage para backend optimizado
   - Implementación de docker-compose.prod.yml para producción
   - Configuración de variables de entorno con .env.example
   - Optimización de seguridad con usuarios no-root en contenedores

## 2024-12-07

1. Inicialización del Backend

   - Creación de la estructura del proyecto backend
   - Instalación de dependencias principales:
     - Express y TypeScript para el servidor
     - Prisma ORM para la base de datos
     - JWT y bcrypt para autenticación
     - Zod para validación
     - Winston para logging
     - CORS para seguridad
   - Configuración inicial del entorno de desarrollo

2. Optimización del Tema y Diseño Responsive

   - Simplificación del sistema de tipografía para mejor adaptabilidad
   - Eliminación de media queries innecesarias
   - Mejora en la escala de tipografía para dispositivos móviles
   - Optimización de la paleta de colores
   - Actualización de colores primarios y secundarios

3. Mejoras en la Interfaz de Usuario
   - Actualización del color primario a '#1900cd'
   - Mejora en el contraste y legibilidad
   - Simplificación de estilos de componentes
   - Optimización del rendimiento en dispositivos móviles

## 2024-12-06

1. Implementación inicial del Navbar

   - Creación del componente Navbar con drawer responsive
   - Integración de Material-UI y configuración del tema
   - Implementación de navegación dinámica
   - Corrección de errores TypeScript en componentes

2. Mejoras en la Navegación

   - Reemplazo de ListItem por ListItemButton para mejor interactividad
   - Corrección de errores TypeScript en props y tipos
   - Eliminación de importaciones no utilizadas
   - Optimización del código del drawer

3. Diseño del Navbar

   - Implementación de diseño minimalista
   - Drawer superpuesto sobre AppBar
   - Mejora en la presentación de información del usuario
   - Adición de logo y marca de agua
   - Optimización de estilos y transiciones

4. Configuración del Proyecto
   - Establecimiento de la estructura base del proyecto
   - Configuración inicial de Next.js con TypeScript
   - Implementación de Material-UI como framework de UI
   - Organización de la documentación del proyecto

## Estructura del Monorepo

### Apps

- `web`: Aplicación web principal (Next.js)
- `api`: API REST (Node.js/Express)

### Packages

- `ui`: Biblioteca de componentes compartidos
- `utils`: Utilidades y funciones comunes
- `config`: Configuraciones compartidas
- `tsconfig`: Configuraciones de TypeScript

## Decisiones Técnicas

### TypeScript

- Configuración base en la raíz del proyecto
- Configuraciones específicas para cada tipo de proyecto (Next.js, biblioteca, API)
- Estricta validación de tipos

### Material-UI y Emotion

- Implementación de ThemeRegistry para manejo de estilos
- Cache de Emotion optimizado
- Tema personalizado con soporte para modo claro/oscuro

### Build y Deploy

- Sistema de build optimizado con Turborepo
- Cache distribuido para builds más rápidos
- Configuración de Docker para desarrollo y producción

## Próximos Pasos

1. Implementación de autenticación y autorización
2. Desarrollo de componentes UI base
3. Configuración de pruebas automatizadas
4. Implementación de CI/CD

## Próximas Actualizaciones Planificadas

1. Configuración de Prisma y base de datos
2. Implementación de autenticación JWT
3. Desarrollo de endpoints de API
4. Integración frontend-backend
