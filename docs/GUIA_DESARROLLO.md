# Guía de Desarrollo SIPROD

Este documento establece las prácticas de desarrollo, estándares de código y flujos de trabajo para el proyecto SIPROD. Su propósito es mantener la consistencia y calidad del código a través de todo el proyecto.

## Estándares de Código

### TypeScript

```typescript
// ✅ Correcto
interface UserData {
  id: string;
  name: string;
  role: UserRole;
}

// ❌ Incorrecto
interface userData {
  ID: string;
  Name: string;
  Role: string;
}
```

#### Reglas Principales
- Usar `interface` sobre `type` para definiciones de objetos
- Nombres de interfaces en PascalCase
- Nombres de variables y funciones en camelCase
- Tipos explícitos para parámetros de funciones
- Evitar el uso de `any`

### React/Next.js

```typescript
// ✅ Correcto
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="p-4">
      <h1>{user.name}</h1>
    </div>
  );
};

// ❌ Incorrecto
function UserProfile(props) {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>{props.user.name}</h1>
    </div>
  );
}
```

#### Reglas Principales
- Usar componentes funcionales con TypeScript
- Implementar lazy loading para optimización
- Mantener componentes pequeños y enfocados
- Usar hooks personalizados para lógica reutilizable

### CSS/Emotion

```typescript
// ✅ Correcto
const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

// ❌ Incorrecto
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  padding: '1rem' 
}}>
```

#### Reglas Principales
- Usar Emotion styled para componentes con estilos
- Aprovechar el sistema de temas de MUI
- Mantener consistencia en el espaciado usando theme.spacing()
- Seguir el sistema de diseño establecido
- Evitar estilos en línea

#### Ejemplos de Buenas Prácticas

```typescript
// Componente con estilos
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

// Variantes con props
const Button = styled('button')<{ variant?: 'primary' | 'secondary' }>(
  ({ theme, variant = 'primary' }) => ({
    padding: theme.spacing(1, 2),
    backgroundColor: variant === 'primary' 
      ? theme.palette.primary.main 
      : theme.palette.secondary.main,
    color: theme.palette.common.white,
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: variant === 'primary'
        ? theme.palette.primary.dark
        : theme.palette.secondary.dark,
    },
  })
);

// Responsive design
const ResponsiveGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));
```

## Flujo de Trabajo Git

### Ramas
- `main`: Producción
- `develop`: Desarrollo
- `feature/*`: Nuevas características
- `fix/*`: Correcciones
- `release/*`: Preparación para release

### Commits
```bash
# Formato
<tipo>(<alcance>): <descripción>

# Ejemplos
feat(auth): implementar autenticación con JWT
fix(ui): corregir alineación en tabla principal
```

### Pull Requests
- Título descriptivo
- Descripción detallada
- Referencias a issues
- Checklist de cambios
- Screenshots (si aplica)

## Testing

### Pruebas Unitarias
```typescript
describe('UserService', () => {
  it('should return user data', async () => {
    const result = await UserService.getData(1);
    expect(result).toHaveProperty('id');
  });
});
```

### Pruebas de Integración
- Probar flujos completos
- Simular interacciones de usuario
- Verificar integración entre componentes

## Manejo de Estado

### Context API
```typescript
// ✅ Correcto
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### React Query
```typescript
// ✅ Correcto
const { data, isLoading } = useQuery(['users'], fetchUsers);
```

## Manejo de Errores

```typescript
try {
  await api.post('/data');
} catch (error) {
  if (error instanceof ApiError) {
    handleApiError(error);
  } else {
    logError(error);
  }
}
```

## Performance

### Optimizaciones
- Implementar lazy loading
- Usar memorización (useMemo, useCallback)
- Optimizar imágenes
- Implementar SSR cuando sea posible

### Monitoreo
- Usar herramientas de análisis
- Monitorear tiempos de carga
- Revisar métricas de rendimiento

## Seguridad

### Prácticas
- Validar todas las entradas
- Usar HTTPS
- Implementar rate limiting
- Seguir principios OWASP

## Documentación

### Código
```typescript
/**
 * Procesa datos del usuario
 * @param {UserData} data - Datos del usuario
 * @returns {Promise<ProcessedData>} Datos procesados
 */
```

### API
- Documentar endpoints
- Incluir ejemplos de uso
- Documentar tipos de datos
- Mantener changelog

## Despliegue

### Proceso
1. Pruebas locales
2. Review en desarrollo
3. QA en staging
4. Despliegue a producción

### Verificaciones
- Tests pasando
- Build exitoso
- No hay conflictos
- Documentación actualizada

## Instalación y Configuración de Dependencias

### Requisitos Previos
```bash
# Versiones requeridas
Node.js >= 18.0.0
pnpm >= 8.9.0
```

### Instalación Inicial
```bash
# Instalar pnpm si no está instalado
npm install -g pnpm

# Instalar dependencias del proyecto
pnpm install

# Configurar husky para commits
pnpm prepare
```

### Configuración del Entorno
1. Crear archivo `.env` basado en `.env.example`
2. Configurar variables de entorno necesarias:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://user:password@localhost:5432/siprod"
   
   # JWT
   JWT_SECRET="tu-secreto-seguro"
   
   # API Keys
   MAPBOX_TOKEN="tu-token-de-mapbox"
   ```

### Scripts Principales
```bash
# Desarrollo
pnpm dev          # Inicia todos los servicios
pnpm dev:web      # Solo frontend
pnpm dev:api      # Solo backend

# Build
pnpm build        # Construye todo el proyecto
pnpm build:web    # Solo frontend
pnpm build:api    # Solo backend

# Testing
pnpm test         # Ejecuta todos los tests
pnpm test:watch   # Modo watch
pnpm test:coverage # Cobertura

# Linting
pnpm lint         # Ejecuta ESLint
pnpm format       # Ejecuta Prettier
```

### Gestión de Dependencias

#### Agregar Dependencias
```bash
# Dependencia workspace
pnpm add -w package-name

# Dependencia específica
pnpm add package-name --filter @siprod/web
```

#### Actualizar Dependencias
```bash
# Verificar actualizaciones
pnpm outdated

# Actualizar específica
pnpm update package-name

# Actualizar todas
pnpm update
```

### Configuración de IDE Recomendada

#### VS Code
Extensiones recomendadas:
- ESLint
- Prettier
- TypeScript + JavaScript
- Material Icon Theme
- GitLens
- vscode-styled-components

Configuración workspace:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Herramientas de Desarrollo

#### Base de Datos
```bash
# Prisma
pnpm dlx prisma generate    # Generar cliente
pnpm dlx prisma db push     # Sincronizar schema
pnpm dlx prisma studio      # UI de administración

# Drizzle
pnpm db:generate           # Generar migraciones
pnpm db:migrate           # Aplicar migraciones
pnpm db:studio            # UI de administración
```

#### Documentación API
```bash
# Generar documentación
pnpm docs:generate

# Servir documentación
pnpm docs:serve
```

#### Análisis de Bundle
```bash
# Analizar bundle de Next.js
ANALYZE=true pnpm build:web
```

## Recursos y Herramientas

### Desarrollo
- VS Code + extensiones recomendadas
- Postman para pruebas de API
- Chrome DevTools

### Documentación
- Confluence
- Swagger/OpenAPI
- Storybook para componentes

## Contacto y Soporte

- Slack: #siprod-dev
- Email: soporte@siprod.com
- Wiki: [link-to-wiki]

## Actualizaciones

Este documento se actualiza regularmente. Verificar la fecha de última actualización en el control de versiones.
