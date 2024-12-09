# Crear directorios principales
New-Item -ItemType Directory -Force -Path apps
New-Item -ItemType Directory -Force -Path packages
New-Item -ItemType Directory -Force -Path docs
New-Item -ItemType Directory -Force -Path scripts

# Crear estructura de packages
New-Item -ItemType Directory -Force -Path packages/ui
New-Item -ItemType Directory -Force -Path packages/config
New-Item -ItemType Directory -Force -Path packages/types
New-Item -ItemType Directory -Force -Path packages/utils

# Mover frontend y backend a apps
if (Test-Path frontend) {
    Move-Item -Force frontend apps/
}
if (Test-Path backend) {
    Move-Item -Force backend apps/
}

# Crear package.json para cada paquete compartido
@"
{
  "name": "@siprod/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint \"src/**/*.ts*\"",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  }
}
"@ | Out-File -FilePath packages/ui/package.json -Encoding UTF8

@"
{
  "name": "@siprod/config",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint \"src/**/*.ts*\"",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  }
}
"@ | Out-File -FilePath packages/config/package.json -Encoding UTF8

@"
{
  "name": "@siprod/types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint \"src/**/*.ts*\"",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  }
}
"@ | Out-File -FilePath packages/types/package.json -Encoding UTF8

@"
{
  "name": "@siprod/utils",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint \"src/**/*.ts*\"",
    "clean": "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  }
}
"@ | Out-File -FilePath packages/utils/package.json -Encoding UTF8
