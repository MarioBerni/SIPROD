import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

const router = Router();
const prisma = new PrismaClient();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
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
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword(password),
        email,
        fullName,
        role: 'USER',
      },
    });

    // Generar token
    const token = generateToken(user.id);

    // Respuesta
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !verifyPassword(user.password, password)) {
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
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

export default router;
