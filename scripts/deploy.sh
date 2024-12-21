#!/bin/bash

# Variables
APP_DIR="/app/siprod"
BACKUP_SCRIPT="./backup.sh"

# Realizar backup antes del despliegue
echo "Realizando backup antes del despliegue..."
$BACKUP_SCRIPT

# Actualizar el código
echo "Actualizando el código..."
git pull origin main

# Construir y levantar contenedores
echo "Construyendo y levantando contenedores..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Verificar estado de los servicios
echo "Verificando estado de los servicios..."
docker-compose -f docker-compose.prod.yml ps

# Ejecutar migraciones si es necesario
echo "Ejecutando migraciones..."
docker-compose -f docker-compose.prod.yml exec backend pnpm prisma migrate deploy

echo "Despliegue completado"
