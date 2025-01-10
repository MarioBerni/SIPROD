# SIPROD - Documentación Principal

## 📋 Visión General
SIPROD (Sistema de Gestión de Resultados Policiales y Recursos) es un monorepo que utiliza Turborepo para gestionar múltiples paquetes y aplicaciones. El proyecto está diseñado para centralizar y gestionar información policial crítica, facilitando la toma de decisiones y el análisis estadístico.

## 🏗️ Arquitectura y Estructura - SIPROD

### Objetivo
Profundizar en la arquitectura y la estructura general del proyecto SIPROD. Muestra cómo se organizan las carpetas, los paquetes, las apps y cómo interactúan entre sí.

### Función
- Describir cómo está estructurado el monorepo (apps, packages, docs).
- Detallar el stack tecnológico (frontend, backend, devops) y su razón de ser.
- Ofrecer un panorama global de los modelos principales y las estrategias de seguridad.

## 📁 Estructura del Monorepo

```
SIPROD/
├── apps/                      # Aplicaciones principales
│   ├── api/                   # Backend API
│   │   ├── prisma/           # Esquemas y migraciones de base de datos
│   │   ├── src/
│   │   │   ├── controllers/  # Controladores de la API
│   │   │   ├── middleware/   # Middleware de autenticación y validación
│   │   │   ├── routes/      # Definición de rutas
│   │   │   └── test/        # Tests unitarios y de integración
│   │   └── package.json
│   └── web/                   # Frontend Next.js
│       ├── src/
│       │   ├── app/          # Páginas y rutas de Next.js
│       │   │   ├── dashboard/  # Panel de control principal
│       │   │   │   ├── administrador/  # Área de administración
│       │   │   │   │   ├── usuarios/  # Gestión de usuarios
│       │   │   │   │   ├── mapas/     # Gestión de mapas y zonas
│       │   │   ├── profile/  # Gestión de perfil de usuario
│       │   │   └── login/    # Autenticación de usuarios
│       │   ├── components/   # Componentes React
│       │   ├── hooks/       # Hooks personalizados
│       │   └── types/       # Definiciones de tipos TypeScript
```

## 📊 Modelos de Base de Datos

### User
```prisma
model User {
  id                    String          @id @default(dbgenerated("concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'))"))
  fechaCreacion         DateTime        @default(now())
  ultimaFechaAcceso     DateTime?
  contrasenaActual      String
  nuevaContrasena       String?
  grado                 Grado
  nombre                String
  rol                   Rol
  cargo                 String
  correo                String          @unique
  terminosCondiciones   Boolean         @default(false)
  actualizacionesLeidas Actualizacion[] @relation("UserActualizaciones")
  desplieguesCargados   Int            @default(0)
  activo                Boolean         @default(true)
  updatedAt             DateTime        @updatedAt
  registrosCreados      TablaPrincipal[] @relation("CreadorRegistro")
}
```

### TablaPrincipal
```prisma
model TablaPrincipal {
  id                    String          @id @default(dbgenerated("concat('REG', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'))"))
  departamento          Departamento
  unidad               Unidad
  tipoOrden            TipoOrden
  nroOrden             String
  tipoOperativo        TipoOperativo
  tiempoOperativo      TiempoOperativo
  nombreOperativo      String
  fechaInicio          DateTime?
  horaInicio           DateTime?
  horaFin              DateTime?
  fechaFin             DateTime?
  observacionesOrden   String?
  seccional            Int[]
  barrios              String[]
  moviles              Int
  ppssEnMovil          Int
  ssoo                 Int
  motos                Int
  motosBitripuladas    Int
  hipos                Int
  canes                Int
  pieTierra            Int
  drones               Int
  antidisturbioApostado Int
  antidisturbioAlerta   Int
  geoApostado          Int
  geoAlerta            Int
  totalPpss            Int
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt
  createdBy            User            @relation("CreadorRegistro", fields: [createdById], references: [id])
  createdById          String
}
```

## 🔄 Cambios Recientes

### Actualización de Esquema (2025-01-10)
1. **TablaPrincipal**:
   - Eliminado campo `fechaCreacion` (reemplazado por `createdAt`)
   - Campos de fecha y hora ahora son opcionales:
     - `fechaInicio`
     - `horaInicio`
     - `horaFin`
     - `fechaFin`
   - Eliminados campos temporales no utilizados:
     - `mapa`
     - `puntosControl`
     - `recorridos`

2. **User**:
   - Campos actualizados para mejor gestión:
     - `fechaCreacion`: Fecha de creación del usuario
     - `ultimaFechaAcceso`: Última fecha de acceso (opcional)
     - `contrasenaActual`: Contraseña actual del usuario
     - `nuevaContrasena`: Nueva contraseña (opcional)
     - `desplieguesCargados`: Contador de despliegues

### Página de Usuarios
- Implementada en `/dashboard/administrador/usuarios`
- Funcionalidades:
  - Listado de usuarios con paginación
  - Filtrado por rol y estado
  - Creación y edición de usuarios
  - Gestión de roles y permisos
  - Activación/desactivación de usuarios
  - Reseteo de contraseñas

## 🔒 Seguridad y Autenticación
- Autenticación basada en JWT
- Roles y permisos granulares
- Middleware de autenticación en rutas protegidas
- Validación de datos en frontend y backend
- Encriptación de contraseñas con bcrypt