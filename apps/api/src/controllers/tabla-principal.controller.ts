import { Request, Response } from 'express';
import { PrismaClient, Rol, Unidad, TiempoOperativo, Prisma } from '@prisma/client';
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

interface RecordData {
  ppssEnMovil?: number;
  motos?: number;
  hipos?: number;
  pieTierra?: number;
  motosBitripuladas?: number;
}

const calculateTotalPpss = (data: RecordData) => {
  return (data.ppssEnMovil || 0) +
         (data.motos || 0) +
         (data.hipos || 0) +
         (data.pieTierra || 0) +
         ((data.motosBitripuladas || 0) * 2);
};

interface WhereClause extends Prisma.TablaPrincipalWhereInput {
  unidad?: {
    in: Unidad[];
  };
  tiempoOperativo?: {
    in: TiempoOperativo[];
  };
  nombreOperativo?: {
    in: string[];
  };
}

interface PDFFormattedRegistro {
  nombreOperativo: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalPpss: number;
  horaInicio: string;
  horaFin: string;
  seccional: string;
}

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

      // Combinar los datos con los valores por defecto y calcular totalPpss
      const dataWithDefaults: RecordData & typeof defaultNumericFields = {
        ...defaultNumericFields,
        ...data,
        totalPpss: calculateTotalPpss(data)
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

      // Calcular totalPpss con los datos actualizados
      data.totalPpss = calculateTotalPpss(data);

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
  },

  // Obtener opciones para los filtros
  getFilterOptions: async (_req: Request, res: Response) => {
    try {
      const [unidades, tiemposOperativos, nombresOperativos] = await Promise.all([
        prisma.tablaPrincipal.findMany({
          select: { unidad: true },
          distinct: ['unidad'],
          where: { unidad: { not: null } }
        }),
        prisma.tablaPrincipal.findMany({
          select: { tiempoOperativo: true },
          distinct: ['tiempoOperativo'],
          where: { tiempoOperativo: { not: null } }
        }),
        prisma.tablaPrincipal.findMany({
          select: { nombreOperativo: true },
          distinct: ['nombreOperativo'],
          where: { nombreOperativo: { not: null } }
        })
      ]);

      return res.json({
        unidades: unidades.map(u => u.unidad).filter(Boolean),
        tiemposOperativos: tiemposOperativos.map(t => t.tiempoOperativo).filter(Boolean),
        nombresOperativos: nombresOperativos.map(n => n.nombreOperativo).filter(Boolean)
      });
    } catch (error) {
      console.error('Error al obtener opciones de filtro:', error);
      return res.status(500).json({ message: 'Error al obtener opciones de filtro' });
    }
  },

  // Obtener datos filtrados para PDF
  getFilteredDataForPDF: async (req: Request, res: Response) => {
    try {
      console.log('Backend - Query params recibidos:', req.query);
      
      const whereClause: WhereClause = {};
      let unidadesFiltradas: Unidad[] = [];
      let tiemposOperativosFiltrados: TiempoOperativo[] = [];
      let nombresOperativosFiltrados: string[] = [];
      
      // Obtener y validar unidades del parámetro JSON
      if (req.query.unidades) {
        try {
          const unidadesArray = JSON.parse(req.query.unidades as string);
          console.log('Backend - Unidades parseadas:', unidadesArray);
          
          unidadesFiltradas = unidadesArray
            .filter((u: string): u is Unidad => Object.values(Unidad).includes(u as Unidad));
          
          console.log('Backend - Unidades válidas:', unidadesFiltradas);

          if (unidadesFiltradas.length > 0) {
            whereClause.unidad = {
              in: unidadesFiltradas
            };
          }
        } catch (error) {
          console.error('Error al parsear unidades:', error);
        }
      }

      // Obtener y validar tiempos operativos
      if (req.query.tiemposOperativos) {
        try {
          const tiemposArray = JSON.parse(req.query.tiemposOperativos as string);
          console.log('Backend - Tiempos operativos parseados:', tiemposArray);

          tiemposOperativosFiltrados = tiemposArray
            .filter((t: string): t is TiempoOperativo => Object.values(TiempoOperativo).includes(t as TiempoOperativo));

          console.log('Backend - Tiempos operativos válidos:', tiemposOperativosFiltrados);

          if (tiemposOperativosFiltrados.length > 0) {
            whereClause.tiempoOperativo = {
              in: tiemposOperativosFiltrados
            };
          }
        } catch (error) {
          console.error('Error al parsear tiempos operativos:', error);
        }
      }

      // Obtener y validar nombres operativos
      if (req.query.nombresOperativos) {
        try {
          nombresOperativosFiltrados = JSON.parse(req.query.nombresOperativos as string);
          console.log('Backend - Nombres operativos parseados:', nombresOperativosFiltrados);

          if (nombresOperativosFiltrados.length > 0) {
            whereClause.nombreOperativo = {
              in: nombresOperativosFiltrados
            };
          }
        } catch (error) {
          console.error('Error al parsear nombres operativos:', error);
        }
      }

      // Obtener y validar operativos seleccionados para tablas personalizadas
      if (req.query.selectedOperativos) {
        try {
          const selectedOperativos = JSON.parse(req.query.selectedOperativos as string);
          console.log('Backend - Operativos seleccionados parseados:', selectedOperativos);

          if (selectedOperativos.length > 0) {
            whereClause.nombreOperativo = {
              in: selectedOperativos
            };
            // Para tablas personalizadas, ignoramos los filtros de unidad, tiempo operativo y nombre operativo
            delete whereClause.unidad;
            delete whereClause.tiempoOperativo;
          }
        } catch (error) {
          console.error('Error al parsear operativos seleccionados:', error);
        }
      }

      console.log('Backend - Cláusula WHERE final:', whereClause);

      // Obtener los registros filtrados
      const registros = await prisma.tablaPrincipal.findMany({
        where: whereClause,
        select: {
          tipoOperativo: true,
          nombreOperativo: true,
          moviles: true,
          ssoo: true,
          motos: true,
          hipos: true,
          pieTierra: true,
          totalPpss: true,
          horaInicio: true,
          horaFin: true,
          seccional: true,
          unidad: true
        },
        orderBy: {
          unidad: 'asc'
        }
      });

      console.log('Backend - Registros encontrados:', registros.length);

      if (!registros || registros.length === 0) {
        console.log('Backend - No se encontraron registros');
        return res.json({});
      }

      // Organizar datos por unidad
      const datosPorUnidad = registros.reduce<Record<string, PDFFormattedRegistro[]>>((acc, registro) => {
        const unidad = registro.unidad;
        
        // Solo incluir registros de las unidades filtradas
        if (unidad && (!unidadesFiltradas.length || unidadesFiltradas.includes(unidad))) {
          if (!acc[unidad]) {
            acc[unidad] = [];
          }
          acc[unidad].push({
            nombreOperativo: `${registro.tipoOperativo || ''} ${registro.nombreOperativo || ''}`.trim(),
            moviles: registro.moviles || 0,
            ssoo: registro.ssoo || 0,
            motos: registro.motos || 0,
            hipos: registro.hipos || 0,
            pieTierra: registro.pieTierra || 0,
            totalPpss: registro.totalPpss || 0,
            horaInicio: registro.horaInicio ? new Date(registro.horaInicio).toLocaleTimeString('es-UY', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }) : '',
            horaFin: registro.horaFin ? new Date(registro.horaFin).toLocaleTimeString('es-UY', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }) : '',
            seccional: registro.seccional ? registro.seccional.join(', ') : ''
          });
        }
        return acc;
      }, {});

      console.log('Backend - Datos organizados por unidad:', {
        unidadesFiltradas,
        unidadesEncontradas: Object.keys(datosPorUnidad),
        registrosPorUnidad: Object.entries(datosPorUnidad).map(([u, d]) => `${u}: ${d.length}`)
      });

      return res.json(datosPorUnidad);
    } catch (error) {
      console.error('Error al obtener datos filtrados para PDF:', error);
      return res.status(500).json({ message: 'Error al obtener datos filtrados para PDF' });
    }
  }
};
