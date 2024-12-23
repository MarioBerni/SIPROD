#!/bin/bash

echo "🚀 Iniciando entorno de desarrollo local..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Backend
echo "🔧 Configurando Backend..."
cd apps/api

echo "🗃️ Configurando base de datos..."
echo "🔄 Ejecutando migraciones de Prisma..."
pnpm prisma migrate deploy

echo "🔮 Generando Prisma Client..."
pnpm prisma generate

echo "🏗️ Compilando Backend..."
pnpm build
cd ../..

# Frontend
echo "🎨 Compilando Frontend..."
cd apps/web
pnpm build
cd ../..

# Detener instancias previas si existen
echo "🔄 Limpiando instancias previas..."
pm2 delete all 2>/dev/null || true

# Iniciar con PM2
echo "🔄 Iniciando servicios con PM2..."
pm2 start ecosystem.local.config.js

# Mostrar logs
echo "📊 Mostrando logs..."
pm2 logs
