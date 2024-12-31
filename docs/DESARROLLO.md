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

### Jest + React Testing Library
```typescript
describe('UserComponent', () => {
  it('renders user information', () => {
    render(<UserComponent user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
});
```

### E2E con Playwright
```typescript
test('user login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

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
