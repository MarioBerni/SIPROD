import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ message: 'Error al obtener usuario' });
    }
  },

  // Crear un nuevo usuario
  createUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password, fullName, role } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email },
          ],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'El usuario o email ya está registrado',
        });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          fullName,
          role,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Error al crear usuario' });
    }
  },

  // Actualizar un usuario
  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, password, fullName, role } = req.body;

      // Verificar si el usuario existe
      const userExists = await prisma.user.findUnique({
        where: { id },
      });

      if (!userExists) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si el email ya está en uso por otro usuario
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              { email },
              { NOT: { id } },
            ],
          },
        });

        if (existingUser) {
          return res.status(400).json({
            message: 'El email ya está en uso por otro usuario',
          });
        }
      }

      // Preparar los datos para actualizar
      const updateData: Record<string, unknown> = {
        email,
        fullName,
        role,
        updatedAt: new Date(),
      };

      // Si se proporciona una nueva contraseña, hashearla
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Eliminar campos undefined
      Object.keys(updateData).forEach(
        key => updateData[key] === undefined && delete updateData[key]
      );

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await prisma.user.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  },
};
