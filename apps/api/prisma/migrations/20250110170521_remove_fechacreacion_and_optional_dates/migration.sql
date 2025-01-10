/*
  Warnings:

  - You are about to drop the column `fechaCreacion` on the `tabla_principal` table. All the data in the column will be lost.
  - You are about to drop the column `mapa` on the `tabla_principal` table. All the data in the column will be lost.
  - You are about to drop the column `puntosControl` on the `tabla_principal` table. All the data in the column will be lost.
  - You are about to drop the column `recorridos` on the `tabla_principal` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tabla_principal_fechaCreacion_idx";

-- AlterTable
ALTER TABLE "tabla_principal" DROP COLUMN "fechaCreacion",
DROP COLUMN "mapa",
DROP COLUMN "puntosControl",
DROP COLUMN "recorridos",
ALTER COLUMN "id" SET DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS')),
ALTER COLUMN "fechaInicio" DROP NOT NULL,
ALTER COLUMN "horaInicio" DROP NOT NULL,
ALTER COLUMN "horaFin" DROP NOT NULL,
ALTER COLUMN "fechaFin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'));
