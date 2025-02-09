import { PrismaClient, Rol, Grado } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        correo: 'admin@siprod.gob.ar',
        contrasenaActual: 'admin123',
        grado: Grado.CTE_MAYOR,
        nombre: 'Administrador del Sistema',
        rol: Rol.ADMINISTRADOR,
        cargo: 'Administrador',
        terminosCondiciones: true,
        activo: true
      }
    });

    console.log('Usuario administrador creado:', admin);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
