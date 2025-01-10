import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { prisma } from '../lib/prisma';
import { Rol } from '@prisma/client';

const router = Router();

// Tipos personalizados
interface AuthRequest extends Request {
  user?: {
    userId: string;
    rol: Rol;
  };
}

// GET /api/users - Listar todos los usuarios
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        grado: true,
        cargo: true,
        activo: true,
        fechaCreacion: true,
        ultimaFechaAcceso: true,
        updatedAt: true,
        desplieguesCargados: true
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
        nombre: true,
        correo: true,
        rol: true,
        grado: true,
        cargo: true,
        activo: true,
        fechaCreacion: true,
        ultimaFechaAcceso: true,
        updatedAt: true,
        desplieguesCargados: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
});

// POST /api/users/register - Registrar nuevo usuario
router.post('/register', [
  body('correo').isEmail().withMessage('El correo debe ser válido'),
  body('contrasenaActual').notEmpty().withMessage('La contraseña es requerida'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('rol').isIn(Object.values(Rol)).withMessage('Rol inválido'),
  validate
], async (req: Request, res: Response) => {
  try {
    const { correo, contrasenaActual, nombre, rol, grado, cargo } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { correo }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const user = await prisma.user.create({
      data: {
        correo,
        contrasenaActual,
        nombre,
        rol,
        grado,
        cargo,
        terminosCondiciones: true,
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        grado: true,
        cargo: true,
        activo: true,
        fechaCreacion: true,
        ultimaFechaAcceso: true,
        updatedAt: true,
        desplieguesCargados: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
});

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', [
  authMiddleware,
  body('correo').optional().isEmail().withMessage('El correo debe ser válido'),
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
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

    const { correo, nombre, cargo, grado } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(correo && { correo }),
        ...(nombre && { nombre }),
        ...(cargo && { cargo }),
        ...(grado && { grado })
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        grado: true,
        cargo: true,
        activo: true,
        fechaCreacion: true,
        ultimaFechaAcceso: true,
        updatedAt: true,
        desplieguesCargados: true
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil'
    });
  }
});

export default router;
