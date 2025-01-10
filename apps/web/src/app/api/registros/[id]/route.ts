import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// Middleware para verificar autenticación
async function checkAuth(request: NextRequest) {
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const authResult = await checkAuth(request);
    if ('error' in authResult) {
      console.log('Error de autenticación:', authResult);
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const data = await request.json();
    console.log('Datos recibidos para actualización:', data);

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
      if (!data[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    // Convertir fechas a formato ISO string
    const formattedDates = {
      fechaInicio: new Date(data.fechaInicio).toISOString(),
      horaInicio: new Date(data.horaInicio).toISOString(),
      horaFin: new Date(data.horaFin).toISOString(),
      fechaFin: new Date(data.fechaFin).toISOString()
    };

    // Actualizar el registro en la base de datos
    try {
      const registro = await prisma.tablaPrincipal.update({
        where: {
          id: params.id
        },
        data: {
          ...data,
          ...formattedDates,
          updatedAt: new Date()
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
      
      console.log('Registro actualizado exitosamente:', registro);
      return NextResponse.json(registro);
    } catch (dbError) {
      console.error('Error al actualizar registro en la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error al actualizar registro en la base de datos', details: dbError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error general en PUT /registros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const authResult = await checkAuth(request);
    if ('error' in authResult) {
      console.log('Error de autenticación:', authResult);
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Eliminar el registro de la base de datos
    try {
      await prisma.tablaPrincipal.delete({
        where: {
          id: params.id
        }
      });
      
      return NextResponse.json({ message: 'Registro eliminado exitosamente' });
    } catch (dbError) {
      console.error('Error al eliminar registro de la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error al eliminar registro de la base de datos', details: dbError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error general en DELETE /registros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}
