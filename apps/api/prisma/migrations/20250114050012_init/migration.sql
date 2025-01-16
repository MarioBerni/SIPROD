-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'SUPERVISOR', 'OPERADOR');

-- CreateEnum
CREATE TYPE "Grado" AS ENUM ('CTE_MAYOR', 'CTE', 'MAY', 'CAP', 'TTE_1RO', 'TTE', 'ALF', 'SGTO_1RO', 'SGTO', 'CABO_1RO', 'CABO_2DO', 'CABO', 'AG_1RA', 'AG_2DA', 'CADETE');

-- CreateEnum
CREATE TYPE "Departamento" AS ENUM ('Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto', 'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres');

-- CreateEnum
CREATE TYPE "Unidad" AS ENUM ('Dirección I', 'Dirección II', 'GEO', 'Regional Este', 'Regional Norte', 'Dirección V', 'Otras');

-- CreateEnum
CREATE TYPE "TipoOrden" AS ENUM ('O. Op.', 'Cir.', 'Com.', 'Ord. Serv.');

-- CreateEnum
CREATE TYPE "TipoOperativo" AS ENUM ('Operativo', 'Patrullaje', 'Apoyo', 'Grupo choque apostado', 'Grupo choque alerta', 'Equipo choque apostado', 'Equipo choque alerta', 'GAT', 'Grupo GEO apostado', 'Grupo GEO alerta', 'Equipo GEO apostado', 'Equipo GEO alerta', 'Perimetral allanamiento', 'Incursión allanamiento', 'AUF', 'FUBB', 'Espectaculos varios', 'Otros');

-- CreateEnum
CREATE TYPE "TiempoOperativo" AS ENUM ('Patrullaje', 'Perm. estatico', 'Transitorio');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT concat('USR', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS')),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_fecha_acceso" TIMESTAMP(3),
    "contrasena_actual" TEXT NOT NULL,
    "nueva_contrasena" TEXT,
    "grado" "Grado" NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "cargo" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "terminos_condiciones" BOOLEAN NOT NULL DEFAULT false,
    "despliegues_cargados" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabla_principal" (
    "id" TEXT NOT NULL DEFAULT concat('REG', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDDHHMMSS')),
    "departamento" "Departamento",
    "unidad" "Unidad",
    "tipo_orden" "TipoOrden",
    "nro_orden" TEXT,
    "tipo_operativo" "TipoOperativo",
    "tiempo_operativo" "TiempoOperativo",
    "nombre_operativo" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "hora_inicio" TIMESTAMP(3),
    "hora_fin" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "observaciones_orden" TEXT,
    "seccional" INTEGER[],
    "barrios" TEXT[],
    "moviles" INTEGER,
    "ppss_en_movil" INTEGER,
    "ssoo" INTEGER,
    "motos" INTEGER,
    "motos_bitripuladas" INTEGER,
    "hipos" INTEGER,
    "canes" INTEGER,
    "pie_tierra" INTEGER,
    "drones" INTEGER,
    "antidisturbio_apostado" INTEGER,
    "antidisturbio_alerta" INTEGER,
    "geo_apostado" INTEGER,
    "geo_alerta" INTEGER,
    "total_ppss" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "tabla_principal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_correo_key" ON "users"("correo");

-- AddForeignKey
ALTER TABLE "tabla_principal" ADD CONSTRAINT "tabla_principal_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
