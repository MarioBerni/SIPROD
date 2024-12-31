import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno antes que nada
const envPath = process.env.NODE_ENV === 'production' 
  ? resolve(process.cwd(), '../../.env.production')
  : resolve(process.cwd(), '../../.env');

config({ path: envPath });

// Importar el validador después de cargar las variables
import { env } from './config/env.validator';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';
import routes from './routes';
import configureSecurityMiddleware from './middleware/security';
import { PrismaClient } from '@prisma/client';

const _app = express();
const _port = env.PORT;
const _API_PREFIX = env.API_PREFIX || '/api';

const prisma = new PrismaClient();

async function testDatabaseConnection(): Promise<void> {
  try {
    logger.info('Verificando conexión a la base de datos...');
    logger.info('DATABASE_URL:', env.DATABASE_URL);
    logger.info('Ambiente:', env.NODE_ENV);
    
    await prisma.$connect();
    logger.info('Conexión a la base de datos exitosa');
    
    // Verificar si hay usuarios en la base de datos
    const userCount = await prisma.user.count();
    logger.info(`Número de usuarios en la base de datos: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true
        }
      });
      logger.info('Usuarios encontrados:', users);
    }
  } catch (error) {
    logger.error('Error al conectar con la base de datos:', error);
    // Mostrar más detalles del error
    if (error instanceof Error) {
      logger.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    process.exit(1);
  }
}

// Asegurarnos de que la base de datos esté conectada antes de iniciar el servidor
testDatabaseConnection()
  .then(() => {
    // 1. Configurar middlewares de seguridad
    configureSecurityMiddleware(_app);

    // 2. CORS
    _app.use(cors({
      origin: env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // 3. Middleware
    _app.use(express.json());
    _app.use(cookieParser());
    _app.use(morgan('combined'));

    // 4. Logging middleware
    _app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.info(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });

    // Middleware de logging para debugging
    _app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.debug(`[${req.method}] ${req.path}`);
      next();
    });

    // 5. Health Check
    _app.get(`${_API_PREFIX}/health`, (_req: Request, res: Response) => {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // 6. API Routes
    _app.use(_API_PREFIX, routes);

    // 7. 404 handler
    _app.use((_req: Request, _res: Response, next: NextFunction) => {
      next(AppError.notFound(`Route not found`, 'ROUTE_NOT_FOUND'));
    });

    interface ApiError extends Error {
      statusCode?: number;
      details?: Record<string, unknown>;
    }

    // Error handling mejorado
    _app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      const details = err.details || {};
      
      logger.error('Error Handler:', {
        statusCode,
        message,
        details,
        stack: err.stack
      });

      return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        details,
        timestamp: new Date().toISOString()
      });
    });

    // Iniciar servidor
    const server = _app.listen(_port, '0.0.0.0', () => {
      const host = env.NODE_ENV === 'production' ? '179.27.203.219' : '127.0.0.1';
      logger.info(`Server running on port ${_port} in ${env.NODE_ENV || 'development'} mode`);
      logger.info(`Health check endpoint: http://${host}:${_port}${_API_PREFIX}/health`);
      logger.info(`API endpoint: http://${host}:${_port}${_API_PREFIX}`);
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
    function shutdown() {
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    }

    process.on('SIGTERM', () => {
      console.info('SIGTERM recibido. Cerrando servidor...');
      shutdown();
    });

    process.on('SIGINT', () => {
      console.info('SIGINT recibido. Cerrando servidor...');
      shutdown();
    });
  })
  .catch((error: Error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });

export default _app;
