import { Request, Response } from 'express';
import { PrismaClient, Prisma, Departamento, TiempoOperativo, Unidad } from '@prisma/client';

const prisma = new PrismaClient();

interface DetalleRegistro {
  tipoOperativo: string | null;
  nombreOperativo: string | null;
  horaInicio: string;
  horaFin: string;
  totalPpss: number;
  moviles: number;
  motos: number;
  hipos: number;
}

interface EstadisticaPorHora {
  hora: number;
  totalPpss: number;
  totalMoviles: number;
  totalMotos: number;
  totalHipos: number;
  detalles: DetalleRegistro[];
}

export const obtenerEstadisticasPorHorario = async (req: Request, res: Response) => {
  try {
    const {
      departamentos,
      unidad,
      tiempoOperativo,
    } = req.query;

    console.log('Backend - Filtros recibidos:');
    console.log('- Departamentos:', departamentos);
    console.log('- Unidad:', unidad);
    console.log('- Tiempo Operativo:', tiempoOperativo);

    // Construir el where para el filtro
    const whereConditions: Prisma.TablaPrincipalWhereInput[] = [];

    // Filtrar por departamentos (puede ser un array)
    if (departamentos) {
      const deptoArray = Array.isArray(departamentos) 
        ? (departamentos as string[]).map(d => d as Departamento)
        : [departamentos as string].map(d => d as Departamento);
      
      whereConditions.push({
        departamento: {
          in: deptoArray,
        },
      });
      console.log('Departamentos procesados:', deptoArray);
    }

    // Filtrar por unidad
    if (unidad) {
      const unidadArray = Array.isArray(unidad) 
        ? (unidad as string[]).map(u => u as Unidad)
        : [unidad as string].map(u => u as Unidad);
      
      whereConditions.push({
        unidad: {
          in: unidadArray,
        },
      });
      console.log('Unidades procesadas:', unidadArray);
    }

    // Filtrar por tiempo operativo
    if (tiempoOperativo) {
      whereConditions.push({ 
        tiempoOperativo: tiempoOperativo as TiempoOperativo 
      });
      console.log('Tiempo Operativo procesado:', tiempoOperativo);
    }

    const where: Prisma.TablaPrincipalWhereInput = whereConditions.length > 0
      ? { AND: whereConditions }
      : {};

    console.log('Consulta final:', JSON.stringify(where, null, 2));

    // Obtener todos los registros que coincidan con los filtros
    const registros = await prisma.tablaPrincipal.findMany({
      where,
      select: {
        tipoOperativo: true,
        nombreOperativo: true,
        horaInicio: true,
        horaFin: true,
        totalPpss: true,
        moviles: true,
        motos: true,
        hipos: true,
      },
    });

    console.log(`Total de registros encontrados: ${registros.length}`);

    // Agrupar por hora y calcular totales
    const estadisticasPorHora = new Map<number, EstadisticaPorHora>();

    // Inicializar todas las horas del día (8:00 - 8:00)
    for (let i = 8; i < 32; i++) {
      const hora = i % 24;
      estadisticasPorHora.set(hora, {
        hora,
        totalPpss: 0,
        totalMoviles: 0,
        totalMotos: 0,
        totalHipos: 0,
        detalles: [],
      });
    }

    // Procesar cada registro
    registros.forEach(registro => {
      if (!registro.horaInicio || !registro.horaFin) return;

      const horaInicio = registro.horaInicio.getHours();
      const horaFin = registro.horaFin.getHours();

      // Calcular las horas que abarca este registro
      let hora = horaInicio;
      do {
        const stats = estadisticasPorHora.get(hora);
        if (stats) {
          stats.totalPpss += registro.totalPpss || 0;
          stats.totalMoviles += registro.moviles || 0;
          stats.totalMotos += registro.motos || 0;
          stats.totalHipos += registro.hipos || 0;
          stats.detalles.push({
            tipoOperativo: registro.tipoOperativo,
            nombreOperativo: registro.nombreOperativo,
            horaInicio: registro.horaInicio.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
            horaFin: registro.horaFin.toLocaleTimeString('es-UY', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false,
              hourCycle: 'h23'
            }),
            totalPpss: registro.totalPpss || 0,
            moviles: registro.moviles || 0,
            motos: registro.motos || 0,
            hipos: registro.hipos || 0,
          });
        }
        hora = (hora + 1) % 24;
      } while (hora !== (horaFin + 1) % 24);
    });

    // Convertir el Map a array y ordenar por hora
    const resultado = Array.from(estadisticasPorHora.values())
      .sort((a, b) => {
        // Ajustar las horas para que 8:00 sea el inicio
        const ajustarHora = (h: number) => (h < 8 ? h + 24 : h);
        return ajustarHora(a.hora) - ajustarHora(b.hora);
      });

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
