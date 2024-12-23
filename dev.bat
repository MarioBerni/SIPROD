@echo off
echo 🚀 Iniciando entorno de desarrollo local...

REM Instalar dependencias
echo 📦 Instalando dependencias...
call pnpm install

REM Backend
echo 🔧 Configurando Backend...
cd apps/api

echo 🗃️ Configurando base de datos...
echo 🔄 Ejecutando migraciones de Prisma...
call pnpm prisma migrate deploy

echo 🔮 Generando Prisma Client...
call pnpm prisma generate

echo 🏗️ Compilando Backend...
call pnpm build
cd ../..

REM Frontend
echo 🎨 Compilando Frontend...
cd apps/web
call pnpm build
cd ../..

REM Detener instancias previas si existen
echo 🔄 Limpiando instancias previas...
call pm2 delete all

REM Iniciar con PM2
echo 🔄 Iniciando servicios con PM2...
call pm2 start ecosystem.local.config.js

REM Mostrar logs
echo 📊 Mostrando logs...
call pm2 logs
