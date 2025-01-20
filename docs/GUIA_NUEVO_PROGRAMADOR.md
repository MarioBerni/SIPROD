# Guía para Nuevos Programadores - SIPROD 🚀

¡Bienvenido al equipo de SIPROD! Esta guía te ayudará a entender cómo trabajar en nuestro proyecto de manera efectiva.

## 🌟 ¿Qué es SIPROD?

SIPROD (Sistema de Gestión de Resultados Policiales y Recursos) es un sistema que centraliza y gestiona información policial crítica para facilitar:
- Toma de decisiones
- Análisis estadístico
- Administración de recursos humanos y materiales

## 🛠️ Tecnologías Principales

### Frontend
- Next.js 14
- TypeScript
- Material-UI

### Backend
- Node.js 18
- Express
- Prisma ORM
- PostgreSQL

## 🚀 Primeros Pasos

1. **Instalar Herramientas Necesarias**
   - Node.js (versión 18 o superior)
   - pnpm (gestor de paquetes)
   - Git
   - Visual Studio Code (recomendado)

2. **Clonar el Repositorio**
   ```bash
   git clone [URL-del-repositorio]
   cd SIPROD
   ```

3. **Instalar Dependencias**
   ```bash
   pnpm install
   ```

## 📋 Comandos Principales

### Desarrollo
- `pnpm dev`: Inicia el entorno de desarrollo
- `pnpm build`: Construye el proyecto para producción
- `pnpm lint`: Revisa el código en busca de errores
- `pnpm test`: Ejecuta las pruebas
- `pnpm prisma:generate`: Genera tipos de Prisma después de cambios en el esquema
- `pnpm prisma:push`: Actualiza la base de datos con cambios del esquema

## 🗂️ Estructura del Proyecto

```
SIPROD/
├── apps/                  # Aplicaciones principales
│   ├── api/              # Backend API
│   ├── web/              # Frontend
│   └── cache-server/     # Servidor de caché
├── packages/             # Paquetes compartidos
└── docs/                # Documentación
```

## 🔄 Flujo de Trabajo para Nuevas Funcionalidades

### 1. Crear una Nueva Página
1. Navega a `apps/web/src/app`
2. Crea una nueva carpeta con el nombre de tu página
3. Crea un archivo `page.tsx` dentro de la carpeta
4. Si necesitas componentes específicos, créalos en una subcarpeta `components`

### 2. Conectar con el Backend
1. Crea un nuevo endpoint en `apps/api/src/routes`
2. Implementa la lógica en `apps/api/src/controllers`
3. Define los tipos necesarios en `packages/types`
4. Usa React Query en el frontend para hacer las llamadas API

### 3. Base de Datos
1. Actualiza el esquema en `apps/api/prisma/schema.prisma`
2. Ejecuta `pnpm prisma:generate` para actualizar tipos
3. Ejecuta `pnpm prisma:push` para actualizar la base de datos

## 🌐 Flujo Git

1. Crea una nueva rama desde `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nombre-funcionalidad
   ```

2. Realiza tus cambios siguiendo las guías de estilo

3. Commits descriptivos:
   ```bash
   git commit -m "feat(modulo): descripción del cambio"
   ```

4. Push y Pull Request:
   ```bash
   git push origin feature/nombre-funcionalidad
   ```
   - Crea un Pull Request a `develop`
   - Espera revisión del código

## 🎨 Guías de Estilo

### TypeScript/React
- Usa tipos explícitos
- Componentes funcionales con TypeScript
- Nombres de interfaces en PascalCase
- Variables y funciones en camelCase

### CSS/Diseño
- Sigue el sistema de diseño establecido
- Utiliza los componentes de Material-UI

## 🆘 Ayuda y Recursos

- Revisa la documentación en la carpeta `docs/`
- Consulta con el equipo en el canal de Slack
- Usa los comentarios en el código como guía
- No dudes en preguntar si tienes dudas

## 📝 Buenas Prácticas

1. **Código Limpio**
   - Nombres descriptivos
   - Funciones pequeñas y enfocadas
   - Comentarios cuando sea necesario

2. **Testing**
   - Escribe pruebas para nueva funcionalidad
   - Verifica que las pruebas existentes pasen

3. **Optimización**
   - Usa lazy loading para componentes grandes
   - Optimiza imágenes y recursos
   - Implementa caching cuando sea posible

4. **Seguridad**
   - No expongas información sensible
   - Valida entradas de usuario
   - Sigue las mejores prácticas de seguridad

¡Estamos emocionados de tenerte en el equipo! No dudes en hacer preguntas y contribuir con ideas para mejorar el proyecto.
