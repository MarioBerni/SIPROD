import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tablaPrincipalController = {
  // Obtener todos los registros
  getAllRegistros: async (_req: Request, res: Response) => {
    try {
      const registros = await prisma.tablaPrincipal.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.json(registros);
    } catch (error) {
      console.error('Error getting registros:', error);
      return res.status(500).json({ message: 'Error al obtener registros' });
    }
  },

  // Obtener un registro por ID
  getRegistroById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const registro = await prisma.tablaPrincipal.findUnique({
        where: { id }
      });

      if (!registro) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }

      return res.json(registro);
    } catch (error) {
      console.error('Error getting registro:', error);
      return res.status(500).json({ message: 'Error al obtener el registro' });
    }
  },

  // Crear un nuevo registro
  createRegistro: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const userId = req.user?.id; // Asumiendo que el middleware de auth agrega el usuario

      if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      const registro = await prisma.tablaPrincipal.create({
        data: {
          ...data,
          createdById: userId
        }
      });

      return res.status(201).json(registro);
    } catch (error) {
      console.error('Error creating registro:', error);
      return res.status(500).json({ message: 'Error al crear el registro' });
    }
  },

  // Actualizar un registro
  updateRegistro: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const registro = await prisma.tablaPrincipal.update({
        where: { id },
        data
      });

      return res.json(registro);
    } catch (error) {
      console.error('Error updating registro:', error);
      return res.status(500).json({ message: 'Error al actualizar el registro' });
    }
  },

  // Eliminar un registro
  deleteRegistro: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.tablaPrincipal.delete({
        where: { id }
      });

      return res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting registro:', error);
      return res.status(500).json({ message: 'Error al eliminar el registro' });
    }
  }
};
