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

// Crear y configurar la instancia de Express
const app: Express = express();
const API_PREFIX = process.env.API_PREFIX || '/api';

// Configuración de trust proxy específica para Nginx
app.set('trust proxy', '127.0.0.1');
console.log('TRUST PROXY CONFIG:', {
  enabled: app.get('trust proxy'),
  env: process.env.NODE_ENV,
  file: __filename
});

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Agregar cookie-parser antes de CORS

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Configurar headers de seguridad
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(compression());

// Rate limiting con configuración personalizada
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  keyGenerator: (req) => {
    // Usar la IP que Express ha resuelto basándose en nuestra configuración de trust proxy
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    console.log('Rate Limit - IP:', {
      ip,
      forwarded: req.headers['x-forwarded-for'],
      real: req.connection.remoteAddress
    });
    return ip;
  },
  handler: (_req, res) => {
    res.status(429).json({
      message: 'Demasiadas solicitudes, por favor intente más tarde',
      nextValidRequest: new Date(Date.now() + 15 * 60 * 1000)
    });
  }
}));

// Métricas
app.use(metricsMiddleware);
setupMetrics(app);

// Health Check endpoint
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// Root API endpoint
app.get(API_PREFIX, (_req, res) => {
  res.json({ 
    message: 'SIPROD API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use(API_PREFIX, router);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/user`, userRoutes);

// Middleware para manejar errores 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
app.use((error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no manejado:', error);
  res.status(error.statusCode || 500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Manejador de errores
app.use(errorHandler);

export { app };
export default app;
