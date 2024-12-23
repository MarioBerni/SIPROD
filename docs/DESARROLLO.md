# Guía de Desarrollo SIPROD

## Entorno de Desarrollo

### Configuración del Entorno
1. **Requisitos del Sistema**
   - Node.js 18 o superior
   - PNPM 8.6 o superior
   - PostgreSQL 15 o superior
   - PM2 (instalación global)

2. **Extensiones VS Code Esenciales**
   - ESLint
   - Prettier
   - TypeScript + JavaScript
   - Prisma
   - GitLens
   - Error Lens

3. **Configuración de Desarrollo**
   ```bash
   # Clonar repositorio
   git clone https://[repositorio]/siprod.git
   cd siprod

   # Instalar PM2 globalmente
   npm install -g pm2

   # Instalar dependencias
   pnpm install

   # Configurar variables de entorno
   cp .env.example .env

   # Configurar la base de datos
   pnpm --filter @siprod/api prisma:generate
   pnpm --filter @siprod/api prisma:migrate

   # Iniciar servicios de desarrollo
   pm2 start ecosystem.local.config.js
   ```

## Estándares y Mejores Prácticas

### TypeScript
- Strict mode obligatorio
- Tipos explícitos para APIs públicas
- Interfaces para contratos públicos
- Types para implementaciones internas
- Documentación TSDoc completa
- No any sin justificación

### React y Next.js
- Server Components por defecto
- Client Components solo cuando necesario
- Hooks personalizados para lógica reutilizable
- Patrón de composición sobre herencia
- Lazy loading para optimización
- Manejo de estado distribuido

### Testing
- Jest para unit testing
- React Testing Library para componentes
- Cypress para E2E
- MSW para mocking de API
- Cobertura mínima: 80%

### Seguridad
- OWASP Top 10 compliance
- Sanitización de inputs
- Rate limiting
- CORS configurado
- Headers de seguridad
- Auditoría regular de dependencias

### Performance
- Lighthouse score >90
- Bundle size monitoring
- Code splitting automático
- Optimización de imágenes
- Caché agresivo
- Lazy loading de recursos

## Herramientas de Desarrollo

### CLI Interactivo
```bash
node scripts/dev.js
```
Proporciona una interfaz para:
- Iniciar servicios específicos
- Ejecutar comandos de desarrollo
- Ver estado del proyecto
- Gestionar base de datos

### Scripts Principales
- `pnpm dev`: Iniciar todos los servicios
- `pnpm test`: Ejecutar pruebas
- `pnpm build`: Construir para producción
- `pnpm lint`: Ejecutar linting
- `pnpm db:studio`: Abrir Prisma Studio

## Arquitectura

### Frontend (Next.js)
- App Router
- Server Components
- Tailwind CSS
- SWC para compilación
- Optimizaciones automáticas

### Backend (Express)
- Arquitectura por capas
- Middleware modular
- Validación con Zod
- Caché y optimizaciones
- Métricas y logging

### Base de Datos
- Prisma como ORM
- Migraciones automáticas
- Seeds para desarrollo
- Studio para gestión

## Optimizaciones Recientes

### Configuración de Bundle
- Implementado análisis de bundle con `@next/bundle-analyzer`
- Optimización de chunks con configuración personalizada en `next.config.js`
- Code splitting mejorado para componentes y módulos

### Lazy Loading y Dynamic Imports
Se ha implementado una estrategia de carga optimizada:

```typescript
// Configuración en optimization.ts
const dynamicImports = {
  DashboardLayout: lazy(() => import('@siprod/ui').then(mod => ({ default: mod.DashboardLayout }))),
  DashboardStats: lazy(() => import('@siprod/ui').then(mod => ({ default: mod.DashboardStats }))),
  // ...otros componentes
};

// Configuración de preload
export const preloadComponents = (components: Array<keyof typeof dynamicImports>) => {
  components.forEach((component) => {
    const importFn = dynamicImports[component];
    importFn.preload?.();
  });
};
```

### Mejoras de Tipado
Se han fortalecido los tipos en varios componentes:

```typescript
// Ejemplo en AnalyticsProvider
type GTagEvent = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: GTagEvent) => void;
  trackPageView: (path: string) => void;
}
```

### Optimizaciones de Webpack
```javascript
// next.config.js
config.optimization.splitChunks = {
  chunks: 'all',
  minSize: 20000,
  maxSize: 70000,
  minChunks: 1,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  cacheGroups: {
    common: {
      name: 'common',
      minChunks: 2,
      priority: 10,
      reuseExistingChunk: true,
      enforce: true
    },
    components: {
      name: 'components',
      test: /[\\/]components[\\/]/,
      minChunks: 1,
      priority: 20,
    },
    vendor: {
      name: 'vendor',
      test: /[\\/]node_modules[\\/]/,
      priority: 30,
      reuseExistingChunk: true
    }
  }
};
```

### Caché y Headers
```javascript
// Configuración de caché para recursos estáticos
async headers() {
  return [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    }
  ];
}
```

## Testing

### Frontend
```bash
# Ejecutar tests de web
pnpm --filter @siprod/web test

# Watch mode
pnpm --filter @siprod/web test:watch
```
- Jest + Testing Library
- Pruebas de componentes
- Pruebas de integración
- Mocks y fixtures

### Backend
```bash
# Ejecutar tests de API
pnpm --filter @siprod/api test

# Cobertura
pnpm --filter @siprod/api test:coverage
```
- Jest
- Supertest para API
- Mocks de servicios
- Base de datos de prueba

## CI/CD

### GitHub Actions
- Lint y tipos en PRs
- Tests automáticos
- Build de verificación
- Análisis de dependencias

### Despliegue
- Proceso automatizado
- Verificaciones previas
- Rollback automático
- Notificaciones

## Monitoreo y Logs

### Logging
- Winston configurado
- Rotación de logs
- Niveles por ambiente
- Formato estructurado

### Métricas
- Endpoints personalizados
- Latencia y errores
- Uso de recursos
- Dashboard custom

## Seguridad

### Prácticas
- Validación de entrada
- Sanitización de datos
- Rate limiting
- CORS configurado
- Headers seguros

### Autenticación
- JWT
- Refresh tokens
- Roles y permisos
- Sesiones seguras

## Documentación

### API
- Swagger UI
- OpenAPI 3.0
- Ejemplos y schemas
- Autenticación documentada

### Código
- TSDoc en funciones
- README por package
- Diagramas actualizados
- Guías de migración

## Flujo de Trabajo Git

1. Crear rama feature:
```bash
git checkout -b feature/nombre-feature
```

2. Commit convencional:
```bash
git commit -m "feat: descripción del cambio"
```

Tipos de commit:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de estilo
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

3. Push y Pull Request:
```bash
git push origin feature/nombre-feature
# Crear PR en GitHub
```

## Despliegue

### Desarrollo

```bash
# Construir
pnpm build

# Iniciar con PM2
pm2 start ecosystem.local.config.js
```

### Producción

```bash
# Construir
pnpm build

# Iniciar con PM2
pm2 start ecosystem.config.js --env production
```

## Depuración

### Backend

1. Logs de PM2:
```bash
pm2 logs
```

2. Monitoreo:
```bash
pm2 monit
```

### Frontend

- Chrome DevTools
- React Developer Tools
- Next.js Debug Mode:
```bash
NODE_OPTIONS='--inspect' pnpm dev
```

## Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Prisma](https://www.prisma.io/docs)
- [Documentación PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
