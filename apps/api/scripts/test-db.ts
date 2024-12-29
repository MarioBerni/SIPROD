import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    console.log('Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('Conexión exitosa!');

    console.log('\nVerificando usuarios...');
    const users = await prisma.user.findMany();
    console.log('Usuarios encontrados:', users);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
}

testConnection();
