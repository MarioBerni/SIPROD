#!/bin/bash

# Verificar argumentos
if [ "$#" -ne 1 ]; then
    echo "Uso: $0 <timestamp_backup>"
    exit 1
fi

# Variables
TIMESTAMP=$1
BACKUP_DIR="/backup/siprod"
DB_CONTAINER="siprod-db"
DB_NAME="siprod"
DB_USER="postgres"

# Restaurar base de datos
echo "Restaurando base de datos..."
if [ -f "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" ]; then
    cat "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME
else
    echo "Error: Archivo de backup de base de datos no encontrado"
    exit 1
fi

# Restaurar archivos de configuración
echo "Restaurando archivos de configuración..."
if [ -f "$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz" ]; then
    tar -xzf "$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
else
    echo "Error: Archivo de backup de configuración no encontrado"
    exit 1
fi

echo "Restauración completada"
