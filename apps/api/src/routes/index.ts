import { Router } from 'express';
import authRouter from './auth';

const router = Router();

// Rutas de autenticación
router.use('/auth', authRouter);

// Exportar todas las rutas
export default router;
