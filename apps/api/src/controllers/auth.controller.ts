import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { generateToken, verifyToken } from '../utils/auth';
import { ApiError } from '../middleware/error';
import pool from '../db';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      logger.info('Datos recibidos:', { username });

      // Buscar usuario
      const result = await pool.query(
        'SELECT * FROM "User" WHERE username = $1',
        [username]
      );

      const user = result.rows[0];
      logger.info('Resultado de búsqueda:', { found: !!user });

      if (!user) {
        logger.warn(`Usuario no encontrado: ${username}`);
        throw new ApiError(401, 'Credenciales inválidas');
      }

      // Verificar contraseña
      logger.info('Comparando contraseñas');
      const isValidPassword = password === user.password;
      logger.info('Resultado de comparación:', { isValidPassword });

      if (!isValidPassword) {
        logger.warn(`Intento de login fallido para usuario: ${username}`);
        throw new ApiError(401, 'Credenciales inválidas');
      }

      // Generar token
      logger.info('Generando token para usuario:', { id: user.id });
      const token = await generateToken({ 
        id: user.id.toString(), 
        role: user.role || 'USER' 
      });

      // Establecer cookie y enviar token en la respuesta
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role || 'USER'
        }
      });
    } catch (error) {
      logger.error('Error en login:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
        });
      }
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;
      
      if (!token) {
        throw new ApiError(401, 'Token no proporcionado');
      }

      // Verificar token
      const decoded = await verifyToken(token);
      
      // Buscar usuario
      const result = await pool.query(
        'SELECT id, username, email, role FROM "User" WHERE id = $1',
        [decoded.userId] 
      );

      const user = result.rows[0];
      
      if (!user) {
        throw new ApiError(401, 'Usuario no encontrado');
      }

      res.json({
        valid: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || 'USER'
        }
      });
    } catch (error) {
      logger.error('Error en validación de token:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          valid: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          valid: false,
          message: 'Error interno del servidor'
        });
      }
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await pool.query(
        'SELECT * FROM "User" WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        throw new ApiError(400, 'Usuario o email ya existe');
      }

      // Crear nuevo usuario
      const result = await pool.query(
        'INSERT INTO "User" (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, password]
      );

      const newUser = result.rows[0];

      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      logger.error('Error en registro:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
    }
  }
}
