# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-Privada-red)

## 📋 Descripción
SIPROD es un sistema integral diseñado para la gestión eficiente de información policial, resultados operativos y recursos. Facilita la toma de decisiones, análisis estadístico y administración de recursos humanos y materiales en entornos policiales.

### 🎯 Objetivos Principales
- Centralización de información policial
- Gestión eficiente de recursos
- Análisis estadístico en tiempo real
- Toma de decisiones basada en datos
- Seguimiento de resultados operativos

## 🏗️ Estructura del Proyecto
Este proyecto utiliza una arquitectura monorepo con las siguientes aplicaciones y paquetes:

```
SIPROD/
├── apps/
│   ├── api/         # Backend API (Node.js + Express)
│   └── web/         # Frontend (Next.js)
├── packages/
│   ├── config/      # Configuraciones compartidas
│   ├── tsconfig/    # Configuraciones de TypeScript
│   ├── ui/          # Componentes de UI compartidos
│   └── utils/       # Utilidades compartidas
└── docs/           # Documentación detallada
```

## 🛠️ Tecnologías Principales
### Frontend
- Next.js 14 (Framework React)
- Emotion-styled (Estilos)
- TypeScript (Lenguaje)
- Material-UI (Componentes)

### Backend
- Node.js 18 (Runtime)
- Express (Framework)
- PostgreSQL (Base de datos)
- Prisma ORM (ORM)

### DevOps
- GitHub Actions (CI/CD)
- Nginx (Servidor web)
- Redis (Cache)

### Herramientas de Desarrollo
- Turbo (Gestión de monorepo)
- PNPM (Gestor de paquetes)
- ESLint (Linting)
- Jest (Testing)

## 🔒 Seguridad y Autenticación
- Sistema de autenticación basado en cookies HTTP-Only
- Middleware de protección de rutas
- Validación automática de tokens
- Manejo de sesiones seguro
- Protección contra CSRF y XSS

## 📋 Requisitos Previos
- Node.js 18 o superior
- PNPM 8.x
- PostgreSQL 15 o superior

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd SIPROD
```

2. Instalar dependencias:Password for 'https://Mario Berni@github.com':
remote: Enumerating objects: 64, done.
remote: Counting objects: 100% (64/64), done.
remote: Compressing objects: 100% (13/13), done.
remote: Total 36 (delta 23), reused 36 (delta 23), pack-reused 0 (from 0)
Unpacking objects: 100% (36/36), 20.12 KiB | 321.00 KiB/s, done.
From https://github.com/MarioBerni/SIPROD
 * branch            main       -> FETCH_HEAD
   5c09c3b..83d82c1  main       -> origin/main
Updating 5c09c3b..83d82c1
error: Your local changes to the following files would be overwritten by merge:
        apps/api/logs/combined.log
        apps/api/src/index.ts
        ecosystem.config.js
        nginx/siprod.conf
        pnpm-lock.yaml
Please commit your changes or stash them before you merge.
Aborting
[d5baf91c@179-27-203-219 siprod]$

EX
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Iniciar el proyecto en modo desarrollo:
```bash
pnpm dev
```

## 🔐 Variables de Entorno
### Requisitos de Seguridad
Las siguientes variables requieren configuración especial por motivos de seguridad:

- `JWT_SECRET`: Mínimo 32 caracteres para firma de tokens JWT
- `NEXT_PUBLIC_JWT_SECRET`: Mínimo 32 caracteres para validación en frontend
- `SESSION_SECRET`: Mínimo 32 caracteres para sesiones

### Troubleshooting Común
1. **Error: String must contain at least 32 character(s)**
   - Causa: Las variables de seguridad requieren mínimo 32 caracteres
   - Solución: Actualizar los valores en los archivos .env siguiendo el formato:
     ```
     JWT_SECRET=siprod_jwt_[env]_secret_2025_secure_key_32!
     NEXT_PUBLIC_JWT_SECRET=siprod_jwt_[env]_secret_2025_secure_key_32!
     SESSION_SECRET=siprod_session_[env]_secret_2025_secure_32!
     ```

2. **Error: Invalid URL format**
   - Causa: CORS_ORIGIN debe ser una URL válida
   - Solución: Usar formato correcto
     ```
     # Desarrollo
     CORS_ORIGIN="http://localhost:3000"
     # Producción
     CORS_ORIGIN="https://siprod.uy"
     ```

## 📚 Documentación
Para más detalles, consulta los siguientes documentos en la carpeta `docs/`:

- [PROYECTO.md](docs/PROYECTO.md) - Estructura y arquitectura técnica
- [DESARROLLO.md](docs/DESARROLLO.md) - Guías de desarrollo y estándares
- [OPERACIONES.md](docs/OPERACIONES.md) - Guía de operaciones y despliegue
- [MANTENIMIENTO.md](docs/MANTENIMIENTO.md) - Mantenimiento y optimizaciones
- [OPTIMIZACIONES.md](docs/OPTIMIZACIONES.md) - Guías de optimización

## 🚀 Despliegue

### Estado del Proyecto

**Servicios Activos**
- Frontend: https://siprod.uy
- API: https://siprod.uy/api
- Documentación: https://siprod.uy/docs

### Configuración del Entorno

#### Prerequisitos
- Node.js 18+
- PostgreSQL
- Nginx
- PM2

#### Estructura de Puertos
- Frontend (Next.js): 3000
- Backend (API): 4000
- Nginx: 80, 443

### Verificación de Servicios
```bash
# Estado de Nginx
sudo systemctl status nginx

# Logs de Nginx
sudo tail -f /var/log/nginx/siprod.error.log
sudo tail -f /var/log/nginx/siprod.access.log

# Estado de PM2
pm2 status
pm2 logs

# Verificar puertos
sudo netstat -tulpn | grep -E ':80|:443|:3000|:4000'
```

### Monitoreo
- Logs de Frontend: `pm2 logs next-server`
- Logs de Backend: `pm2 logs api-server`
- Logs de Nginx: `/var/log/nginx/siprod.{access,error}.log`

## 📚 Documentación
- `/docs/DEPLOYMENT_LOG.md`: Registro de despliegues
- `/docs/PROYECTO.md`: Estructura del proyecto
- `/docs/DESARROLLO.md`: Guías de desarrollo
- `/nginx/README.md`: Configuración de Nginx

## 🔐 Seguridad
- SSL/TLS configurado
- Redirección HTTP a HTTPS
- Headers de seguridad implementados
- Certificados gestionados por cPanel

## 🤝 Contribución
Por favor, lee [DESARROLLO.md](docs/DESARROLLO.md) para detalles sobre nuestro código de conducta y el proceso para enviar pull requests.

## 📄 Licencia
Este proyecto está bajo licencia privada - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces Útiles
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de MaterialMUI](https://mui.com/material-ui/)
