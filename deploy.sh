#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Iniciando despliegue de SIPROD...${NC}"

# Actualizar código
echo -e "${BLUE}📥 Actualizando código desde el repositorio...${NC}"
git pull

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
pnpm install

# Backend
echo -e "${BLUE}🔧 Configurando Backend...${NC}"
cd apps/api
echo -e "${BLUE}🔮 Generando Prisma Client...${NC}"
pnpm prisma generate
echo -e "${BLUE}🏗️ Compilando Backend...${NC}"
pnpm build
cd ../..

# Frontend
echo -e "${BLUE}🎨 Compilando Frontend...${NC}"
cd apps/web
pnpm build
cd ../..

# Reiniciar PM2
echo -e "${BLUE}🔄 Reiniciando servicios con PM2...${NC}"
pm2 reload ecosystem.config.js

echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"

# Mostrar estado de los servicios
echo -e "${BLUE}📊 Estado actual de los servicios:${NC}"
pm2 status
