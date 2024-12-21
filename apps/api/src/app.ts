import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { metricsMiddleware, setupMetrics } from './middleware/metrics';
import { errorHandler } from './middleware/error';
import authRouter from './routes/auth';

const app: Express = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/auth', authRouter);

// Manejador de errores
app.use(errorHandler);

// Exportar la app
export { app };
