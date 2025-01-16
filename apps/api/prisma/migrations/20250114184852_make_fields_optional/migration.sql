-- AlterTable
ALTER TABLE "tabla_principal" ADD COLUMN     "mapa" TEXT[],
ADD COLUMN     "puntosControl" TEXT[],
ADD COLUMN     "recorridos" TEXT[],
ALTER COLUMN "id" SET DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));
