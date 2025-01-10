-- CreateEnum
CREATE TYPE "Departamento" AS ENUM ('ARTIGAS', 'CANELONES', 'CERRO_LARGO', 'COLONIA', 'DURAZNO', 'FLORES', 'FLORIDA', 'LAVALLEJA', 'MALDONADO', 'MONTEVIDEO', 'PAYSANDU', 'RIO_NEGRO', 'RIVERA', 'ROCHA', 'SALTO', 'SAN_JOSE', 'SORIANO', 'TACUAREMBO', 'TREINTA_Y_TRES');

-- CreateEnum
CREATE TYPE "Unidad" AS ENUM ('DIRECCION_I', 'DIRECCION_II', 'GEO', 'REGIONAL_ESTE', 'REGIONAL_NORTE');

-- CreateEnum
CREATE TYPE "TipoOrden" AS ENUM ('O_OP', 'CIR', 'COM', 'ORD', 'SERV', 'REG');

-- CreateEnum
CREATE TYPE "TipoOperativo" AS ENUM ('OPERATIVO', 'PATRULLAJE', 'APOYO', 'GRUPO_CHOQUE_APOSTADO', 'GRUPO_CHOQUE_ALERTA', 'EQUIPO_CHOQUE_APOSTADO', 'EQUIPO_CHOQUE_ALERTA', 'GAT', 'GRUPO_GEO_APOSTADO', 'GRUPO_GEO_ALERTA', 'EQUIPO_GEO_APOSTADO', 'EQUIPO_GEO_ALERTA', 'PERIMETRAL_ALLANAMIENTO', 'INCURSION_ALLANAMIENTO', 'AUF', 'FUBB', 'ESPECTACULOS_VARIOS', 'OTROS');

-- CreateEnum
CREATE TYPE "TiempoOperativo" AS ENUM ('PATRULLAJE', 'PERM_ESTATICO', 'TRANSITORIO');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'));

-- CreateTable
CREATE TABLE "tabla_principal" (
    "id" TEXT NOT NULL DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS')),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departamento" "Departamento" NOT NULL,
    "unidad" "Unidad" NOT NULL,
    "tipoOrden" "TipoOrden" NOT NULL,
    "nroOrden" TEXT NOT NULL,
    "tipoOperativo" "TipoOperativo" NOT NULL,
    "tiempoOperativo" "TiempoOperativo" NOT NULL,
    "nombreOperativo" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "observacionesOrden" TEXT,
    "seccional" INTEGER[],
    "mapa" TEXT[],
    "puntosControl" TEXT[],
    "recorridos" TEXT[],
    "barrios" TEXT[],
    "moviles" INTEGER NOT NULL,
    "ppssEnMovil" INTEGER NOT NULL,
    "ssoo" INTEGER NOT NULL,
    "motos" INTEGER NOT NULL,
    "motosBitripuladas" INTEGER NOT NULL,
    "hipos" INTEGER NOT NULL,
    "canes" INTEGER NOT NULL,
    "pieTierra" INTEGER NOT NULL,
    "drones" INTEGER NOT NULL,
    "antidisturbioApostado" INTEGER NOT NULL,
    "antidisturbioAlerta" INTEGER NOT NULL,
    "geoApostado" INTEGER NOT NULL,
    "geoAlerta" INTEGER NOT NULL,
    "totalPpss" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "tabla_principal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tabla_principal_fechaCreacion_idx" ON "tabla_principal"("fechaCreacion");

-- CreateIndex
CREATE INDEX "tabla_principal_departamento_idx" ON "tabla_principal"("departamento");

-- CreateIndex
CREATE INDEX "tabla_principal_unidad_idx" ON "tabla_principal"("unidad");

-- CreateIndex
CREATE INDEX "tabla_principal_tipoOperativo_idx" ON "tabla_principal"("tipoOperativo");

-- AddForeignKey
ALTER TABLE "tabla_principal" ADD CONSTRAINT "tabla_principal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
