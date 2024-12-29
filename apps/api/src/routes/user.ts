import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Tipos personalizados
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Obtener perfil del usuario
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el perfil' 
    });
  }
});

// Actualizar perfil
router.put('/profile', [
  authMiddleware,
  body('email').optional().isEmail().withMessage('El email debe ser válido'),
  body('fullName').optional().notEmpty().withMessage('El nombre completo no puede estar vacío'),
  validate
], async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    const { email, fullName } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(fullName && { fullName })
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        updatedAt: true
      }
    });

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el perfil' 
    });
  }
});

export default router;
