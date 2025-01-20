-- AlterTable
ALTER TABLE "escalafon_jefes" ALTER COLUMN "id" SET DEFAULT concat('ESC', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));

-- AlterTable
ALTER TABLE "tabla_principal" ALTER COLUMN "id" SET DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS'));
