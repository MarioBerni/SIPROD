import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { metricsMiddleware, setupMetrics } from './middleware/metrics';
import { errorHandler } from './middleware/error';
import router from './routes';
import authRoutes from './routes/auth';
import userRoutes from './routes/user.routes';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

const _app: Express = express();
const API_PREFIX = process.env.API_PREFIX || '/api';

// Middlewares básicos
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));
_app.use(cookieParser()); // Agregar cookie-parser antes de CORS

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
};

_app.use(cors(corsOptions));

// Configurar headers de seguridad
_app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

_app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

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
    status: 'ok',
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
_app.use(`${API_PREFIX}/auth`, authRoutes);
_app.use(`${API_PREFIX}/users`, userRoutes);

// Middleware para manejar errores 404
_app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
_app.use((error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no manejado:', error);
  res.status(error.statusCode || 500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Manejador de errores
_app.use(errorHandler);

export { _app };
export default _app;
