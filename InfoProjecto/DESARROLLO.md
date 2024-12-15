# Guía de Desarrollo - SIPROD

> **Propósito del Archivo**: Este documento establece los estándares, mejores prácticas y guías de desarrollo para el proyecto. Define las convenciones de código, estructura de carpetas, flujos de trabajo Git, y procesos de desarrollo. Es la referencia principal para mantener la consistencia y calidad del código en todo el proyecto.

## Estándares de Código

### Convenciones de Nombrado

- **Componentes React:** PascalCase (ej: UserProfile.tsx)
- **Archivos de utilidad:** camelCase (ej: formatDate.ts)
- **Constantes:** UPPER_SNAKE_CASE
- **Variables y funciones:** camelCase
- **Tipos y interfaces:** PascalCase

### Mejores Prácticas de Desarrollo 🆕

#### Monorepo

1. **Dependencias Compartidas:**

   - Usar pnpm para gestión de dependencias
   - Mantener versiones consistentes entre paquetes
   - Evitar duplicación de dependencias

2. **Estructura de Código:**
   - Mantener código compartido en `packages/`
   - Usar aliases para imports internos
   - Documentar interfaces públicas

#### Frontend

1. **Componentes:**

   - Implementar lazy loading cuando sea posible
   - Usar React.memo para optimización
   - Mantener componentes pequeños y reutilizables

2. **Performance:**
   - Implementar code splitting
   - Optimizar imágenes y assets
   - Usar caché de forma efectiva

#### Backend

1. **API:**

   - Usar DTOs para validación de datos
   - Implementar rate limiting
   - Documentar endpoints con OpenAPI

2. **Seguridad:**
   - Validar todos los inputs
   - Implementar CORS apropiadamente
   - Usar variables de entorno para secrets

### Estructura de Carpetas

```
apps/
  ├── web/
  │   ├── components/     # Componentes React reutilizables
  │   ├── features/       # Componentes específicos de funcionalidad
  │   ├── hooks/         # Custom hooks
  │   ├── utils/         # Utilidades y helpers
  │   └── types/         # Tipos TypeScript
  └── api/
      ├── controllers/   # Controladores de rutas
      ├── services/      # Lógica de negocio
      ├── models/        # Modelos de datos
      └── utils/         # Utilidades del backend

packages/
  ├── ui/               # Biblioteca de componentes compartidos
  ├── types/           # Tipos compartidos
  └── utils/           # Utilidades compartidas
```

### Flujo de Trabajo Git

1. **Ramas:**

   - `main`: Producción
   - `develop`: Desarrollo principal
   - `feature/*`: Nuevas funcionalidades
   - `fix/*`: Correcciones
   - `release/*`: Preparación para producción

2. **Commits:**

   ```
   tipo(alcance): descripción corta

   Descripción detallada si es necesaria
   ```

   Tipos: feat, fix, docs, style, refactor, test, chore

3. **Pull Requests:**
   - Título descriptivo
   - Descripción de cambios
   - Referencias a issues
   - Checklist de pruebas

### Guías de Docker 🆕

1. **Desarrollo:**

   - Usar volumes para hot-reload
   - Optimizar capas de imagen
   - Mantener .dockerignore actualizado

2. **Producción:**
   - Usar multi-stage builds
   - Minimizar tamaño de imágenes
   - Implementar health checks

## Configuración del Entorno Docker

### Puertos Utilizados

- Frontend: 3000
- Backend: 4000
- PostgreSQL: 5433 (cambiado de 5432 para evitar conflictos con instalaciones locales)

### Estructura de Contenedores

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    ports: ['3000:3000']

  backend:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile.dev
    ports: ['4000:4000']

  db:
    image: postgres:15-alpine
    ports: ['5433:5432']
```

### Comandos Docker Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Reconstruir servicios
docker-compose build --no-cache

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f
```

## Docker y Despliegue

### Configuración de Desarrollo

1. Requisitos Previos

   ```bash
   # Instalar Docker y Docker Compose
   # Instalar pnpm globalmente
   npm install -g pnpm
   ```

2. Variables de Entorno

   - Copiar `.env.example` a `.env`
   - Ajustar variables según el entorno
   - NO compartir el archivo `.env` en el repositorio

3. Iniciar el Proyecto

   ```bash
   # Construir e iniciar contenedores
   docker-compose up --build

   # En modo detached
   docker-compose up -d --build
   ```

4. Monitoreo y Logs

   ```bash
   # Ver logs de todos los servicios
   docker-compose logs -f

   # Ver logs de un servicio específico
   docker-compose logs -f [frontend|backend|db]
   ```

### Gestión de Recursos

1. Límites de Recursos

   - Frontend: 1 CPU, 2GB RAM
   - Backend: 1 CPU, 1.5GB RAM
   - Database: 1 CPU, 1GB RAM

2. Healthchecks

   - Intervalos de verificación: 10-20 segundos
   - Timeouts: 5-10 segundos
   - Reintentos: 3-5 veces

3. Persistencia de Datos
   - Volumen nombrado para PostgreSQL
   - Backup regular recomendado
   - Punto de montaje: /var/lib/postgresql/data

### Buenas Prácticas

1. Desarrollo

   - Usar `pnpm` como gestor de paquetes
   - Mantener Dockerfiles optimizados
   - Seguir principios de 12-factor app

2. Seguridad

   - No exponer secretos en código
   - Usar variables de entorno
   - Implementar rate limiting
   - Configurar CORS apropiadamente

3. Monitoreo
   - Revisar logs regularmente
   - Monitorear uso de recursos
   - Verificar healthchecks

## Configuración de TypeScript

### Estructura Base

- `@siprod/tsconfig`: Configuración base compartida
- Ubicación: `packages/tsconfig/base.json`
- Extensión en otros paquetes mediante `extends: "@siprod/tsconfig/base.json"`

### Configuración por Servicio

- Backend: Modo CommonJS, ES2020
- Frontend: Next.js, ESNext
- Paquetes compartidos: ESNext, declaraciones habilitadas

## Comandos del Proyecto

Esta sección detalla los comandos disponibles en el proyecto y cuándo utilizarlos.

### Comandos de Desarrollo

#### Gestión de Dependencias

```bash
# Instalar todas las dependencias del proyecto
pnpm install

# Limpiar todas las dependencias (node_modules)
pnpm clean

# Actualizar dependencias
pnpm update
```

#### Desarrollo y Construcción

```bash
# Iniciar el entorno de desarrollo
pnpm dev

# Construir el proyecto para producción
pnpm build

# Iniciar el proyecto en modo producción
pnpm start
```

#### Calidad de Código

```bash
# Ejecutar el linter en todo el proyecto
pnpm lint

# Corregir automáticamente problemas de linting
pnpm lint:fix

# Formatear código automáticamente
pnpm format

# Ejecutar pruebas
pnpm test
```

#### Base de Datos

```bash
# Ejecutar migraciones de la base de datos
pnpm db:migrate

# Abrir Prisma Studio para gestionar la base de datos
pnpm db:studio
```

### Descripción de Comandos

#### Comandos Principales

- `pnpm dev`: Inicia el entorno de desarrollo con hot-reload. Usar durante el desarrollo.
- `pnpm build`: Compila el proyecto para producción. Usar antes de desplegar.
- `pnpm start`: Inicia el proyecto en modo producción. Usar en el servidor de producción.

#### Comandos de Mantenimiento

- `pnpm clean`: Elimina todos los node_modules. Útil para limpiar dependencias corruptas.
- `pnpm format`: Formatea automáticamente el código según las reglas de Prettier.
- `pnpm lint`: Verifica el código en busca de problemas de estilo y posibles errores.
- `pnpm lint:fix`: Corrige automáticamente los problemas de linting que sean posibles.

#### Comandos de Base de Datos

- `pnpm db:migrate`: Ejecuta las migraciones pendientes de Prisma. Usar después de cambios en el schema.
- `pnpm db:studio`: Abre la interfaz visual de Prisma para gestionar la base de datos.

### Comandos de Turbo

Turbo se utiliza para gestionar el monorepo y optimizar la ejecución de tareas:

```bash
# Ver el gráfico de dependencias
turbo run build --graph

# Ejecutar una tarea específica en un workspace
turbo run dev --scope=@siprod/web
```

### Comandos de Docker

```bash
# Construir la imagen
docker build -t siprod .

# Ejecutar el contenedor
docker run -p 3000:3000 siprod

# Ejecutar con docker-compose
docker-compose up
```

### Comandos de Git y Husky

```bash
# Los hooks de Git se instalan automáticamente al ejecutar
pnpm prepare

# Commit con convención
git commit -m "feat: nueva funcionalidad"
```

### Buenas Prácticas

1. **Desarrollo Local**

   - Siempre iniciar con `pnpm dev`
   - Usar `pnpm format` antes de commits

2. **Antes de Commits**

   - Ejecutar `pnpm lint`
   - Verificar que las pruebas pasen con `pnpm test`

3. **Despliegue**

   - Ejecutar `pnpm build`
   - Verificar la construcción localmente

4. **Mantenimiento**
   - Usar `pnpm clean` cuando hay problemas con dependencias
   - Mantener las migraciones actualizadas con `pnpm db:migrate`

## Guías de Implementación

### Frontend

1. **Componentes:**

   - Usar componentes funcionales
   - Implementar React.memo para optimización
   - Mantener componentes pequeños y reutilizables

2. **Estado:**

   - Usar Redux Toolkit para estado global
   - useState para estado local
   - useContext para temas y configuraciones

3. **Estilos:**
   - Usar Material UI + Emotion
   - Seguir sistema de diseño establecido
   - Mantener consistencia en espaciados

### Backend

1. **API:**

   - RESTful para endpoints principales
   - GraphQL para consultas complejas
   - Documentar con OpenAPI/Swagger

2. **Base de Datos:**

   - Usar Prisma para consultas
   - Mantener migraciones versionadas
   - Implementar índices apropiados

3. **Seguridad:**
   - Validar todos los inputs
   - Implementar rate limiting
   - Manejar errores consistentemente

## Componentes Base

### Ubicación

Los componentes base se encuentran en el paquete `@siprod/ui` y están disponibles para su uso en toda la aplicación.

### Componentes Disponibles

#### Button

```tsx
import { Button } from '@siprod/ui'

// Variantes disponibles
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// Tamaños
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

#### TextField

```tsx
import { TextField } from '@siprod/ui'

// Uso básico
<TextField label="Username" />

// Con íconos
<TextField
  startIcon={<SearchIcon />}
  placeholder="Buscar..."
/>

// Con validación
<TextField
  required
  error={!!error}
  helperText={error}
/>
```

#### Table

```tsx
import { Table } from '@siprod/ui'

const columns = [
  { id: 'name', label: 'Nombre' },
  { id: 'age', label: 'Edad' },
]

const rows = [
  { name: 'Juan', age: 30 },
  { name: 'María', age: 25 },
]

<Table
  title="Lista de Usuarios"
  columns={columns}
  rows={rows}
/>
```

#### Card

```tsx
import { Card } from '@siprod/ui'
;<Card
  title="Título"
  subtitle="Subtítulo"
  headerAction={<Button>Acción</Button>}
  footer={<Button>Footer Action</Button>}
>
  Contenido de la tarjeta
</Card>
```

### Convenciones de Uso

1. Usar los componentes base en lugar de los componentes MUI directamente
2. Mantener la consistencia en el uso de variantes y tamaños
3. Seguir las guías de accesibilidad
4. Documentar cualquier extensión o modificación de los componentes base

## Gestión de Recursos Estáticos

### Estructura de Imágenes

Las imágenes se organizan en la carpeta `public/assets/images/` siguiendo esta estructura:

```
public/assets/images/
├── auth/           # Imágenes de autenticación
├── brand/          # Logos e imágenes de marca
├── icons/          # Íconos personalizados
├── backgrounds/    # Imágenes de fondo
├── avatars/        # Imágenes de perfil
└── illustrations/  # Ilustraciones decorativas
```

### Uso con Next.js Image

```tsx
import Image from 'next/image'

// Uso básico
<Image
  src="/assets/images/brand/logo.png"
  alt="SIPROD Logo"
  width={200}
  height={50}
/>

// Con optimización automática
<Image
  src="/assets/images/backgrounds/login-bg.jpg"
  alt="Login Background"
  fill
  sizes="100vw"
  style={{ objectFit: 'cover' }}
/>
```

### Convenciones y Mejores Prácticas

1. **Nombrado de Archivos**

   - Usar nombres descriptivos en minúsculas
   - Separar palabras con guiones
   - Incluir dimensiones si es relevante
   - Ejemplo: `logo-siprod-dark.png`

2. **Formatos Recomendados**

   - SVG: Íconos y logos
   - PNG: Imágenes con transparencia
   - JPEG/WebP: Fotografías y fondos
   - ICO: Favicon

3. **Optimización**

   - Comprimir imágenes antes de agregarlas
   - Usar WebP como formato alternativo
   - Mantener tamaños razonables

4. **Responsive Images**
   - Usar el componente `next/image`
   - Proporcionar `sizes` apropiados
   - Implementar lazy loading

## Testing

### Configuración

El proyecto utiliza Jest y React Testing Library para las pruebas. La configuración se encuentra en:

- `apps/web/jest.config.js`: Configuración principal de Jest
- `apps/web/jest.setup.js`: Configuración de testing-library y mocks globales

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests con cobertura
pnpm test:coverage
```

### Estructura de Tests

Los tests se organizan siguiendo la estructura del código fuente:

```
src/
  components/
    __tests__/        # Tests de componentes
  hooks/
    __tests__/        # Tests de hooks
  utils/
    __tests__/        # Tests de utilidades
```

### Convenciones de Testing

1. Nombrar archivos de test: `[nombre].test.tsx` o `[nombre].test.ts`
2. Usar descripciones claras en los bloques `describe` e `it`
3. Seguir el patrón AAA (Arrange, Act, Assert)
4. Utilizar screen queries de React Testing Library
5. Evitar implementaciones de test frágiles

## Pruebas

### Frontend

```typescript
// Ejemplo de prueba de componente
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### Backend

```typescript
// Ejemplo de prueba de servicio
describe('Service', () => {
  it('should process data correctly', async () => {
    const result = await service.process(data)
    expect(result).toMatchSnapshot()
  })
})
```

## Métricas y Calidad

- Coverage mínimo: 80%
- Complejidad ciclomática máxima: 10
- Longitud máxima de función: 20 líneas
- Profundidad máxima de anidación: 3 niveles

## Proceso de Review

1. Verificar estándares de código
2. Revisar pruebas
3. Validar rendimiento
4. Confirmar documentación
5. Aprobar o solicitar cambios

## Documentación

- Documentar APIs con OpenAPI
- Mantener README actualizado
- Comentar código complejo
- Actualizar changelog
