import compression from 'compression';
import { Express, Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Configuración de compresión
const shouldCompress = (req: Request, res?: Response) => {
  // No comprimir si el cliente no lo acepta
  if (req.headers['x-no-compression']) {
    return false;
  }
  
  // Usar compresión por defecto
  return res ? compression.filter(req, res) : false;
};

const compressionConfig = {
  level: 6, // Nivel de compresión (1-9, siendo 9 el máximo)
  threshold: '1kb', // Comprimir solo respuestas mayores a 1kb
  filter: shouldCompress,
};

type CacheConfigType = {
  maxAge: number;
  immutable?: boolean;
  noStore?: boolean;
};

// Configuración de cache-control
const cacheConfig: Record<string, CacheConfigType> = {
  public: {
    maxAge: 86400000, // 24 horas
    immutable: true,
  },
  private: {
    maxAge: 3600000, // 1 hora
    noStore: false,
  },
  dynamic: {
    maxAge: 0,
    noStore: true,
  },
};

// Middleware para configurar cache-control según el tipo de ruta
const setCacheHeaders = (type: 'public' | 'private' | 'dynamic') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const config = cacheConfig[type];
    
    if (config.noStore) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    } else {
      const directives = [
        config.immutable ? 'immutable' : null,
        'max-age=' + Math.floor(config.maxAge / 1000),
      ].filter(Boolean);
      
      res.set('Cache-Control', directives.join(', '));
    }
    
    next();
  };
};

interface PerformanceMetrics extends Record<string, unknown> {
  path: string;
  method: string;
  duration: number;
  timestamp: string;
  statusCode: number;
}

type ResponseEndCallback = () => void;
type ResponseData = string | Buffer | object | null;

type CustomResponse = Response & {
  end(cb?: ResponseEndCallback): CustomResponse;
  end(chunk: ResponseData, cb?: ResponseEndCallback): CustomResponse;
  end(chunk: ResponseData, encoding: BufferEncoding, cb?: ResponseEndCallback): CustomResponse;
};

const metrics: PerformanceMetrics[] = [];

const performanceMiddleware = (
  req: Request,
  res: CustomResponse,
  next: NextFunction
) => {
  const start = process.hrtime();

  // Capturar el método original de res.end
  const originalEnd = res.end;

  // Sobreescribir res.end
  res.end = function(
    chunk?: ResponseData,
    encoding?: BufferEncoding | ResponseEndCallback,
    cb?: ResponseEndCallback
  ): CustomResponse {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convertir a milisegundos

    const metric: PerformanceMetrics = {
      path: req.path,
      method: req.method,
      duration: time,
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode
    };

    metrics.push(metric);
    logger.debug('Performance metric recorded', metric);

    // Manejar los diferentes casos de argumentos
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = undefined;
    }

    // Asegurar que el callback siempre sea una función
    const finalCallback = cb ?? function noop() { /* callback vacío */ };

    // Llamar al método original con los argumentos correctos
    if (chunk !== undefined) {
      if (typeof encoding === 'string') {
        return originalEnd.call(res, chunk, encoding as BufferEncoding, finalCallback);
      } else {
        return originalEnd.call(res, chunk, 'utf8', finalCallback);
      }
    } else {
      return originalEnd.call(res, '', 'utf8', finalCallback);
    }
  };

  next();
};

export const configurePerformance = (app: Express): void => {
  // Aplicar compresión gzip/deflate
  app.use(compression(compressionConfig));
  
  // Configurar rutas estáticas con cache público
  app.use('/static', setCacheHeaders('public'));
  
  // Configurar rutas de API con cache privado
  app.use('/api', setCacheHeaders('private'));
  
  // Configurar rutas dinámicas sin cache
  app.use('/api/auth', setCacheHeaders('dynamic'));
  
  // Aplicar middleware de rendimiento
  app.use(performanceMiddleware);
  
  logger.info('Performance middleware configured', {
    compression: {
      level: compressionConfig.level,
      threshold: compressionConfig.threshold,
    },
    cache: {
      public: `${cacheConfig.public.maxAge}ms`,
      private: `${cacheConfig.private.maxAge}ms`,
    },
  });
};
