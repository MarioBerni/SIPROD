# Optimizaciones - SIPROD

## Objetivo
Ofrecer un recetario de técnicas y consejos para mejorar el rendimiento y la escalabilidad de SIPROD en todos sus frentes (frontend, backend, base de datos e infraestructura).

## Función
- Enumerar optimizaciones de Next.js (code splitting, lazy loading, RSC, caching).
- Indicar mejoras de Express (gzip, rate limiting avanzado, logging de rendimiento).
- Describir patrones de caché y monitoreo (Redis, PM2, Prometheus/Grafana).

## 🌐 Frontend

### Next.js
```typescript
// Code Splitting
const DynamicComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Loading />,
  ssr: false
});

// Image Optimization
<Image
  src="/large.jpg"
  width={800}
  height={600}
  placeholder="blur"
  priority={true}
/>

// React Server Components
async function ServerComponent() {
  const data = await getData();
  return <div>{data}</div>;
}
```

### React Query
```typescript
// Optimized Data Fetching
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => getUser(id),
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000
});

// Prefetching
await queryClient.prefetchQuery({
  queryKey: ['user', id],
  queryFn: () => getUser(id)
});
```

### Bundle Size
```javascript
// Next.js Config
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks.chunks = 'all';
    return config;
  },
  experimental: {
    optimizeCss: true,
    optimizeImages: true
  }
};
```

### DataGrid Optimizations
```typescript
// Memoización de filas y columnas
const DataTable: React.FC<DataTableProps> = ({ rows, loading }) => {
  // Memoizar filas para evitar re-renders innecesarios
  const memoizedRows = useMemo(() => rows, [rows]);
  
  // Memoizar columnas con operadores de filtro personalizados
  const memoizedColumns = useMemo(() => columns.map(column => ({
    ...column,
    filterOperators: getCustomOperators(column.type),
  })), [columns]);

  // Configuración de paginación optimizada
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Manejador de cambios de paginación memoizado
  const handlePaginationModelChange = useCallback(
    (newModel: GridPaginationModel) => {
      setPaginationModel(newModel);
    },
    []
  );

  return (
    <DataGrid
      rows={memoizedRows}
      columns={memoizedColumns}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationModelChange}
      // ... otras props
    />
  );
};

// Operadores de filtro optimizados
const getCustomOperators = (type: string) => {
  switch (type) {
    case 'string':
      return customStringOperators;
    case 'date':
    case 'dateTime':
      return customDateOperators;
    case 'number':
      return customNumericOperators;
    default:
      return undefined;
  }
};
```

### Rendimiento del DataGrid
- Utilizar `paginationModel` para controlar el estado de paginación
- Implementar `useMemo` para filas y columnas
- Personalizar operadores de filtro por tipo de columna
- Usar `useCallback` para manejadores de eventos
- Configurar debounce en la búsqueda rápida

### Caché y Estado
```typescript
// Implementación de caché para datos de tabla
const useTableData = (queryKey: string) => {
  return useQuery({
    queryKey: ['tableData', queryKey],
    queryFn: () => fetchTableData(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Estado local optimizado
const useTableState = () => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });

  return {
    filterModel,
    setFilterModel,
    // ... otros estados
  };
};
```

## 🔧 Backend

### Express
```typescript
// Compression
app.use(compression({
  level: 6,
  threshold: 100 * 1000
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

### Caching
```typescript
// Redis Cache
const getUser = async (id: string) => {
  const cacheKey = `user:${id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  const user = await prisma.user.findUnique({ where: { id } });
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);
  
  return user;
};
```

### Logging
```typescript
// Winston Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log',
      level: 'error',
      maxsize: 5242880
    })
  ]
});
```

## 📊 Base de Datos

### Prisma
```typescript
// Optimized Queries
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true
  }
});

// Batch Operations
const users = await prisma.user.createMany({
  data: newUsers,
  skipDuplicates: true
});
```

### Índices
```sql
-- Índices Compuestos
CREATE INDEX idx_user_email_role 
ON users(email, role);

-- Índices Parciales
CREATE INDEX idx_active_users 
ON users(email) 
WHERE active = true;
```

### Optimización
```sql
-- Vacuum y Analyze
VACUUM ANALYZE users;

-- Reindex
REINDEX TABLE users;

-- Monitoreo de Queries
SELECT * FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;
```

## 📈 Monitoreo

### Prometheus
```typescript
// Métricas Personalizadas
const requestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    requestDuration.observe({
      method: req.method,
      route: req.route?.path,
      status_code: res.statusCode
    }, duration / 1000);
  });
  next();
});
```

### Grafana
```yaml
# Dashboard Config
panels:
  - title: API Response Time
    type: graph
    datasource: Prometheus
    targets:
      - expr: rate(http_request_duration_seconds_sum[5m])
  
  - title: Error Rate
    type: gauge
    datasource: Prometheus
    targets:
      - expr: sum(rate(http_requests_total{status=~"5.."}[5m]))
```

## 🔄 CI/CD

### GitHub Actions
```yaml
# Build Optimization
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/cache@v3
        with:
          path: |
            ~/.pnpm-store
            ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Build
        run: pnpm build
```

### Turborepo
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

## 📱 Mobile

### Responsive Design
```typescript
// Custom Hook
const useResponsive = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  return { isDesktop, isTablet };
};

// Component
const Layout = () => {
  const { isDesktop } = useResponsive();
  return (
    <div className={isDesktop ? 'desktop' : 'mobile'}>
      {/* Content */}
    </div>
  );
};
```

### PWA
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // Next.js config
});
