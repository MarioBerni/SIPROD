/*
  Warnings:

  - You are about to drop the column `mapa` on the `tabla_principal` table. All the data in the column will be lost.
  - You are about to drop the column `puntosControl` on the `tabla_principal` table. All the data in the column will be lost.
  - You are about to drop the column `recorridos` on the `tabla_principal` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Rol" ADD VALUE 'COMANDO_DIRECCION_I';
ALTER TYPE "Rol" ADD VALUE 'COMANDO_DIRECCION_II';
ALTER TYPE "Rol" ADD VALUE 'COMANDO_GEO';
ALTER TYPE "Rol" ADD VALUE 'COMANDO_DNGR';

-- AlterTable
ALTER TABLE "tabla_principal" DROP COLUMN "mapa",
DROP COLUMN "puntosControl",
DROP COLUMN "recorridos",
ALTER COLUMN "id" SET DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));
