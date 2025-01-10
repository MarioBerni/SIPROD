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
    console.log('Datos recibidos:', data);
    
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

    // Convertir fechas a formato ISO string
    const formattedDates = {
      fechaInicio: new Date(data.fechaInicio).toISOString(),
      horaInicio: new Date(data.horaInicio).toISOString(),
      horaFin: new Date(data.horaFin).toISOString(),
      fechaFin: new Date(data.fechaFin).toISOString()
    };

    // Combinar datos recibidos con valores por defecto y fechas formateadas
    const dataWithDefaults = {
      ...defaultNumericFields,
      ...data,
      ...formattedDates,
      // Asegurar que los arrays estén inicializados
      seccional: data.seccional || [],
      mapa: data.mapa || [],
      puntosControl: data.puntosControl || [],
      recorridos: data.recorridos || [],
      barrios: data.barrios || []
    };

    console.log('Datos con valores por defecto:', dataWithDefaults);
    
    // Validar campos requeridos
    const requiredFields = [
      'departamento',
      'unidad',
      'tipoOrden',
      'nroOrden',
      'tipoOperativo',
      'tiempoOperativo',
      'nombreOperativo',
      'fechaInicio',
      'horaInicio',
      'horaFin',
      'fechaFin'
    ];

    for (const field of requiredFields) {
      if (!dataWithDefaults[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    // Crear el registro en la base de datos
    try {
      const registro = await prisma.tablaPrincipal.create({
        data: {
          ...dataWithDefaults,
          createdById: authResult.userId
        },
        include: {
          createdBy: {
            select: {
              id: true,
              nombre: true,
              grado: true,
              rol: true
            }
          }
        }
      });
      
      console.log('Registro creado exitosamente por:', registro.createdBy);
      return NextResponse.json(registro);
    } catch (dbError) {
      console.error('Error al crear registro en la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error al crear registro en la base de datos', details: dbError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error general en POST /registros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}
