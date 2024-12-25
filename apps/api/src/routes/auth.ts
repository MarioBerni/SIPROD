import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { asyncErrorHandler } from '../middleware/error';
import { AppError } from '../utils/errors';

const router: Router = Router();
const prisma = new PrismaClient();

// Registro de usuario
router.post('/register', asyncErrorHandler(async (req, res) => {
  const { username, password, email, fullName } = req.body;
  
  if (!username || !password || !email || !fullName) {
    throw AppError.badRequest('Todos los campos son requeridos', 'INVALID_INPUT');
  }

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw AppError.badRequest('El nombre de usuario ya está en uso', 'USER_EXISTS');
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
  res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
}));

// Login
router.post('/login', asyncErrorHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw AppError.badRequest('Usuario y contraseña son requeridos', 'INVALID_INPUT');
  }

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw AppError.unauthorized('Credenciales inválidas', 'INVALID_CREDENTIALS');
  }

  // Verificar contraseña
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw AppError.unauthorized('Credenciales inválidas', 'INVALID_CREDENTIALS');
  }

  // Generar token
  const token = generateToken(user.id);

  // Respuesta exitosa
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
}));

export default router;
