import helmet from 'helmet';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

const configureSecurityMiddleware = (app: Express): void => {
  // Configuración básica de seguridad con Helmet
  app.use(helmet());

  // Configuración de CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Parseo de JSON y límites
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate Limiting
  const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana
    message: { 
      error: 'Demasiadas solicitudes, por favor intente más tarde.' 
    },
    handler: (_req: Request, res: Response) => {
      logger.warn('Rate limit excedido');
      res.status(429).json({ 
        error: 'Demasiadas solicitudes, por favor intente más tarde.' 
      });
    }
  });
  app.use(rateLimiter);

  // Otras medidas de seguridad
  app.disable('x-powered-by');
  
  logger.info('Security middleware configured');
};

export default configureSecurityMiddleware;
