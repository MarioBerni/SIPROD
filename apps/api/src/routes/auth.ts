import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

const router: Router = Router();
const prisma = new PrismaClient();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Todos los campos son requeridos',
        },
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        error: {
          code: 'USER_EXISTS',
          message: 'El nombre de usuario ya está en uso',
        },
      });
    }

    // Crear usuario
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        fullName,
        role: 'USER',
      },
    });

    // Generar token
    const token = generateToken(user.id);

    // Respuesta
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Usuario y contraseña son requeridos',
        },
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas',
        },
      });
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas',
        },
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Respuesta
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

export default router;
