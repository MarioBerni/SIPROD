import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { metricsMiddleware, setupMetrics } from './middleware/metrics';
import { errorHandler } from './middleware/error';
import router from './routes';

const app: Express = express();
const API_PREFIX = process.env.API_PREFIX || '/api';

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(compression());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
}));

// Métricas
app.use(metricsMiddleware);
setupMetrics(app);

// Health Check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// Root API endpoint
app.get(API_PREFIX, (req, res) => {
  res.json({ 
    message: 'SIPROD API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use(API_PREFIX, router);

// Manejador de errores
app.use(errorHandler);

export default app;
