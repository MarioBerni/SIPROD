import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import tablaPrincipalRoutes from './tabla-principal.routes';

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

// Rutas de tabla principal
router.use('/registros', tablaPrincipalRoutes);

export default router;
