import promClient from 'prom-client';
import { Express, Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

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
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Incrementar conexiones activas
  activeConnections.inc();
  
  // Cuando la respuesta termine
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      path,
      status: res.statusCode,
    };

    // Incrementar contador
    httpRequestsTotal.inc(labels);

    // Observar duración
    httpRequestDurationSeconds.observe(labels, duration / 1000);

    // Decrementar conexiones activas
    activeConnections.dec();

    // Log
    logger.info('Request metrics', {
      ...labels,
      duration,
    });
  });

  next();
};

// Configuración de endpoint de métricas
export const setupMetrics = (app: Express) => {
  app.get('/metrics', async (req: Request, res: Response) => {
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
  recordDbQuery: (operation: string, table: string, duration: number) => {
    dbQueryDurationMs.observe({ operation, table }, duration);
  },
  
  recordCacheHit: (cacheType: string) => {
    cacheHits.inc({ cache_type: cacheType });
  },
  
  recordCacheMiss: (cacheType: string) => {
    cacheMisses.inc({ cache_type: cacheType });
  },
};
