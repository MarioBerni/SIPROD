import { Router, Response, NextFunction, Request } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { RequestHandler } from 'express';

const router = Router();
const authController = new AuthController();

// Validación de login
const loginValidation = [
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate
];

// Middleware para manejar errores de async
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Rutas
router.post('/login', loginValidation, asyncHandler(authController.login));

router.post('/logout', async (_req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
  }
});

router.post('/register', [
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('fullName').notEmpty().withMessage('El nombre completo es requerido'),
  validate
], asyncHandler(authController.register));

// Endpoint de validación de token
router.get('/validate-token', asyncHandler(async (req: Request, res: Response) => {
  await authController.validateToken(req, res);
  return res.json({ success: true });
}));

export default router;
