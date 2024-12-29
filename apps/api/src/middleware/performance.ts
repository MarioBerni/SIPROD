import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { logger } from '../utils/logger';

interface PerformanceMetrics {
  path: string;
  method: string;
  duration: number;
  timestamp: Date;
}

const metrics: PerformanceMetrics[] = [];

export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    logger.info(`Request completed in ${duration.toFixed(2)}ms`);
    
    // Almacenar métricas para análisis posterior
    metrics.push({
      path: req.path,
      method: req.method,
      duration,
      timestamp: new Date()
    });
  });

  next();
};
