#!/bin/bash

# Variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/siprod"
DB_CONTAINER="siprod-db"
DB_NAME="siprod"
DB_USER="postgres"

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Backup de la base de datos
echo "Realizando backup de la base de datos..."
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup de archivos de configuración
echo "Realizando backup de archivos de configuración..."
tar -czf "$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz" \
    .env.production \
    docker-compose.prod.yml

echo "Backup completado: $TIMESTAMP"
