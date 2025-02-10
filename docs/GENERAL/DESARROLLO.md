# Guía de Desarrollo SIPROD

## Tabla de Contenidos

1. [Instalación y Configuración](#instalación-y-configuración)
2. [Patrones y Estándares](#patrones-y-estándares)
3. [Desarrollo Frontend](#desarrollo-frontend)
4. [Desarrollo Backend](#desarrollo-backend)
5. [Gestión de Estado](#gestión-de-estado)
6. [Optimizaciones](#optimizaciones)
7. [Flujo de Trabajo](#flujo-de-trabajo)

## Instalación y Configuración

### Requisitos Previos
```bash
Node.js >= 18.0.0
pnpm >= 8.9.0
PostgreSQL >= 14
Redis >= 6
```

### Configuración Inicial
```bash
# Instalar pnpm si no está instalado
npm install -g pnpm

# Clonar el repositorio
git clone [repo-url]
cd siprod

# Instalar dependencias
pnpm install

# Configurar husky para commits
pnpm prepare
```

### Variables de Entorno
```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/siprod"

# JWT
JWT_SECRET="tu-secreto-seguro"

# Redis
REDIS_URL="redis://localhost:6379"

# API Keys
MAPBOX_TOKEN="tu-token-de-mapbox"
```

### Scripts Disponibles
```bash
# Desarrollo
pnpm dev          # Inicia todos los servicios
pnpm dev:web      # Solo frontend
pnpm dev:api      # Solo backend

# Build
pnpm build        # Construye todo el proyecto
pnpm build:web    # Solo frontend
pnpm build:api    # Solo backend

# Testing
pnpm test         # Ejecuta todos los tests
pnpm test:watch   # Modo watch
pnpm test:coverage # Cobertura

# Linting
pnpm lint         # Ejecuta ESLint
pnpm format       # Ejecuta Prettier
```

## Patrones y Estándares

### TypeScript

```typescript
// ✅ Correcto
interface UserData {
  id: string;
  name: string;
  role: UserRole;
}

// ❌ Incorrecto
interface userData {
  ID: string;
  Name: string;
  Role: string;
}
```

#### Reglas Principales
- Usar `interface` sobre `type` para definiciones de objetos
- Nombres de interfaces en PascalCase
- Nombres de variables y funciones en camelCase
- Tipos explícitos para parámetros de funciones
- Evitar el uso de `any`

### Estructura de Componentes

```typescript
components/
├── common/          // Componentes base reutilizables
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   └── Button.test.tsx
├── layout/          // Componentes de layout
├── features/        // Componentes específicos de feature
└── providers/       // Contextos y providers
```

### Patrones Frontend

#### Container/Presenter
```typescript
// features/Dashboard/
├── containers/
│   └── DashboardContainer.tsx    // Lógica y estado
├── components/
│   └── DashboardView.tsx        // UI pura
└── hooks/
    └── useDashboardData.ts      // Lógica de datos
```

#### Custom Hooks
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (credentials: Credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setUser(response.data.user);
    } catch (error) {
      throw new AuthError(error.message);
    }
  };
  
  return { user, login };
};
```

### Patrones Backend

#### Repository Pattern
```typescript
// repositories/UserRepository.ts
export class UserRepository {
  async findById(id: string): Promise<User> {
    return prisma.user.findUnique({ where: { id } });
  }
  
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }
}
```

#### Service Layer Pattern
```typescript
// services/UserService.ts
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthService
  ) {}
  
  async createUser(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(data.password);
    return this.userRepo.create({
      ...data,
      password: hashedPassword
    });
  }
}
```

## Gestión de Estado

### Context API
```typescript
// Ejemplo de Provider
const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### React Query
```typescript
// Custom hook con React Query
const useUsers = () => {
  return useQuery('users', async () => {
    const { data } = await api.get('/users');
    return data;
  });
};
```

## Optimizaciones

### Lazy Loading
```typescript
// pages/dashboard.tsx
const StatisticsChart = dynamic(
  () => import('@/components/StatisticsChart'),
  { loading: () => <Skeleton height={300} /> }
);
```

### Caching
```typescript
// utils/cache.ts
export const cacheMiddleware = (ttl: number) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = `cache:${req.url}`;
  const cached = await redis.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  res.sendResponse = res.json;
  res.json = (body: any) => {
    redis.setex(key, ttl, JSON.stringify(body));
    return res.sendResponse(body);
  };
  
  next();
};
```

## Flujo de Trabajo

### Pull Requests
- Título descriptivo
- Descripción detallada
- Referencias a issues
- Checklist de cambios
- Screenshots (si aplica)

### Revisión de Código
1. Verificar estándares de código
2. Revisar pruebas
3. Validar rendimiento
4. Confirmar documentación
5. Verificar seguridad

### Despliegue
1. Pruebas locales
2. Review en desarrollo
3. QA en staging
4. Despliegue a producción

## IDE y Herramientas

### VS Code
Extensiones recomendadas:
- ESLint
- Prettier
- TypeScript + JavaScript
- Material Icon Theme
- GitLens
- vscode-styled-components

Configuración workspace:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Base de Datos

### Prisma
```bash
# Generar cliente
pnpm prisma generate

# Sincronizar schema
pnpm prisma db push

# UI de administración
pnpm prisma studio
```

### Migraciones
```bash
# Crear migración
pnpm prisma migrate dev --name init

# Aplicar migraciones
pnpm prisma migrate deploy
```

## Recursos Adicionales

### Documentación Oficial
- [Next.js](https://nextjs.org/docs)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [Material-UI](https://mui.com/getting-started/installation/)

### Herramientas de Desarrollo
- Postman para pruebas de API
- Chrome DevTools
- React Developer Tools
- Database Management Tool (DBeaver/pgAdmin)

## Contribución

1. Crear rama desde develop
2. Implementar cambios siguiendo guías
3. Escribir/actualizar pruebas
4. Crear Pull Request
5. Esperar review y CI
6. Merge a develop

## Actualizaciones

Este documento se mantiene actualizado con cada release. Verificar el control de versiones para la última actualización.