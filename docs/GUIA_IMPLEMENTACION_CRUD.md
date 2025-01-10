# Guía de Implementación CRUD en SIPROD

## Índice
1. [Estructura General](#estructura-general)
2. [Componentes y Archivos Reutilizables](#componentes-y-archivos-reutilizables)
3. [Base de Datos (Prisma)](#base-de-datos-prisma)
4. [Backend (API)](#backend-api)
5. [Frontend](#frontend)
6. [Flujo de Datos](#flujo-de-datos)
7. [Seguridad y Autenticación](#seguridad-y-autenticación)
8. [Ejemplo Práctico](#ejemplo-práctico)

## Estructura General

### Arquitectura del Proyecto
```
SIPROD/
├── apps/
│   ├── api/               # Backend
│   │   ├── prisma/       # Modelos y migraciones
│   │   └── src/          # Código fuente API
│   └── web/              # Frontend
│       └── src/
│           ├── app/      # Páginas Next.js
│           └── components/# Componentes React
└── docs/                 # Documentación
```

## Componentes y Archivos Reutilizables

### 1. Utilidades y Configuraciones Globales

#### API Client (`apps/web/src/lib/api.ts`)
```typescript
// Cliente axios preconfigurado
import { api } from '@/lib/api';
// Usar para todas las llamadas HTTP
```

#### Manejo de Errores (`apps/web/src/utils/error-handling.ts`)
```typescript
// Funciones de manejo de errores reutilizables
import { handleError } from '@/utils/error-handling';
```

#### Constantes (`apps/web/src/constants/index.ts`)
```typescript
// Valores y configuraciones compartidas
import { APP_ROUTES, API_ENDPOINTS } from '@/constants';
```

### 2. Componentes de UI Reutilizables

#### Layout Principal (`apps/web/src/components/layout/`)
- `DashboardLayout.tsx`: Layout base para todas las páginas del dashboard
- `Sidebar.tsx`: Barra lateral de navegación
- `Header.tsx`: Encabezado común
- `Footer.tsx`: Pie de página común

#### Componentes de Datos (`apps/web/src/components/data/`)
- `DataTable.tsx`: Tabla genérica con ordenamiento y filtrado
- `Pagination.tsx`: Componente de paginación
- `SearchBar.tsx`: Barra de búsqueda
- `FilterPanel.tsx`: Panel de filtros

#### Formularios (`apps/web/src/components/forms/`)
- `FormField.tsx`: Campo de formulario reutilizable
- `SelectField.tsx`: Campo de selección
- `DatePicker.tsx`: Selector de fecha
- `TimePicker.tsx`: Selector de hora
- `ValidationSchema.ts`: Esquemas de validación Yup

#### Modales (`apps/web/src/components/modals/`)
- `ConfirmDialog.tsx`: Diálogo de confirmación
- `FormModal.tsx`: Modal base para formularios
- `AlertDialog.tsx`: Diálogo de alertas

#### Loading y Estados (`apps/web/src/components/feedback/`)
- `LoadingSpinner.tsx`: Indicador de carga
- `ErrorBoundary.tsx`: Manejo de errores en componentes
- `StatusMessage.tsx`: Mensajes de estado

### 3. Hooks Personalizados (`apps/web/src/hooks/`)

#### Hooks de Datos
```typescript
// useDataFetching.ts
export const useDataFetching = (endpoint: string) => {
  // Lógica de fetching reutilizable
};

// useTableData.ts
export const useTableData = (config: TableConfig) => {
  // Lógica de tabla reutilizable
};

// usePagination.ts
export const usePagination = (totalItems: number) => {
  // Lógica de paginación
};
```

#### Hooks de Autenticación
```typescript
// useAuth.ts
export const useAuth = () => {
  // Lógica de autenticación
};

// usePermissions.ts
export const usePermissions = () => {
  // Verificación de permisos
};
```

### 4. Servicios Backend (`apps/api/src/`)

#### Middlewares (`apps/api/src/middlewares/`)
- `auth.middleware.ts`: Autenticación
- `error.middleware.ts`: Manejo de errores
- `validation.middleware.ts`: Validación de datos
- `logger.middleware.ts`: Logging

#### Utilidades (`apps/api/src/utils/`)
- `jwt.utils.ts`: Manejo de tokens JWT
- `password.utils.ts`: Encriptación de contraseñas
- `validation.utils.ts`: Funciones de validación
- `logger.ts`: Configuración de logging

#### Tipos (`apps/api/src/types/`)
```typescript
// common.types.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

// response.types.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

### 5. Prisma y Base de Datos

#### Cliente Prisma (`apps/api/prisma/client.ts`)
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

#### Migraciones Existentes (`apps/api/prisma/migrations/`)
- Revisar migraciones existentes antes de crear nuevas
- Reutilizar enums y tipos comunes

### 6. Configuraciones

#### Variables de Entorno
- `.env`: Variables globales
- `apps/api/.env`: Variables del backend
- `apps/web/.env`: Variables del frontend

#### TypeScript
- `tsconfig.json`: Configuración base
- `apps/api/tsconfig.json`: Configuración backend
- `apps/web/tsconfig.json`: Configuración frontend

### Guía de Uso

1. **Al Crear una Nueva Página**:
   - Extender `DashboardLayout`
   - Usar componentes de UI existentes
   - Implementar hooks personalizados relevantes

2. **Al Implementar Nuevas Funcionalidades**:
   - Revisar hooks existentes para reutilización
   - Usar el cliente API configurado
   - Implementar manejo de errores estándar

3. **Al Agregar Nuevos Modelos**:
   - Extender tipos existentes cuando sea posible
   - Reutilizar enums y validaciones
   - Seguir patrones de migración existentes

4. **Al Crear Nuevos Componentes**:
   - Verificar componentes existentes primero
   - Mantener consistencia con estilos existentes
   - Documentar para reutilización

### Ejemplo de Implementación

```typescript
// Nueva página que utiliza componentes existentes
import { DashboardLayout } from '@/components/layout';
import { DataTable } from '@/components/data';
import { FormModal } from '@/components/modals';
import { useDataFetching, useTableData } from '@/hooks';
import { api } from '@/lib/api';
import { handleError } from '@/utils/error-handling';

export default function NuevaPagina() {
  const { data, loading, error } = useDataFetching('/api/endpoint');
  const { tableProps } = useTableData(data);

  return (
    <DashboardLayout>
      <DataTable {...tableProps} />
      <FormModal />
    </DashboardLayout>
  );
}
```

## Base de Datos (Prisma)

### 1. Definición del Modelo
Ubicación: `apps/api/prisma/schema.prisma`

```prisma
model User {
  id                    String          @id @default(dbgenerated("concat('USR', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'))"))
  fechaCreacion         DateTime        @default(now())
  nombre                String
  correo                String          @unique
  rol                   Rol
  // ... otros campos
  
  @@map("users")
}
```

### 2. Migraciones
```bash
# Generar migración
npx prisma migrate dev --name add_new_model

# Aplicar migraciones
npx prisma migrate deploy
```

## Backend (API)

### 1. Controlador
Ubicación: `apps/api/src/controllers/user.controller.ts`

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userController = {
  // Obtener todos los registros
  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          correo: true,
          nombre: true,
          // ... campos seleccionados
        },
      });
      return res.json(users);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error interno' });
    }
  },

  // Crear nuevo registro
  createUser: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const user = await prisma.user.create({ data });
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error al crear' });
    }
  },

  // ... otros métodos CRUD
};
```

### 2. Rutas
Ubicación: `apps/api/src/routes/user.routes.ts`

```typescript
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
```

## Frontend

### 1. Página Principal
Ubicación: `apps/web/src/app/dashboard/administrador/usuarios/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  nombre: string;
  correo: string;
  // ... otros campos
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // ... resto del componente
}
```

### 2. Componentes de UI
```typescript
// Modal de Creación/Edición
const UserFormModal = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* ... campos del formulario */}
      </form>
    </Dialog>
  );
};
```

## Flujo de Datos

### 1. Operaciones CRUD

#### Crear
```typescript
const handleCreate = async (formData: UserFormData) => {
  try {
    const response = await api.post('/users', formData);
    setUsers(prev => [...prev, response.data]);
    showSuccess('Usuario creado exitosamente');
  } catch (error) {
    handleError(error);
  }
};
```

#### Actualizar
```typescript
const handleUpdate = async (id: string, formData: UserFormData) => {
  try {
    const response = await api.put(`/users/${id}`, formData);
    setUsers(prev => prev.map(user => 
      user.id === id ? response.data : user
    ));
    showSuccess('Usuario actualizado exitosamente');
  } catch (error) {
    handleError(error);
  }
};
```

#### Eliminar
```typescript
const handleDelete = async (id: string) => {
  try {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(user => user.id !== id));
    showSuccess('Usuario eliminado exitosamente');
  } catch (error) {
    handleError(error);
  }
};
```

## Seguridad y Autenticación

### 1. Middleware de Autenticación
Ubicación: `apps/api/src/middlewares/auth.middleware.ts`

```typescript
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    // Verificar token y agregar usuario a req
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
```

### 2. Cliente API
Ubicación: `apps/web/src/lib/api.ts`

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptores para manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirigir a login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

## Ejemplo Práctico

### Pasos para Implementar una Nueva Funcionalidad CRUD

1. **Definir el Modelo en Prisma**
   ```prisma
   model NuevoModelo {
     id            String   @id @default(dbgenerated("concat('PRE', to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'))"))
     fechaCreacion DateTime @default(now())
     // ... campos específicos
     createdBy     User     @relation(fields: [createdById], references: [id])
     createdById   String
   }
   ```

2. **Crear el Controlador**
   ```typescript
   export const nuevoController = {
     getAll: async (_req: Request, res: Response) => {
       try {
         const items = await prisma.nuevoModelo.findMany();
         return res.json(items);
       } catch (error) {
         return res.status(500).json({ message: 'Error interno' });
       }
     },
     // ... otros métodos CRUD
   };
   ```

3. **Definir las Rutas**
   ```typescript
   const router = Router();
   router.use(authMiddleware);
   router.get('/', nuevoController.getAll);
   // ... otras rutas
   ```

4. **Implementar la UI**
   ```typescript
   export default function NuevaPagina() {
     const [items, setItems] = useState([]);
     // ... lógica de estado y efectos
     return (
       <PageContainer>
         <DataTable data={items} />
         {/* ... otros componentes */}
       </PageContainer>
     );
   }
   ```

### Consideraciones Importantes

1. **Validaciones**
   - Validar datos en frontend antes de enviar
   - Validar en backend antes de operaciones DB
   - Usar tipos TypeScript para seguridad adicional

2. **Manejo de Errores**
   - Implementar try-catch en todas las operaciones
   - Mostrar feedback al usuario
   - Logging adecuado en backend

3. **Seguridad**
   - Verificar autenticación en cada ruta
   - Validar permisos según rol
   - Sanitizar datos de entrada

4. **Performance**
   - Usar paginación para grandes conjuntos de datos
   - Implementar caché cuando sea necesario
   - Optimizar consultas Prisma

## Conclusión

Esta guía proporciona una base sólida para implementar funcionalidades CRUD en SIPROD. Seguir estos patrones asegura:
- Consistencia en el código
- Mantenibilidad
- Seguridad
- Buena experiencia de usuario

Para implementaciones específicas, consultar los ejemplos existentes en el código base, especialmente la implementación de usuarios que sirve como referencia principal.
