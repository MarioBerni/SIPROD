import { PrismaClient, Rol, Grado, Departamento, Unidad, TipoOrden, TipoOperativo, TiempoOperativo } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Mario7654321+@localhost:5432/siprod"
    }
  }
});

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        correo: 'admin@siprod.gob.ar',
        contrasenaActual: hashedPassword,
        grado: Grado.CTE_GENERAL,
        nombre: 'Administrador del Sistema',
        rol: Rol.ADMINISTRADOR,
        cargo: 'Administrador',
        terminosCondiciones: true,
        activo: true
      }
    });

    console.log('Usuario administrador creado:', admin);

    // Crear registro de ejemplo en TablaPrincipal
    const registroEjemplo = await prisma.tablaPrincipal.create({
      data: {
        departamento: Departamento.MONTEVIDEO,
        unidad: Unidad.GEO,
        tipoOrden: TipoOrden.O_OP,
        nroOrden: "2025/001",
        tipoOperativo: TipoOperativo.OPERATIVO,
        tiempoOperativo: TiempoOperativo.PATRULLAJE,
        nombreOperativo: "Operativo Ejemplo 2025",
        fechaInicio: new Date("2025-01-11T00:00:00Z"),
        horaInicio: new Date("2025-01-11T14:00:00Z"),
        horaFin: new Date("2025-01-11T22:00:00Z"),
        fechaFin: new Date("2025-01-11T23:59:59Z"),
        observacionesOrden: "Registro de ejemplo para pruebas",
        seccional: [1, 2, 3],
        barrios: ["Centro", "Cordón", "Palermo"],
        moviles: 5,
        ppssEnMovil: 10,
        ssoo: 2,
        motos: 4,
        motosBitripuladas: 2,
        hipos: 0,
        canes: 2,
        pieTierra: 8,
        drones: 1,
        antidisturbioApostado: 20,
        antidisturbioAlerta: 10,
        geoApostado: 15,
        geoAlerta: 10,
        totalPpss: 82,
        createdBy: { connect: { id: admin.id } }
      }
    });

    console.log('Registro de ejemplo creado:', registroEjemplo);
  } catch (error) {
    console.error('Error al crear datos de ejemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();