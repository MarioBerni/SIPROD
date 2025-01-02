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

// GET /api/users - Listar todos los usuarios
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
    return res.json(users);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios' 
    });
  }
});

// GET /api/users/profile - Obtener perfil del usuario
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
      message: 'Error al obtener perfil de usuario' 
    });
  }
});

// POST /api/users - Crear nuevo usuario
router.post('/', 
  authMiddleware,
  [
    body('username').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('fullName').isString().trim().notEmpty(),
    body('role').isIn(['USER', 'ADMIN']),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { username, email, password, fullName, role } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El usuario o email ya existe'
        });
      }

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password, // Asegúrate de hashear la contraseña antes de guardarla
          fullName,
          role,
          updatedAt: new Date()
        },
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

      return res.status(201).json(user);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear usuario'
      });
    }
  }
);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id',
  authMiddleware,
  [
    body('username').optional().isString().trim(),
    body('email').optional().isEmail(),
    body('password').optional().isString().isLength({ min: 6 }),
    body('fullName').optional().isString().trim(),
    body('role').optional().isIn(['USER', 'ADMIN']),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Eliminar campos vacíos
      Object.keys(updateData).forEach(key => {
        if (!updateData[key]) delete updateData[key];
      });

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true
        }
      });

      return res.json(user);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar usuario'
      });
    }
  }
);

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
});

// PUT /api/users/profile - Actualizar perfil
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
