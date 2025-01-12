import { Request, Response } from 'express';
import { PrismaClient, Rol } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Roles que pueden crear y editar registros
const ROLES_ADMIN: Rol[] = [
  Rol.ADMINISTRADOR,
  Rol.COMANDO_DIRECCION_I,
  Rol.COMANDO_DIRECCION_II,
  Rol.COMANDO_GEO,
  Rol.COMANDO_DNGR
];

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
  createRegistro: async (req: AuthRequest, res: Response) => {
    try {
      const data = { ...req.body };
      
      // Verificar que el usuario esté autenticado y tenga el rol necesario
      if (!req.user) {
        logger.warn('Intento de crear registro sin autenticación');
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Verificar rol si es necesario
      if (!ROLES_ADMIN.includes(req.user.role)) {
        logger.warn(`Usuario ${req.user.userId} con rol ${req.user.role} intentó crear registro sin permisos`);
        return res.status(403).json({ message: 'No tiene permisos para crear registros' });
      }

      // Eliminar campos que no existen en el esquema
      delete data.mapa;
      delete data.puntosControl;
      delete data.recorridos;

      // Asegurar valores por defecto para campos numéricos
      const defaultNumericFields = {
        moviles: 0,
        ppssEnMovil: 0,
        ssoo: 0,
        motos: 0,
        motosBitripuladas: 0,
        hipos: 0,
        canes: 0,
        pieTierra: 0,
        drones: 0,
        antidisturbioApostado: 0,
        antidisturbioAlerta: 0,
        geoApostado: 0,
        geoAlerta: 0,
        totalPpss: 0
      };

      // Combinar los datos con los valores por defecto
      const dataWithDefaults = {
        ...defaultNumericFields,
        ...data,
      };

      logger.info(`Creando registro por usuario ${req.user.userId} con rol ${req.user.role}`);
      
      const registro = await prisma.tablaPrincipal.create({
        data: {
          ...dataWithDefaults,
          createdById: req.user.userId
        }
      });

      logger.info(`Registro creado exitosamente: ${registro.id}`);
      return res.status(201).json(registro);
    } catch (error) {
      logger.error('Error creating registro:', error);
      return res.status(500).json({ message: 'Error al crear el registro' });
    }
  },

  // Actualizar un registro
  updateRegistro: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Verificar rol si es necesario
      if (!ROLES_ADMIN.includes(req.user.role)) {
        return res.status(403).json({ message: 'No tiene permisos para actualizar registros' });
      }

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
  deleteRegistro: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Solo el administrador puede eliminar registros
      if (req.user.role !== Rol.ADMINISTRADOR) {
        return res.status(403).json({ message: 'No tiene permisos para eliminar registros' });
      }

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
