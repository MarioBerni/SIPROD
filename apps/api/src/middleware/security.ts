import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express, { Express } from 'express';
import { errorHandler } from './error';
import { AppError } from '../utils/errors';

const configureSecurityMiddleware = (app: Express): void => {
  // Configuración básica de seguridad con Helmet
  app.use(helmet());

  // Configuración de CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 600
  }));

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate Limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      const error = AppError.tooManyRequests('Too many requests', 'RATE_LIMIT_EXCEEDED', {
        resetTime: new Date(Date.now() + 15 * 60 * 1000),
        limit: 100
      });
      errorHandler(error, req, res, next);
    }
  }));

  // Otras medidas de seguridad
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
};

export default configureSecurityMiddleware;
