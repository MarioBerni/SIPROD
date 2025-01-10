import { Request, Response } from 'express';
import { PrismaClient, Rol, Grado } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (_req: Request, res: Response) => {
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
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(contrasenaActual, 10);

      const user = await prisma.user.create({
        data: {
          correo,
          contrasenaActual: hashedPassword,
          nombre,
          rol: rol as Rol,
          grado: grado as Grado,
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
      const { correo, contrasenaActual, nombre, rol, grado, cargo, activo } = req.body;

      // Verificar si el correo ya está en uso por otro usuario
      if (correo) {
        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              { correo },
              { NOT: { id } }
            ]
          }
        });

        if (existingUser) {
          return res.status(400).json({ message: 'El correo ya está en uso' });
        }
      }

      type UpdateData = {
        correo?: string;
        nombre?: string;
        rol?: Rol;
        grado?: Grado;
        cargo?: string;
        activo?: boolean;
        contrasenaActual?: string;
      };

      const updateData: UpdateData = {
        ...(correo && { correo }),
        ...(nombre && { nombre }),
        ...(rol && { rol: rol as Rol }),
        ...(grado && { grado: grado as Grado }),
        ...(cargo && { cargo }),
        ...(typeof activo === 'boolean' && { activo })
      };

      if (contrasenaActual) {
        const hashedPassword = await bcrypt.hash(contrasenaActual, 10);
        updateData.contrasenaActual = hashedPassword;
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
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
      await prisma.user.delete({ where: { id } });
      return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  },
};
