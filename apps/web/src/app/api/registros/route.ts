import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient, Rol } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// Definir tipos para el resultado de la autenticación
type AuthSuccess = {
  userId: string;
  userRole: Rol;
};

type AuthError = {
  error: string;
  status: number;
};

type AuthResult = AuthSuccess | AuthError;

// Tipo para errores de Prisma
type PrismaError = {
  code?: string;
  message?: string;
  clientVersion?: string;
};

// Middleware para verificar autenticación y obtener usuario
async function checkAuth(request: NextRequest): Promise<AuthResult> {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return { error: 'No autorizado', status: 401 };
  }
  
  try {
    // Verificar y decodificar el token
    const payload = await verifyToken(token);
    
    // Obtener el usuario usando el ID del token
    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId,
        activo: true
      }
    });
    
    if (!user) {
      return { error: 'Usuario no encontrado o inactivo', status: 401 };
    }
    
    return { 
      userId: user.id,
      userRole: user.rol 
    };
  } catch (error) {
    console.error('Error al verificar token:', error);
    return { error: 'Token inválido', status: 401 };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await checkAuth(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const registros = await prisma.tablaPrincipal.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await checkAuth(request);
    if ('error' in authResult) {
      console.log('Error de autenticación:', authResult);
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const data = await request.json();
    console.log('Datos recibidos en el servidor:', JSON.stringify(data, null, 2));
    console.log('Tipos de datos recibidos:', Object.entries(data).map(([key, value]) => `${key}: ${typeof value}`));
    
    // Asignar valores por defecto a campos numéricos
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

    const calculateTotalPpss = (data: {
      ppssEnMovil?: number;
      motos?: number;
      hipos?: number;
      pieTierra?: number;
      motosBitripuladas?: number;
    }) => {
      return (data.ppssEnMovil || 0) +
             (data.motos || 0) +
             (data.hipos || 0) +
             (data.pieTierra || 0) +
             ((data.motosBitripuladas || 0) * 2);
    };

    // Asignar createdById del usuario autenticado y limpiar datos
    const recordData = {
      ...defaultNumericFields,
      ...data,
      createdById: (authResult as AuthSuccess).userId,
      totalPpss: calculateTotalPpss(data),
      // Asegurar que los enums sean null si están vacíos
      departamento: data.departamento || null,
      unidad: data.unidad || null,
      tipoOrden: data.tipoOrden || null,
      tipoOperativo: data.tipoOperativo || null,
      tiempoOperativo: data.tiempoOperativo || null,
      // Asegurar que las fechas sean null si están vacías
      fechaInicio: data.fechaInicio || null,
      horaInicio: data.horaInicio || null,
      fechaFin: data.fechaFin || null,
      horaFin: data.horaFin || null,
      // Asegurar que los arrays estén inicializados
      seccional: data.seccional || [],
      barrios: data.barrios || []
    };

    console.log('Datos procesados antes de crear:', JSON.stringify(recordData, null, 2));

    try {
      const newRecord = await prisma.tablaPrincipal.create({
        data: recordData
      });
      console.log('Registro creado exitosamente:', newRecord);
      return NextResponse.json(newRecord);
    } catch (error) {
      console.error('Error detallado de Prisma:', error);
      
      const prismaError = error as PrismaError;
      
      // Manejar diferentes tipos de errores de Prisma
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un registro con estos datos' },
          { status: 400 }
        );
      } else if (prismaError.code === 'P2003') {
        return NextResponse.json(
          { error: 'Error de referencia: uno de los campos hace referencia a un registro que no existe' },
          { status: 400 }
        );
      } else if (prismaError.code === 'P2005') {
        return NextResponse.json(
          { error: 'Error de validación: uno de los campos tiene un valor inválido' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Error al crear registro en la base de datos',
          details: {
            message: prismaError.message,
            code: prismaError.code
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const generalError = error as Error;
    console.error('Error general en POST /registros:', generalError);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
