import promClient from 'prom-client';
import { Express, Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Crear registro de métricas
const register = new promClient.Registry();

// Colector de métricas por defecto
promClient.collectDefaultMetrics({
  register,
  prefix: 'siprod_',
});

// Contador de solicitudes HTTP
const httpRequestsTotal = new promClient.Counter({
  name: 'siprod_http_requests_total',
  help: 'Total de solicitudes HTTP',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
});

// Histograma de duración de solicitudes
const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'siprod_http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 20],
  registers: [register],
});

// Medidor de conexiones activas
const activeConnections = new promClient.Gauge({
  name: 'siprod_active_connections',
  help: 'Conexiones activas actuales',
  registers: [register],
});

// Métricas de base de datos
const dbQueryDurationMs = new promClient.Histogram({
  name: 'siprod_db_query_duration_ms',
  help: 'Duración de consultas de base de datos en milisegundos',
  labelNames: ['operation', 'table'],
  buckets: [1, 5, 15, 50, 100, 200, 500],
  registers: [register],
});

// Métricas de caché
const cacheHits = new promClient.Counter({
  name: 'siprod_cache_hits_total',
  help: 'Total de aciertos en caché',
  labelNames: ['cache_type'],
  registers: [register],
});

const cacheMisses = new promClient.Counter({
  name: 'siprod_cache_misses_total',
  help: 'Total de fallos en caché',
  labelNames: ['cache_type'],
  registers: [register],
});

// Middleware para métricas de solicitudes
export const metricsMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();
  
  // Incrementar conexiones activas
  activeConnections.inc();
  
  // Cuando la respuesta termine
  res.on('finish', () => {
    const duration = getDurationInMilliseconds(start);
    const path = _req.route ? _req.route.path : _req.path;
    const labels = {
      method: _req.method,
      path,
      status: res.statusCode.toString(),
    };

    // Decrementar conexiones activas
    activeConnections.dec();
    
    // Registrar duración y contador de solicitudes
    httpRequestDurationSeconds.observe(labels, duration / 1000);
    httpRequestsTotal.inc(labels);
    
    // Log de métricas si es necesario
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('Request metrics:', {
        duration,
        ...labels
      });
    }
  });

  next();
};

function getDurationInMilliseconds(start: [number, number]): number {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

// Configuración de endpoint de métricas
export const setupMetrics = (app: Express): void => {
  app.get('/metrics', async (_req: Request, res: Response): Promise<void> => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      logger.error('Error collecting metrics', { error });
      res.status(500).end();
    }
  });

  logger.info('Metrics endpoint configured at /metrics');
};

// Exportar funciones de utilidad para métricas
export const metrics = {
  recordDbQuery: (operation: string, table: string, duration: number): void => {
    dbQueryDurationMs.observe({ operation, table }, duration);
  },
  
  recordCacheHit: (cacheType: string): void => {
    cacheHits.inc({ cache_type: cacheType });
  },
  
  recordCacheMiss: (cacheType: string): void => {
    cacheMisses.inc({ cache_type: cacheType });
  },
};
