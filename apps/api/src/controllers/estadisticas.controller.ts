import { Request, Response } from 'express';
import { PrismaClient, Prisma, Departamento, TiempoOperativo, Unidad } from '@prisma/client';

const prisma = new PrismaClient();

interface DetalleRegistro {
  nombreOperativo: string | null;
  moviles: number | null;
  motos: number | null;
  hipos: number | null;
  totalPpss: number | null;
  seccional?: number[];
  barrios?: string[];
  tiempoOperativo: TiempoOperativo | null;
  unidad: Unidad | null;
  departamento: Departamento | null;
  ppssEnMovil: number | null;
  motosBitripuladas: number | null;
  pieTierra: number | null;
  horaInicio?: string;
  horaFin?: string;
}

interface EstadisticaAgrupada<T = number | string> {
  resumen: { 
    valor: T; 
    totalPpss: number;
    moviles: number;
    motos: number;
    hipos: number;
    ppssEnMovil: number;
    motosBitripuladas: number;
    pieTierra: number;
  };
  detalles: DetalleRegistro[];
}

interface FiltrosEstadistica {
  zona?: string | string[];
  unidad?: string | string[];
  tiempoOperativo?: string | string[];
  departamento?: string;
  fechaInicio?: string;
  fechaFin?: string;
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
        tiempoOperativo: true,
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
            tiempoOperativo: registro.tiempoOperativo,
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
            departamento: null,
            unidad: null,
            ppssEnMovil: null,
            motosBitripuladas: null,
            pieTierra: null
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

export const obtenerEstadisticasPorSeccional = async (req: Request, res: Response) => {
  try {
    const filtros = req.query as FiltrosEstadistica;
    console.log('Filtros recibidos para seccional:', filtros);

    // Construir el where para el filtro
    const whereConditions: Prisma.TablaPrincipalWhereInput = {};

    if (filtros.zona) {
      const zonas = Array.isArray(filtros.zona) ? filtros.zona : [filtros.zona];
      whereConditions.departamento = {
        in: zonas.map(z => z as unknown as Departamento)
      };
    }

    if (filtros.unidad) {
      const unidades = Array.isArray(filtros.unidad) ? filtros.unidad : [filtros.unidad];
      whereConditions.unidad = {
        in: unidades.map(u => u as unknown as Unidad)
      };
    }

    if (filtros.tiempoOperativo) {
      const tiempos = Array.isArray(filtros.tiempoOperativo) ? filtros.tiempoOperativo : [filtros.tiempoOperativo];
      whereConditions.tiempoOperativo = {
        in: tiempos.map(t => t as unknown as TiempoOperativo)
      };
    }

    if (filtros.departamento) {
      whereConditions.departamento = filtros.departamento as unknown as Departamento;
    }

    if (filtros.fechaInicio) {
      whereConditions.fechaInicio = {
        gte: new Date(filtros.fechaInicio)
      };
    }

    if (filtros.fechaFin) {
      whereConditions.fechaFin = {
        lte: new Date(filtros.fechaFin)
      };
    }

    // Asegurarse de que seccional no esté vacío
    whereConditions.seccional = {
      isEmpty: false
    };

    console.log('Where conditions:', JSON.stringify(whereConditions, null, 2));

    // Obtener todos los registros que cumplan con los filtros
    const registros = await prisma.tablaPrincipal.findMany({
      where: whereConditions,
      select: {
        seccional: true,
        totalPpss: true,
        moviles: true,
        motos: true,
        hipos: true,
        nombreOperativo: true,
        tiempoOperativo: true,
        unidad: true,
        departamento: true,
        ppssEnMovil: true,
        motosBitripuladas: true,
        pieTierra: true
      }
    });

    console.log(`Registros encontrados: ${registros.length}`);

    // Agrupar directamente por seccional
    const estadisticasPorSeccional = new Map<number, EstadisticaAgrupada<number>>();

    registros.forEach(registro => {
      if (!registro.seccional || registro.seccional.length === 0) return;
      
      // Procesar cada seccional del registro
      registro.seccional.forEach(seccional => {
        const estadisticaActual = estadisticasPorSeccional.get(seccional) || {
          resumen: { 
            valor: seccional, 
            totalPpss: 0,
            moviles: 0,
            motos: 0,
            hipos: 0,
            ppssEnMovil: 0,
            motosBitripuladas: 0,
            pieTierra: 0
          },
          detalles: []
        };

        // Sumar los valores totales
        estadisticaActual.resumen.totalPpss += registro.totalPpss || 0;
        estadisticaActual.resumen.moviles += registro.moviles || 0;
        estadisticaActual.resumen.motos += registro.motos || 0;
        estadisticaActual.resumen.hipos += registro.hipos || 0;
        estadisticaActual.resumen.ppssEnMovil += registro.ppssEnMovil || 0;
        estadisticaActual.resumen.motosBitripuladas += registro.motosBitripuladas || 0;
        estadisticaActual.resumen.pieTierra += registro.pieTierra || 0;

        // Agregar el registro a los detalles
        estadisticaActual.detalles.push({
          nombreOperativo: registro.nombreOperativo,
          moviles: registro.moviles,
          motos: registro.motos,
          hipos: registro.hipos,
          totalPpss: registro.totalPpss,
          seccional: registro.seccional,
          tiempoOperativo: registro.tiempoOperativo,
          unidad: registro.unidad,
          departamento: registro.departamento,
          ppssEnMovil: registro.ppssEnMovil,
          motosBitripuladas: registro.motosBitripuladas,
          pieTierra: registro.pieTierra
        });

        estadisticasPorSeccional.set(seccional, estadisticaActual);
      });
    });

    // Convertir el Map a array y ordenar por seccional
    const resultado = Array.from(estadisticasPorSeccional.values())
      .sort((a, b) => a.resumen.valor - b.resumen.valor);

    console.log(`Estadísticas procesadas: ${resultado.length} seccionales`);
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener estadísticas por seccional:', error);
    const timestamp = new Date().toISOString();
    res.status(500).json({ 
      error: 'Error al obtener estadísticas por seccional',
      message: error instanceof Error ? error.message : 'Error desconocido',
      timestamp
    });
  }
};

export const obtenerEstadisticasPorBarrio = async (req: Request, res: Response) => {
  try {
    const filtros = req.query as FiltrosEstadistica;
    console.log('Filtros recibidos para barrio:', filtros);

    // Construir el where para el filtro
    const whereConditions: Prisma.TablaPrincipalWhereInput = {};

    if (filtros.zona) {
      const zonas = Array.isArray(filtros.zona) ? filtros.zona : [filtros.zona];
      whereConditions.departamento = {
        in: zonas.map(z => z as unknown as Departamento)
      };
    }

    if (filtros.unidad) {
      const unidades = Array.isArray(filtros.unidad) ? filtros.unidad : [filtros.unidad];
      whereConditions.unidad = {
        in: unidades.map(u => u as unknown as Unidad)
      };
    }

    if (filtros.tiempoOperativo) {
      const tiempos = Array.isArray(filtros.tiempoOperativo) ? filtros.tiempoOperativo : [filtros.tiempoOperativo];
      whereConditions.tiempoOperativo = {
        in: tiempos.map(t => t as unknown as TiempoOperativo)
      };
    }

    if (filtros.departamento) {
      whereConditions.departamento = filtros.departamento as unknown as Departamento;
    }

    if (filtros.fechaInicio) {
      whereConditions.fechaInicio = {
        gte: new Date(filtros.fechaInicio)
      };
    }

    if (filtros.fechaFin) {
      whereConditions.fechaFin = {
        lte: new Date(filtros.fechaFin)
      };
    }

    // Asegurarse de que barrios no esté vacío
    whereConditions.barrios = {
      isEmpty: false
    };

    console.log('Where conditions:', JSON.stringify(whereConditions, null, 2));

    // Obtener todos los registros que cumplan con los filtros
    const registros = await prisma.tablaPrincipal.findMany({
      where: whereConditions,
      select: {
        barrios: true,
        totalPpss: true,
        moviles: true,
        motos: true,
        hipos: true,
        nombreOperativo: true,
        tiempoOperativo: true,
        unidad: true,
        departamento: true,
        ppssEnMovil: true,
        motosBitripuladas: true,
        pieTierra: true
      }
    });

    console.log(`Registros encontrados: ${registros.length}`);

    // Agrupar directamente por barrio
    const estadisticasPorBarrio = new Map<string, EstadisticaAgrupada<string>>();

    registros.forEach(registro => {
      if (!registro.barrios || registro.barrios.length === 0) return;
      
      // Procesar cada barrio del registro
      registro.barrios.forEach(barrio => {
        const estadisticaActual = estadisticasPorBarrio.get(barrio) || {
          resumen: { 
            valor: barrio, 
            totalPpss: 0,
            moviles: 0,
            motos: 0,
            hipos: 0,
            ppssEnMovil: 0,
            motosBitripuladas: 0,
            pieTierra: 0
          },
          detalles: []
        };

        // Sumar los valores totales
        estadisticaActual.resumen.totalPpss += registro.totalPpss || 0;
        estadisticaActual.resumen.moviles += registro.moviles || 0;
        estadisticaActual.resumen.motos += registro.motos || 0;
        estadisticaActual.resumen.hipos += registro.hipos || 0;
        estadisticaActual.resumen.ppssEnMovil += registro.ppssEnMovil || 0;
        estadisticaActual.resumen.motosBitripuladas += registro.motosBitripuladas || 0;
        estadisticaActual.resumen.pieTierra += registro.pieTierra || 0;

        // Agregar el registro a los detalles
        estadisticaActual.detalles.push({
          nombreOperativo: registro.nombreOperativo,
          moviles: registro.moviles,
          motos: registro.motos,
          hipos: registro.hipos,
          totalPpss: registro.totalPpss,
          barrios: registro.barrios,
          tiempoOperativo: registro.tiempoOperativo,
          unidad: registro.unidad,
          departamento: registro.departamento,
          ppssEnMovil: registro.ppssEnMovil,
          motosBitripuladas: registro.motosBitripuladas,
          pieTierra: registro.pieTierra
        });

        estadisticasPorBarrio.set(barrio, estadisticaActual);
      });
    });

    // Convertir el Map a array y ordenar por nombre de barrio
    const resultado = Array.from(estadisticasPorBarrio.values())
      .sort((a, b) => a.resumen.valor.localeCompare(b.resumen.valor));

    console.log(`Estadísticas procesadas: ${resultado.length} barrios`);
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener estadísticas por barrio:', error);
    const timestamp = new Date().toISOString();
    res.status(500).json({ 
      error: 'Error al obtener estadísticas por barrio',
      message: error instanceof Error ? error.message : 'Error desconocido',
      timestamp
    });
  }
};
