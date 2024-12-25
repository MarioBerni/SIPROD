import express from 'express';
import { errorHandler } from './middleware/error';
import routes from './routes';
import configureSecurityMiddleware from './middleware/security';
import logger from './utils/logger';

const app = express();
const port = Number(process.env.PORT) || 4000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// 1. Configurar middlewares de seguridad (incluye cors, helmet, rate limit)
configureSecurityMiddleware(app);

// 2. Logging middleware
app.use((req, res, next) => {
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// 3. Health Check
app.get(`${API_PREFIX}/health`, (req, res) => {
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
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// 6. Error handler (siempre al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  logger.info('Server started', {
    port,
    mode: process.env.NODE_ENV || 'development',
    healthCheck: `http://0.0.0.0:${port}${API_PREFIX}/health`,
    apiEndpoint: `http://0.0.0.0:${port}${API_PREFIX}`
  });
});
