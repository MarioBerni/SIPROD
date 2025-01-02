# 👨‍💻 Guía de Desarrollo

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### Configuración Inicial
```bash
# Clonar repositorio
git clone https://github.com/tu-org/siprod.git

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar desarrollo
pnpm dev
```

## 📝 Estándares de Código

### TypeScript
- Usar tipos explícitos
- Evitar `any`
- Documentar interfaces públicas

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function getUserById(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}
```

### React/Next.js
- Preferir Server Components
- Usar Client Components solo cuando sea necesario
- Implementar manejo de errores

```typescript
// Server Component
async function UserList() {
  const users = await getUsers();
  return <div>{users.map(user => <UserCard key={user.id} {...user} />)}</div>;
}

// Client Component
'use client';
function InteractiveForm() {
  // Lógica del cliente aquí
}
```

### API
- RESTful por defecto
- Documentar con OpenAPI/Swagger
- Validar inputs con Zod

```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER'])
});

app.post('/api/users', validateBody(userSchema), createUser);
```

## 🧪 Testing

### Configuración con Turborepo
El proyecto utiliza Turborepo para gestionar los tests en todo el monorepo, permitiendo una ejecución eficiente y paralela de los tests en todos los paquetes.

#### Ejecutar Tests
Para ejecutar todos los tests del monorepo:
```bash
pnpm test
```

Este comando utilizará Turborepo para:
- Ejecutar tests en paralelo
- Cachear resultados para ejecuciones más rápidas
- Manejar dependencias entre paquetes

#### Estructura de Tests

##### Frontend (@siprod/web)
- Framework: Jest + React Testing Library
- Configuración: `apps/web/jest.config.js`
- Setup: `apps/web/jest.setup.js`
- Ubicación: `apps/web/src/tests`

Ejemplo de test de componente:
```typescript
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders header with title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/SIPROD/i);
    expect(titleElement).toBeInTheDocument();
  });
});
```

##### Backend (@siprod/api)
- Framework: Jest
- Configuración: `apps/api/jest.config.js`
- Ubicación: `apps/api/src/tests`

##### Paquetes Compartidos
- @siprod/ui: Tests de componentes UI compartidos
- @siprod/utils: Tests de utilidades compartidas

#### Scripts Disponibles
```bash
# Test todos los paquetes
pnpm test

# Test con watch mode (específico por paquete)
cd apps/web
pnpm test:watch

# Test con cobertura
pnpm test:coverage

# Test paquete específico
cd apps/api
pnpm test
```

#### Mejores Prácticas
1. **Organización de Tests**
   - Mantener los tests junto al código (`__tests__` o `*.test.ts`)
   - Usar nombres descriptivos para los test suites

2. **Testing de Componentes**
   - Probar comportamiento, no implementación
   - Usar queries accesibles de Testing Library
   - Simular interacciones de usuario realistas

3. **Testing de API**
   - Probar endpoints principales
   - Validar respuestas y códigos de estado
   - Usar mocks para servicios externos

4. **Mantenimiento**
   - Mantener tests actualizados con cambios de código
   - Revisar y actualizar snapshots cuando sea necesario
   - Mantener la cobertura de código por encima del 80%

## 🔄 Control de Versiones

### Convenciones de Commits
- feat: Nueva característica
- fix: Corrección de bug
- docs: Documentación
- style: Formato
- refactor: Refactorización
- test: Tests
- chore: Mantenimiento

### Flujo de Ramas
```
main
  └── develop
       ├── feature/user-auth
       ├── fix/login-error
       └── docs/api-docs
```

## 📦 Despliegue

### Proceso
1. Tests pasan
2. Build exitoso
3. Review de código
4. Merge a develop
5. Deploy a staging
6. Pruebas de QA
7. Deploy a producción

### Comandos
```bash
# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Deploy
pnpm deploy
```

## 🔍 Debugging

### Backend
```typescript
logger.debug('User data:', { userId, action });
logger.error('Error in auth:', error);
```

### Frontend
```typescript
'use client';
useEffect(() => {
  console.debug('Component mounted', { props });
}, [props]);
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com/docs)
