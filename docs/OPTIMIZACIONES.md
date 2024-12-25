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

## 📋 Índice
1. [Frontend](#frontend)
2. [Backend](#backend)
3. [Base de Datos](#base-de-datos)
4. [Infraestructura](#infraestructura)
5. [Monitoreo](#monitoreo)

## 🌐 Frontend

### Next.js Optimizaciones

#### 1. Server Components
```typescript
// Usar Server Components por defecto
// pages/dashboard.tsx
export default async function Dashboard() {
  const data = await fetchData() // Directamente en el componente
  return <DashboardLayout data={data} />
}
```

#### 2. Bundle Size
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
    optimizeFonts: true
  }
})
```

#### 3. Image Optimization
```typescript
import Image from 'next/image'

export default function OptimizedImage() {
  return (
    <Image
      src="/large-image.jpg"
      alt="Optimized"
      width={800}
      height={600}
      placeholder="blur"
      priority={true}
    />
  )
}
```

#### 4. Code Splitting
```typescript
// Lazy loading de componentes pesados
const HeavyComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

### React Optimizaciones

#### 1. Memo y Callbacks
```typescript
import { memo, useCallback } from 'react'

const ExpensiveComponent = memo(({ onAction }) => {
  return <button onClick={onAction}>Action</button>
})

const Parent = () => {
  const handleAction = useCallback(() => {
    // Lógica
  }, [])

  return <ExpensiveComponent onAction={handleAction} />
}
```

#### 2. Virtual Scrolling
```typescript
import { VirtualList } from '@tanstack/virtual-core'

function VirtualizedList({ items }) {
  return (
    <VirtualList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width={600}
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </VirtualList>
  )
}
```

## 🔧 Backend

### Express Optimizaciones

#### 1. Compression
```typescript
import compression from 'compression'

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  },
  level: 6
}))
```

#### 2. Caching
```typescript
import { createClient } from 'redis'

const redis = createClient()

async function cacheMiddleware(req, res, next) {
  const key = req.originalUrl
  const cached = await redis.get(key)
  
  if (cached) {
    return res.json(JSON.parse(cached))
  }
  
  res.sendResponse = res.json
  res.json = (body) => {
    redis.setEx(key, 3600, JSON.stringify(body))
    res.sendResponse(body)
  }
  
  next()
}
```

#### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  message: 'Too many requests'
})

app.use('/api/', limiter)
```

### Node.js Optimizaciones

#### 1. Cluster Mode
```typescript
import cluster from 'cluster'
import os from 'os'

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  // Aplicación
}
```

#### 2. Memory Management
```typescript
// Configuración de PM2
module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=2048'
  }]
}
```

## 🗄 Base de Datos

### PostgreSQL Optimizaciones

#### 1. Índices
```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_reports_date ON reports(created_at);

-- Índices parciales
CREATE INDEX idx_active_users 
ON users(id) 
WHERE active = true;

-- Índices compuestos
CREATE INDEX idx_reports_user_date 
ON reports(user_id, created_at);
```

#### 2. Particionamiento
```sql
-- Particionar por fecha
CREATE TABLE reports (
    id SERIAL,
    created_at TIMESTAMP,
    data JSONB
) PARTITION BY RANGE (created_at);

-- Crear particiones
CREATE TABLE reports_2024_q1 PARTITION OF reports
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
```

#### 3. Query Optimization
```sql
-- Analizar queries lentas
SELECT 
    (total_time / 1000 / 60) as total_minutes,
    (total_time/calls) as avg_time,
    calls,
    query
FROM pg_stat_statements
ORDER BY avg_time DESC
LIMIT 10;

-- Vacuum regular
VACUUM ANALYZE;
```

### Prisma Optimizaciones

#### 1. Batch Operations
```typescript
// Usar createMany en lugar de múltiples create
await prisma.user.createMany({
  data: users,
  skipDuplicates: true
})

// Transacciones para operaciones múltiples
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.profile.create({ data: profileData })
])
```

#### 2. Query Optimization
```typescript
// Seleccionar solo campos necesarios
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
})

// Usar includes con cuidado
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      take: 5,
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

## 🏗 Infraestructura

### Nginx Optimizaciones

#### 1. Caching
```nginx
# /etc/nginx/nginx.conf
http {
    proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
    
    server {
        location / {
            proxy_cache my_cache;
            proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
            proxy_cache_valid 200 60m;
        }
    }
}
```

#### 2. Gzip Compression
```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
  application/javascript
  application/json
  application/x-javascript
  text/css
  text/javascript
  text/plain;
```

### Redis Optimizaciones

#### 1. Configuración
```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
```

#### 2. Patrones de Uso
```typescript
// Cachear resultados con TTL
await redis.setEx('key', 3600, JSON.stringify(data))

// Pipeline para múltiples operaciones
const pipeline = redis.pipeline()
keys.forEach(key => pipeline.get(key))
const results = await pipeline.exec()
```

## 📊 Monitoreo

### Métricas Clave

#### 1. Frontend
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

#### 2. Backend
- Response Time
- Error Rate
- Request Rate
- CPU Usage
- Memory Usage

#### 3. Base de Datos
- Query Performance
- Connection Pool Usage
- Cache Hit Ratio
- Index Usage
- Table Size

### Herramientas de Monitoreo

#### 1. PM2
```bash
# Monitoreo en tiempo real
pm2 monit

# Métricas detalladas
pm2 plus
```

#### 2. Prometheus + Grafana
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  - job_name: 'api'
    static_configs:
      - targets: ['localhost:9090']
```

## 📈 Benchmarking

### Frontend
```bash
# Lighthouse CLI
lighthouse https://siprod.example.com --output json --output-path ./report.json

# WebPageTest
npx webpagetest test https://siprod.example.com
```

### Backend
```bash
# Artillery para pruebas de carga
artillery run load-test.yml

# AutoCannon para benchmarks HTTP
autocannon -c 100 -d 30 http://localhost:4000/api/endpoint
```

### Base de Datos
```sql
-- pgbench para PostgreSQL
pgbench -i -s 50 siprod
pgbench -c 10 -j 2 -T 60 siprod
