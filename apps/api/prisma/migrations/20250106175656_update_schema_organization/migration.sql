/*
  Warnings:

  - The primary key for the `_UserActualizaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `actualizaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contenido` on the `actualizaciones` table. All the data in the column will be lost.
  - The `id` column on the `actualizaciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `A` on the `_UserActualizaciones` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `descripcion` to the `actualizaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserActualizaciones" DROP CONSTRAINT "_UserActualizaciones_A_fkey";

-- AlterTable
ALTER TABLE "_UserActualizaciones" DROP CONSTRAINT "_UserActualizaciones_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_UserActualizaciones_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "actualizaciones" DROP CONSTRAINT "actualizaciones_pkey",
DROP COLUMN "contenido",
ADD COLUMN     "descripcion" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "actualizaciones_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tabla_principal" ALTER COLUMN "id" SET DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'));

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'));

-- AddForeignKey
ALTER TABLE "_UserActualizaciones" ADD CONSTRAINT "_UserActualizaciones_A_fkey" FOREIGN KEY ("A") REFERENCES "actualizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
