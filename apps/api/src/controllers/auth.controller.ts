import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { generateToken, verifyToken } from '../utils/auth';
import { ApiError } from '../middleware/error';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== Inicio de proceso de login ===');
      console.log('Headers recibidos:', req.headers);
      console.log('Body recibido:', req.body);
      
      const { correo, password } = req.body;
      logger.info('Datos recibidos en login:', { correo, bodyContent: req.body });

      // Buscar usuario usando Prisma
      logger.info('Buscando usuario en la base de datos...');
      console.log('Buscando usuario con correo:', correo);
      
      const user = await prisma.user.findUnique({
        where: { correo }
      });

      console.log('Usuario encontrado:', user ? 'Sí' : 'No');
      logger.info('Resultado de búsqueda:', { 
        found: !!user,
        userId: user?.id,
        userEmail: user?.correo,
        userRole: user?.rol 
      });

      if (!user || !await bcrypt.compare(password, user.contrasenaActual)) {
        logger.warn(`Intento de login fallido para usuario: ${correo}`);
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Actualizar última fecha de acceso
      logger.info('Actualizando última fecha de acceso...');
      await prisma.user.update({
        where: { id: user.id },
        data: { ultimaFechaAcceso: new Date() }
      });

      // Generar token
      logger.info('Generando token para usuario:', { id: user.id });
      console.log('Generando token para usuario ID:', user.id);
      const token = await generateToken({ 
        userId: user.id.toString(),
        role: user.rol
      });

      console.log('Token generado exitosamente');
      logger.info('Token generado exitosamente');

      // Configurar cookie con opciones de seguridad
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
        path: '/'
      });

      const response = {
        success: true,
        user: {
          id: user.id,
          correo: user.correo,
          rol: user.rol,
          grado: user.grado,
          nombre: user.nombre,
          cargo: user.cargo
        },
        token // Incluir el token en la respuesta para el cliente
      };
      
      console.log('Enviando respuesta de login:', { 
        ...response, 
        token: '[HIDDEN]',
        user: response.user 
      });
      
      res.json(response);
    } catch (error) {
      console.error('=== Error en proceso de login ===');
      console.error('Error completo:', error);
      logger.error('Error en login:', error);
      
      if (error instanceof ApiError) {
        logger.error('ApiError:', { 
          statusCode: error.statusCode, 
          message: error.message 
        });
        console.error('Error de API:', {
          statusCode: error.statusCode,
          message: error.message
        });
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        logger.error('Error interno:', error);
        console.error('Error interno del servidor:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
        });
      }
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      // Intentar obtener el token de la cookie o del header
      const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        throw new ApiError(401, 'Token no proporcionado');
      }

      // Verificar token
      const decoded = await verifyToken(token);
      
      // Buscar usuario usando Prisma
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        throw new ApiError(401, 'Usuario no encontrado');
      }

      // Si llegamos aquí, el token es válido
      res.json({
        valid: true,
        user: {
          id: user.id,
          correo: user.correo,
          rol: user.rol,
          grado: user.grado,
          nombre: user.nombre,
          cargo: user.cargo
        }
      });
    } catch (error) {
      logger.error('Error en validateToken:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ 
          valid: false,
          message: error.message 
        });
      } else {
        res.status(401).json({ 
          valid: false,
          message: 'Token inválido o expirado' 
        });
      }
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasenaActual, grado, nombre, rol, cargo } = req.body;

      // Verificar si el usuario ya existe usando Prisma
      const existingUser = await prisma.user.findUnique({
        where: { correo }
      });

      if (existingUser) {
        throw new ApiError(400, 'El correo ya está registrado');
      }

      // Crear nuevo usuario usando Prisma
      const newUser = await prisma.user.create({
        data: {
          correo,
          contrasenaActual,
          grado,
          nombre,
          rol,
          cargo,
          terminosCondiciones: false,
          activo: true
        }
      });

      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          correo: newUser.correo,
          rol: newUser.rol,
          grado: newUser.grado,
          nombre: newUser.nombre,
          cargo: newUser.cargo
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
