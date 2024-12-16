# SIPROD - Sistema de Gestión de Resultados Policiales y Recursos

> **Propósito**: Este documento es el punto de entrada principal al proyecto SIPROD. Proporciona una visión general del sistema y guía a los nuevos colaboradores hacia la documentación detallada.

## ¿Qué es SIPROD?

SIPROD es un sistema integral diseñado para la gestión eficiente de resultados policiales y recursos. El sistema permite:

- Centralización de información policial
- Análisis y reportes estadísticos
- Gestión de recursos humanos y materiales
- Herramientas CRUD seguras
- Escalabilidad y adaptabilidad

## Documentación

La documentación completa del proyecto se encuentra en la carpeta `docs/`:

- [Proyecto](docs/PROYECTO.md): Documentación técnica detallada, arquitectura y estructura
- [Desarrollo](docs/DESARROLLO.md): Estándares, mejores prácticas y guías de implementación
- [Infraestructura](docs/INFRAESTRUCTURA.md): Configuración del servidor y detalles operativos
- [Historial](docs/HISTORIAL.md): Registro de cambios y evolución del proyecto
- [Tareas](docs/TAREAS.md): Backlog y seguimiento de actividades

## Inicio Rápido

### Requisitos Previos
- Node.js 18 o superior
- PNPM
- Docker y Docker Compose
- Git

### Configuración Local

1. Clonar el repositorio:
```bash
git clone https://[repositorio]/siprod.git
cd siprod
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con valores locales
```

4. Iniciar servicios:
```bash
# Con Docker
docker-compose up -d

# O en desarrollo local
pnpm dev
```

## Estructura del Proyecto
```
SIPROD/
├── apps/
│   ├── api/         # Backend (NestJS)
│   └── web/         # Frontend (Next.js)
├── packages/
│   ├── config/      # Configuraciones
│   ├── ui/          # Componentes UI
│   └── utils/       # Utilidades
├── docs/            # Documentación
└── docker-compose.yml
```

## Contribución

1. Revisa la [Guía de Desarrollo](docs/DESARROLLO.md)
2. Crea una rama para tu feature
3. Desarrolla y prueba tus cambios
4. Crea un pull request
5. Espera la revisión y aprobación

## Soporte

- **Problemas técnicos**: Crear issue en el repositorio
- **Preguntas**: Consultar la documentación en `docs/`
- **Emergencias**: Contactar al equipo DevOps (ver [Infraestructura](docs/INFRAESTRUCTURA.md))

## Licencia

[Pendiente]
