import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

// Ruta principal
router.get('/', (_req, res) => {
  res.json({ 
    message: 'API SIPROD v1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios
router.use('/users', userRoutes);

export default router;
