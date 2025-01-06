/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Grado" AS ENUM ('CTE_GENERAL', 'CTE_MAYOR', 'CAPITAN', 'TENIENTE_PRIMERO', 'TENIENTE', 'ALFEREZ', 'SUB_OFICIAL', 'SARGENTO', 'CABO', 'GUARDIA');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'OFICIAL', 'COMANDO_DIRECCION_I', 'COMANDO_DIRECCION_II', 'COMANDO_GEO', 'COMANDO_DNGR', 'JEFEDIA_DIRECCION_I', 'JEFEDIA_DIRECCION_II_Y_GEO');

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS')),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaFechaAcceso" TIMESTAMP(3),
    "contrasenaActual" TEXT NOT NULL,
    "nuevaContrasena" TEXT,
    "grado" "Grado" NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "cargo" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "terminosCondiciones" BOOLEAN NOT NULL DEFAULT false,
    "desplieguesCargados" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actualizaciones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actualizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserActualizaciones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserActualizaciones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_correo_key" ON "users"("correo");

-- CreateIndex
CREATE INDEX "_UserActualizaciones_B_index" ON "_UserActualizaciones"("B");

-- AddForeignKey
ALTER TABLE "_UserActualizaciones" ADD CONSTRAINT "_UserActualizaciones_A_fkey" FOREIGN KEY ("A") REFERENCES "actualizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserActualizaciones" ADD CONSTRAINT "_UserActualizaciones_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
