import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { metricsMiddleware, setupMetrics } from './middleware/metrics';
import { errorHandler } from './middleware/error';
import router from './routes';

const _app: Express = express();
const API_PREFIX = process.env.API_PREFIX || '/api';

// Middlewares básicos
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));
_app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
_app.use(helmet());
_app.use(compression());

// Rate limiting
_app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
}));

// Métricas
_app.use(metricsMiddleware);
setupMetrics(_app);

// Health Check endpoint
_app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// Root API endpoint
_app.get(API_PREFIX, (_req, res) => {
  res.json({ 
    message: 'SIPROD API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
_app.use(API_PREFIX, router);

// Middleware para manejar errores 404
_app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
_app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: 'Error interno del servidor' });
  _next();
});

// Manejador de errores
_app.use(errorHandler);

export default _app;
