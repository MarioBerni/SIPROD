import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/error';
import routes from './routes';
import configureSecurityMiddleware from './middleware/security';
import logger from './utils/logger';
import { AppError } from './utils/errors';

const app = express();
const port = Number(process.env.PORT) || 4000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// 1. Configurar middlewares de seguridad (incluye cors, helmet, rate limit)
configureSecurityMiddleware(app);

// 2. Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// 3. Health Check
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  logger.info('Health check endpoint called');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// 4. API Routes
app.use(API_PREFIX, routes);

// 5. 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Route ${req.url} not found`, 'ROUTE_NOT_FOUND'));
});

// 6. Error handler (siempre al final)
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(port, '0.0.0.0', () => {
  const host = process.env.NODE_ENV === 'production' ? '179.27.203.219' : '127.0.0.1';
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`Health check endpoint: http://${host}:${port}${API_PREFIX}/health`);
  logger.info(`API endpoint: http://${host}:${port}${API_PREFIX}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logger.error('Unhandled Rejection:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;
