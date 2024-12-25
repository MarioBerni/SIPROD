import { Router } from 'express';
import authRouter from './auth';
import { asyncErrorHandler } from '../middleware/error';

const router = Router();

// Ruta base
router.get('/', asyncErrorHandler(async (req, res) => {
  res.json({ 
    message: 'SIPROD API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}));

// Rutas de autenticación
router.use('/auth', authRouter);

// Exportar todas las rutas
export default router;
