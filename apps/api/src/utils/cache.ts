import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import logger from './logger';

// Configuración del caché en memoria
interface CacheConfig {
  stdTTL: number;
  checkperiod: number;
  useClones: boolean;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const defaultConfig: CacheConfig = {
  stdTTL: 600, // 10 minutos
  checkperiod: 120, // 2 minutos
  useClones: false,
};

class Cache {
  private cache: NodeCache;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.cache = new NodeCache(this.config);

    this.cache.on('expired', (key: string) => {
      logger.info('Cache item expired:', { key });
    });
  }

  public get<T>(key: string): T | undefined {
    const item = this.cache.get<CacheItem<T>>(key);
    return item?.data;
  }

  public set<T>(key: string, data: T, ttl?: number): boolean {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    return this.cache.set(key, item, ttl || this.config.stdTTL);
  }

  public delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach(k => this.cache.del(k));
    } else {
      this.cache.del(key);
    }
  }

  public clear(): void {
    this.cache.flushAll();
  }

  public middleware(options: { key?: string; ttl?: number } = {}) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = options.key || req.originalUrl;
      const cachedData = this.get(key);

      if (cachedData) {
        logger.debug('Cache hit:', { key });
        res.json(cachedData);
        return;
      }

      logger.debug('Cache miss:', { key });
      next();
    };
  }

  public getKeys(): string[] {
    return this.cache.keys();
  }

  public getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}

// Tipos de caché con diferentes TTL
export const CacheType = {
  SHORT: 300, // 5 minutos
  MEDIUM: 1800, // 30 minutos
  LONG: 3600, // 1 hora
  VERY_LONG: 86400, // 24 horas
} as const;

// Interfaz para opciones de caché
interface CacheOptions {
  ttl?: number;
  key?: string;
}

// Instancia global del caché
export const cache = new Cache();

/**
 * Decorador para cachear resultados de métodos
 */
export function Cached(options: CacheOptions = {}) {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = options.key || `${String(propertyKey)}:${JSON.stringify(args)}`;
      const cachedResult = cache.get(cacheKey);

      if (cachedResult !== undefined) {
        logger.debug('Cache hit', { key: cacheKey });
        return cachedResult;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result, options.ttl || CacheType.MEDIUM);
      logger.debug('Cache miss - stored new value', { key: cacheKey });

      return result;
    };

    return descriptor;
  };
}

/**
 * Middleware para cachear respuestas HTTP
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = options.key || `${req.url}:${JSON.stringify(req.query)}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.debug('Cache hit - HTTP response', { key });
      res.json(cachedResponse);
      return;
    }

    // Interceptar el método json original
    const originalJson = res.json;
    res.json = function(body: unknown) {
      cache.set(key, body, options.ttl || CacheType.MEDIUM);
      logger.debug('Cache miss - stored HTTP response', { key });
      return originalJson.call(this, body);
    };

    next();
  };
}

/**
 * Utilidad para invalidar caché
 */
export function invalidateCache(pattern?: string): void {
  if (pattern) {
    const keys = cache.getKeys().filter(key => key.includes(pattern));
    const count = keys.length;
    cache.delete(keys);
    logger.info('Cache invalidated by pattern', { pattern, count });
  } else {
    const count = cache.getKeys().length;
    cache.clear();
    logger.info('Cache completely flushed', { count });
  }
}

// Monitoreo del caché
setInterval(() => {
  const stats = cache.getStats();
  logger.info('Cache stats', {
    keys: cache.getKeys().length,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: stats.hits / (stats.hits + stats.misses),
  });
}, 300000); // Cada 5 minutos

export default Cache;
