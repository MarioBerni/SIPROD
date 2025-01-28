# Documentación de API SIPROD

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Autenticación](#autenticación)
3. [Endpoints](#endpoints)
4. [Modelos de Datos](#modelos-de-datos)
5. [Códigos de Estado](#códigos-de-estado)
6. [Ejemplos](#ejemplos)

## Visión General

La API de SIPROD sigue principios RESTful y utiliza JWT para autenticación. Todas las respuestas son en formato JSON.

```bash
# URL Base
Production: https://api.siprod.gub.uy/v1
Development: http://localhost:3001/v1
```

## Autenticación

### Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@policia.gub.uy",
  "password": "contraseña"
}
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "usuario@policia.gub.uy",
    "role": "USER"
  }
}
```

### Usar Token

```http
GET /api/protected-route
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Endpoints

### Usuarios

#### Obtener Usuario

```http
GET /users/{id}
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "id": "123",
  "email": "usuario@policia.gub.uy",
  "name": "Juan Pérez",
  "role": "USER",
  "department": "Montevideo",
  "createdAt": "2025-01-23T14:52:23Z"
}
```

#### Crear Usuario

```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "nuevo@policia.gub.uy",
  "password": "contraseña123",
  "name": "Nuevo Usuario",
  "role": "USER",
  "department": "Canelones"
}
```

### Estadísticas

#### Obtener Estadísticas por Departamento

```http
GET /statistics/department/{departmentId}
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "department": "Montevideo",
  "period": "2025-01",
  "metrics": {
    "incidentes": 150,
    "resueltos": 120,
    "enProceso": 30,
    "tiempoPromedioResolucion": "48h"
  },
  "categories": {
    "hurto": 45,
    "violenciaDomestica": 25,
    "accidentesTransito": 80
  }
}
```

#### Reporte por Período

```http
GET /statistics/report
Authorization: Bearer {token}
Query Parameters:
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
  - department: string (opcional)
```

### Recursos

#### Asignar Recursos

```http
POST /resources/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "resourceId": "vehicle_123",
  "assignedTo": "officer_456",
  "startDate": "2025-01-24T08:00:00Z",
  "endDate": "2025-01-24T16:00:00Z"
}
```

#### Estado de Recursos

```http
GET /resources/status
Authorization: Bearer {token}
Query Parameters:
  - type: string (vehicle|equipment|personnel)
  - department: string
  - available: boolean
```

## Modelos de Datos

### Usuario

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'SUPERVISOR';
  department: string;
  createdAt: string;
  lastLogin?: string;
}
```

### Estadística

```typescript
interface Statistic {
  id: string;
  departmentId: string;
  period: string;
  metrics: {
    incidentes: number;
    resueltos: number;
    enProceso: number;
    tiempoPromedioResolucion: string;
  };
  categories: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
```

### Recurso

```typescript
interface Resource {
  id: string;
  type: 'VEHICLE' | 'EQUIPMENT' | 'PERSONNEL';
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  department: string;
  currentAssignment?: {
    assignedTo: string;
    startDate: string;
    endDate: string;
  };
}
```

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Parámetros inválidos |
| 401 | Unauthorized - Autenticación requerida |
| 403 | Forbidden - No tiene permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## Ejemplos

### Flujo de Autenticación

```typescript
// 1. Login
const response = await fetch('https://api.siprod.gub.uy/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@policia.gub.uy',
    password: 'contraseña'
  })
});

const { token } = await response.json();

// 2. Usar el token
const protectedResponse = await fetch('https://api.siprod.gub.uy/v1/statistics/report', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await protectedResponse.json();
```

### Manejo de Errores

```typescript
try {
  const response = await fetch('https://api.siprod.gub.uy/v1/users/123');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
}
```

### Paginación

```http
GET /users?page=1&limit=10
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  }
}
```

## Mejores Prácticas

1. **Rate Limiting**
   - 100 requests/minuto por IP
   - 1000 requests/minuto por token autenticado

2. **Caché**
   - Usar los headers `Cache-Control` y `ETag`
   - Resultados de estadísticas cacheados por 5 minutos

3. **Seguridad**
   - Todos los endpoints requieren HTTPS
   - Tokens JWT expiran en 24 horas
   - Renovación de tokens mediante `/auth/refresh`

## Control de Versiones

La versión actual de la API es v1. Los cambios mayores se implementarán en nuevas versiones (v2, v3, etc.) manteniendo compatibilidad con versiones anteriores por al menos 6 meses.

## Herramientas

- [Documentación Swagger](https://api.siprod.gub.uy/docs)
- [Postman Collection](https://www.postman.com/siprod/workspace/public)
- [Herramienta de Testing](https://api.siprod.gub.uy/test)

## Soporte

Para problemas técnicos:
- Email: api-support@siprod.gub.uy
- Slack: #siprod-api-support
- Documentación: [Wiki](https://wiki.siprod.gub.uy/api)