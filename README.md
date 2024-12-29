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
- TailwindCSS (Estilos)
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

2. Instalar dependencias:
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

## 📚 Documentación
Para más detalles, consulta los siguientes documentos en la carpeta `docs/`:

- [PROYECTO.md](docs/PROYECTO.md) - Estructura y arquitectura técnica
- [DESARROLLO.md](docs/DESARROLLO.md) - Guías de desarrollo y estándares
- [OPERACIONES.md](docs/OPERACIONES.md) - Guía de operaciones y despliegue
- [MANTENIMIENTO.md](docs/MANTENIMIENTO.md) - Mantenimiento y optimizaciones
- [OPTIMIZACIONES.md](docs/OPTIMIZACIONES.md) - Guías de optimización

## 🤝 Contribución
Por favor, lee [DESARROLLO.md](docs/DESARROLLO.md) para detalles sobre nuestro código de conducta y el proceso para enviar pull requests.

## 📄 Licencia
Este proyecto está bajo licencia privada - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces Útiles
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de TailwindCSS](https://tailwindcss.com/docs)
