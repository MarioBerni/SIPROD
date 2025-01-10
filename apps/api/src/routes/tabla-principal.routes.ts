import { Router } from 'express';
import { tablaPrincipalController } from '../controllers/tabla-principal.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Proteger todas las rutas con el middleware de autenticación
router.use(authMiddleware);

// Rutas CRUD para la tabla principal
router.get('/', tablaPrincipalController.getAllRegistros);
router.get('/:id', tablaPrincipalController.getRegistroById);
router.post('/', tablaPrincipalController.createRegistro);
router.put('/:id', tablaPrincipalController.updateRegistro);
router.delete('/:id', tablaPrincipalController.deleteRegistro);

export default router;
