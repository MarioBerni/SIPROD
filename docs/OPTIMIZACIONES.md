# Guía de Optimizaciones SIPROD

## Configuración del Bundle Analyzer

Para analizar el tamaño del bundle:

```bash
# Generar reporte
ANALYZE=true pnpm build

# Ver reporte
open apps/web/.next/analyze/client.html
```

## Lazy Loading de Componentes

### Configuración Básica
```typescript
// optimization.ts
import { lazy } from 'react';

const DashboardLayout = lazy(() => import('@siprod/ui').then(mod => ({ 
  default: mod.DashboardLayout 
})));
```

### Preload de Componentes
```typescript
// optimization.ts
export const preloadComponents = (components: string[]) => {
  components.forEach((component) => {
    const importFn = dynamicImports[component];
    importFn.preload?.();
  });
};
```

## Optimización de Webpack

### Split Chunks
```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
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
    return config;
  }
};
```

## Tipado Estricto

### Analytics Provider
```typescript
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

## Caché y Headers

### Recursos Estáticos
```javascript
// next.config.js
module.exports = {
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
};
```

## Mejores Prácticas

1. **Code Splitting**
   - Usar dynamic imports para rutas
   - Implementar lazy loading para componentes grandes
   - Configurar preload para componentes críticos

2. **Optimización de Bundle**
   - Monitorear tamaño del bundle con analyzer
   - Mantener chunks pequeños (< 70KB)
   - Separar código común en chunks reutilizables

3. **Tipado**
   - Evitar `any` types
   - Usar interfaces específicas
   - Implementar type guards cuando sea necesario

4. **Caché**
   - Configurar caché para recursos estáticos
   - Implementar estrategias de revalidación
   - Usar stale-while-revalidate cuando sea apropiado

## Métricas y Monitoreo

### Métricas Clave
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- First Input Delay (FID)

### Herramientas
- Lighthouse
- Web Vitals
- Bundle Analyzer
- Chrome DevTools Performance

## Próximos Pasos

1. Implementar React Server Components
2. Optimizar rutas dinámicas
3. Mejorar estrategias de caché
4. Implementar remote caching para CI/CD
5. Analizar y optimizar dependencias
