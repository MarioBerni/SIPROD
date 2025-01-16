import { PrismaClient, Rol, Grado, Departamento, Unidad, TipoOrden, TipoOperativo, TiempoOperativo } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuario administrador
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Contraseña original:', password);
    console.log('Hash generado:', hashedPassword);
    
    const admin = await prisma.user.upsert({
      where: { correo: 'admin@siprod.uy' },
      update: {
        contrasenaActual: hashedPassword
      },
      create: {
        correo: 'admin@siprod.uy',
        contrasenaActual: hashedPassword,
        grado: Grado.CTE_MAYOR,
        nombre: 'Administrador del Sistema',
        rol: Rol.ADMINISTRADOR,
        cargo: 'Administrador',
        terminosCondiciones: true,
        registros: {
          create: [
            {
              departamento: Departamento.MONTEVIDEO,
              unidad: Unidad.DIRECCION_I,
              tipoOrden: TipoOrden.O_OP,
              nroOrden: '123/23',
              tipoOperativo: TipoOperativo.OPERATIVO,
              tiempoOperativo: TiempoOperativo.PATRULLAJE,
              nombreOperativo: 'Operativo de prueba',
              fechaInicio: new Date('2023-12-01'),
              horaInicio: new Date('2023-12-01T08:00:00Z'),
              horaFin: new Date('2023-12-01T16:00:00Z'),
              fechaFin: new Date('2023-12-01'),
              observacionesOrden: 'Observaciones de prueba',
              seccional: [1, 2, 3],
              barrios: ['Centro', 'Ciudad Vieja', 'Cordón'],
              moviles: 2,
              ppssEnMovil: 4,
              ssoo: 1,
              motos: 2,
              motosBitripuladas: 1,
              hipos: 0,
              canes: 0,
              pieTierra: 4,
              drones: 1,
              antidisturbioApostado: 0,
              antidisturbioAlerta: 0,
              geoApostado: 0,
              geoAlerta: 0,
              totalPpss: 10
            }
          ]
        }
      },
    });

    console.log({ admin });

    // Verificar que la contraseña funciona
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Verificación de contraseña:', isValid ? 'Correcta' : 'Incorrecta');
  } catch (error) {
    console.error('Error en seed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });